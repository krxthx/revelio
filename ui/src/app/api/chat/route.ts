import { createLLMAdapter } from "@/lib/llm/factory";
import type { ChatMessage, LLMConfig, LLMRuntimeConfig } from "@/lib/llm/types";

const isChatMessage = (value: unknown): value is ChatMessage => {
  if (!value || typeof value !== "object") return false;

  const { role, content } = value as Record<string, unknown>;
  return (
    (role === "system" || role === "user" || role === "assistant") &&
    typeof content === "string"
  );
};

const parseBaseUrl = (value: unknown): string | null => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
};

const parseLLMOverride = (value: unknown): Partial<LLMConfig> | null => {
  if (value == null) return null;
  if (!value || typeof value !== "object") {
    throw new Error("llm must be an object");
  }

  const { provider, baseUrl, model, apiKey } = value as Partial<LLMRuntimeConfig>;
  if (provider == null || provider === "env") {
    return null;
  }

  if (provider !== "openai-compatible") {
    throw new Error("Unsupported LLM provider");
  }

  const normalizedBaseUrl = parseBaseUrl(baseUrl);
  if (!normalizedBaseUrl) {
    throw new Error("A valid baseUrl is required");
  }

  if (typeof model !== "string" || model.trim().length === 0) {
    throw new Error("A model is required");
  }

  if (typeof apiKey !== "string" || apiKey.trim().length === 0) {
    throw new Error("An API key is required for OpenAI-compatible mode");
  }

  return {
    baseUrl: normalizedBaseUrl,
    model: model.trim(),
    apiKey: apiKey.trim(),
  };
};

export const POST = async (req: Request): Promise<Response> => {
  let messages: ChatMessage[];
  let llmOverride: Partial<LLMConfig> | null = null;
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isChatMessage)) {
      return new Response("messages must be a non-empty array", { status: 400 });
    }
    llmOverride = parseLLMOverride(body.llm);
  } catch (err) {
    if (err instanceof Error && err.message !== "Invalid JSON body") {
      return new Response(err.message, { status: 400 });
    }
    return new Response("Invalid JSON body", { status: 400 });
  }

  try {
    const adapter = createLLMAdapter(llmOverride ?? {});
    const stream = await adapter.stream(messages);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "rate_limit") {
      return new Response(
        "Rate limited by provider. Add your own API key in Settings for higher limits.",
        { status: 429 },
      );
    }
    return new Response(`LLM error: ${message}`, { status: 502 });
  }
};
