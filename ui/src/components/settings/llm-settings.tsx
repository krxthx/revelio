"use client";

import {
  LLM_BASE_URL_PLACEHOLDERS,
  LLM_MODEL_PLACEHOLDERS,
  LLM_PROVIDER_OPTIONS,
  LLM_PROVIDER_PRESETS,
} from "@/lib/llm/constants";
import type { LLMProviderMode, LLMRuntimeConfig } from "@/lib/llm/types";

const FIELD_CLASS_NAME =
  "w-full rounded-md border border-border bg-muted/70 px-2.5 py-2 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50";

interface Props {
  envModel?: string | null;
  envBaseUrl?: string | null;
  llmConfig: LLMRuntimeConfig;
  onLlmConfigChange: (config: LLMRuntimeConfig) => void;
  disabled?: boolean;
}

const LlmSettings = ({ envModel, envBaseUrl, llmConfig, onLlmConfigChange, disabled }: Props) => {
  const updateLLMConfig = (patch: Partial<LLMRuntimeConfig>) => {
    onLlmConfigChange({ ...llmConfig, ...patch });
  };

  const handleProviderChange = (provider: LLMProviderMode) => {
    if (provider === "env") {
      onLlmConfigChange({ ...llmConfig, provider });
      return;
    }
    onLlmConfigChange({ provider, ...LLM_PROVIDER_PRESETS[provider] });
  };

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        LLM
      </p>
      <div className="grid grid-cols-2 gap-2">
        {LLM_PROVIDER_OPTIONS.map((option) => {
          const active = option.id === llmConfig.provider;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleProviderChange(option.id)}
              disabled={disabled}
              className={[
                "rounded-md border px-2 py-2 text-[11px] transition-colors",
                active
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground/60">
        BYOK recommended - free models have rate limits.
      </p>

      {llmConfig.provider === "env" ? (
        <div className="mt-3 rounded-md border border-border bg-muted/50 px-3 py-2">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Server Defaults
          </p>
          <p className="truncate font-mono text-[11px] text-foreground">
            {envModel ?? "No env model configured"}
          </p>
          {envBaseUrl && (
            <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
              {envBaseUrl}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Base URL
            </span>
            <input
              type="text"
              value={llmConfig.baseUrl}
              onChange={(event) => updateLLMConfig({ baseUrl: event.target.value })}
              disabled={disabled}
              placeholder={LLM_BASE_URL_PLACEHOLDERS[llmConfig.provider]}
              className={FIELD_CLASS_NAME}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Model
            </span>
            <input
              type="text"
              value={llmConfig.model}
              onChange={(event) => updateLLMConfig({ model: event.target.value })}
              disabled={disabled}
              placeholder={LLM_MODEL_PLACEHOLDERS[llmConfig.provider]}
              className={FIELD_CLASS_NAME}
            />
          </label>

          {llmConfig.provider === "openai-compatible" && (
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                API Key
              </span>
              <input
                type="password"
                value={llmConfig.apiKey}
                onChange={(event) => updateLLMConfig({ apiKey: event.target.value })}
                disabled={disabled}
                placeholder="sk-..."
                className={FIELD_CLASS_NAME}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
};

export default LlmSettings;
