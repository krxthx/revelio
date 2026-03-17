import type {
  LLMConfigSummary,
  LLMProviderMode,
  LLMRuntimeConfig,
} from "./types";

export const DEFAULT_LLM_BASE_URL = "https://openrouter.ai/api/v1";
export const DEFAULT_LLM_MODEL =
  "mistralai/mistral-small-3.1-24b-instruct:free";
export const DEFAULT_LLM_API_KEY = "";

export const DEFAULT_OPENAI_COMPAT_BASE_URL = DEFAULT_LLM_BASE_URL;
export const DEFAULT_OPENAI_COMPAT_MODEL = "meta-llama/llama-3.1-8b-instruct";
export const RAG_SYSTEM_PROMPT =
  "You are a precise question-answering assistant. " +
  "Answer ONLY using the exact information in the provided context passages. " +
  "Do not paraphrase dialogue — reproduce it closely and attribute it to the correct character. " +
  "Do not infer, speculate, or add literary analysis, commentary, or interpretation. " +
  "Do not include details from outside the directly relevant passage. " +
  "Do not add information that was not explicitly stated in the context. " +
  "Answer the question directly and stop — do not pad or over-explain. " +
  "Do not add closing remarks, follow-up offers, or any conversational filler. " +
  "Do not use emoji. " +
  "End your response immediately after answering the question." +
  "If the context does not contain the answer, say exactly: 'I could not find this in the provided passages.'";

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

export const LLM_PROVIDER_OPTIONS: Array<{
  id: LLMProviderMode;
  label: string;
}> = [
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
