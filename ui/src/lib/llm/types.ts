export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMAdapter {
  stream(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>>;
}

export interface LLMConfig {
  baseUrl: string;
  model: string;
  apiKey: string;
}

export type LLMProviderMode = "env" | "openai-compatible";

export interface LLMRuntimeConfig {
  provider: LLMProviderMode;
  baseUrl: string;
  model: string;
  apiKey: string;
}

export interface LLMConfigSummary {
  baseUrl: string | null;
  model: string | null;
}
