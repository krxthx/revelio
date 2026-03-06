import { createLLMAdapter } from "@/lib/llm/factory";
import type { ChatMessage } from "@/lib/llm/types";

export const POST = async (req: Request): Promise<Response> => {
  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("messages must be a non-empty array", { status: 400 });
    }
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  try {
    const adapter = createLLMAdapter();
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
    return new Response(`LLM error: ${message}`, { status: 502 });
  }
};
