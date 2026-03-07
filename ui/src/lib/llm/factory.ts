/**
 * LLM adapter factory.
 *
 * Reads configuration from environment variables and returns the appropriate
 * adapter. All backends must be OpenAI-compatible (/v1/chat/completions).
 *
 * Environment variables:
 *   LLM_BASE_URL  - Base URL of the LLM API endpoint
 *                   Default: https://openrouter.ai/api/v1
 *
 *   LLM_MODEL     - Model identifier string passed to the API
 *                   Default: mistralai/mistral-7b-instruct:free
 *
 *   LLM_API_KEY   - API key used for authenticated providers
 */

import { OpenAICompatibleAdapter } from "./openai-compatible";
import {
  DEFAULT_LLM_API_KEY,
  DEFAULT_LLM_BASE_URL,
  DEFAULT_LLM_MODEL,
} from "./constants";
import type { LLMAdapter, LLMConfig } from "./types";

export const getLLMConfig = (override: Partial<LLMConfig> = {}): LLMConfig => {
  const baseUrl = override.baseUrl?.trim() || process.env.LLM_BASE_URL || DEFAULT_LLM_BASE_URL;
  const model = override.model?.trim() || process.env.LLM_MODEL || DEFAULT_LLM_MODEL;
  const apiKey = override.apiKey !== undefined
    ? override.apiKey.trim()
    : (process.env.LLM_API_KEY ?? DEFAULT_LLM_API_KEY);

  return { baseUrl, model, apiKey };
};

export const createLLMAdapter = (override: Partial<LLMConfig> = {}): LLMAdapter => {
  return new OpenAICompatibleAdapter(getLLMConfig(override));
};
