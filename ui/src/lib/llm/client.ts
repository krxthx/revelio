import type { Chunk } from "@/lib/corpus";

import { RAG_SYSTEM_PROMPT } from "./constants";
import type { ChatMessage, LLMConfigSummary, LLMRuntimeConfig } from "./types";

export const fetchLLMConfigSummary = async (): Promise<LLMConfigSummary> => {
  const response = await fetch("/api/config");
  if (!response.ok) {
    throw new Error(`Config request failed (${response.status})`);
  }

  const data = await response.json();
  return {
    baseUrl: typeof data.baseUrl === "string" ? data.baseUrl : null,
    model: typeof data.model === "string" ? data.model : null,
  };
};

export const buildRagMessages = (query: string, chunks: Chunk[]): ChatMessage[] => {
  const context = chunks.map((chunk, index) => `[${index + 1}] ${chunk.text}`).join("\n\n");
  const userMessage =
    `Context:\n${context}\n\n` +
    `Question: ${query}\n` +
    `Important: If the question misattributes an object or action to the wrong character, explicitly correct the misattribution before answering.`;

  return [
    { role: "system", content: RAG_SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ];
};

interface StreamChatOptions {
  messages: ChatMessage[];
  llmConfig: LLMRuntimeConfig;
  onChunk: (text: string) => void;
  signal: AbortSignal;
}

export const streamChatResponse = async ({
  messages,
  llmConfig,
  onChunk,
  signal,
}: StreamChatOptions): Promise<void> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      messages,
      llm: llmConfig,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    if (response.status === 429) {
      throw new Error(body || "Rate limited. Add your own API key in Settings for higher limits.");
    }
    throw new Error(body || `HTTP ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("LLM response has no body");
  }

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
};
