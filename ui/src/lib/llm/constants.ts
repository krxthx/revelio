import type { LLMConfigSummary, LLMProviderMode, LLMRuntimeConfig } from "./types";

export const DEFAULT_LLM_BASE_URL = "https://openrouter.ai/api/v1";
export const DEFAULT_LLM_MODEL = "mistralai/mistral-7b-instruct:free";
export const DEFAULT_LLM_API_KEY = "";

export const DEFAULT_OPENAI_COMPAT_BASE_URL = DEFAULT_LLM_BASE_URL;
export const DEFAULT_OPENAI_COMPAT_MODEL = "meta-llama/llama-3.1-8b-instruct";

export const RAG_SYSTEM_PROMPT =
  "You are a helpful assistant. Relevant passages from the document corpus are provided as context below. " +
  "Answer the user's question directly and concisely based on the provided context. " +
  "Never say the context is insufficient or that information is missing — synthesize what is there and give your best answer.";

export const DEFAULT_RUNTIME_LLM_CONFIG: LLMRuntimeConfig = {
  provider: "env",
  baseUrl: DEFAULT_OPENAI_COMPAT_BASE_URL,
  model: DEFAULT_OPENAI_COMPAT_MODEL,
  apiKey: "",
};

export const EMPTY_LLM_CONFIG_SUMMARY: LLMConfigSummary = {
  baseUrl: null,
  model: null,
};

export const LLM_PROVIDER_OPTIONS: Array<{ id: LLMProviderMode; label: string }> = [
  { id: "env", label: "Env" },
  { id: "openai-compatible", label: "OpenAI Compat" },
];

export const LLM_PROVIDER_PRESETS: Record<
  Exclude<LLMProviderMode, "env">,
  Pick<LLMRuntimeConfig, "baseUrl" | "model" | "apiKey">
> = {
  "openai-compatible": {
    baseUrl: DEFAULT_OPENAI_COMPAT_BASE_URL,
    model: DEFAULT_OPENAI_COMPAT_MODEL,
    apiKey: "",
  },
};

export const LLM_BASE_URL_PLACEHOLDERS: Record<LLMProviderMode, string> = {
  env: "",
  "openai-compatible": DEFAULT_OPENAI_COMPAT_BASE_URL,
};

export const LLM_MODEL_PLACEHOLDERS: Record<LLMProviderMode, string> = {
  env: "",
  "openai-compatible": DEFAULT_OPENAI_COMPAT_MODEL,
};
