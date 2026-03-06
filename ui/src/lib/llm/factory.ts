/**
 * LLM adapter factory.
 *
 * Reads configuration from environment variables and returns the appropriate
 * adapter. All backends must be OpenAI-compatible (/v1/chat/completions).
 *
 * Environment variables:
 *   LLM_BASE_URL  - Base URL of the LLM API endpoint
 *                   Default: https://openrouter.ai/api/v1  (OpenRouter)
 *                   Ollama:  http://localhost:11434/v1
 *
 *   LLM_MODEL     - Model identifier string passed to the API
 *                   Default: mistralai/mistral-7b-instruct:free
 *                   Ollama example: mistral, llama3, phi3
 *
 *   LLM_API_KEY   - API key (for OpenRouter use your OR key; Ollama accepts any value)
 */

import { OpenAICompatibleAdapter } from "./openai-compatible";
import type { LLMAdapter } from "./types";

const DEFAULTS = {
  BASE_URL: "https://openrouter.ai/api/v1",
  MODEL: "mistralai/mistral-7b-instruct:free",
  API_KEY: "",
} as const;

export const createLLMAdapter = (): LLMAdapter => {
  const baseUrl = process.env.LLM_BASE_URL ?? DEFAULTS.BASE_URL;
  const model = process.env.LLM_MODEL ?? DEFAULTS.MODEL;
  const apiKey = process.env.LLM_API_KEY ?? DEFAULTS.API_KEY;

  return new OpenAICompatibleAdapter({ baseUrl, model, apiKey });
};
