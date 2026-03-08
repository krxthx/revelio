"use client";

import { useEffect, useRef, useState } from "react";
import { Settings2, X } from "lucide-react";
import { ACCENT_OPTIONS, type AccentId } from "@/lib/theme";
import {
  CORPUS_IDS,
  CORPUS_LABELS,
  loadManifest,
  type CorpusId,
  type ManifestEntry,
} from "@/lib/corpus";
import {
  LLM_BASE_URL_PLACEHOLDERS,
  LLM_MODEL_PLACEHOLDERS,
  LLM_PROVIDER_OPTIONS,
  LLM_PROVIDER_PRESETS,
} from "@/lib/llm/constants";
import type { LLMProviderMode, LLMRuntimeConfig } from "@/lib/llm/types";
import type { RetrievalMode } from "@/lib/retrieval";

interface Props {
  topK: number;
  onTopKChange: (value: number) => void;
  retrievalMode: RetrievalMode;
  onRetrievalModeChange: (mode: RetrievalMode) => void;
  accentId: AccentId;
  onAccentChange: (id: AccentId) => void;
  corpusId: CorpusId;
  onCorpusChange: (id: CorpusId) => void;
  disabled?: boolean;
  envModel?: string | null;
  envBaseUrl?: string | null;
  llmConfig: LLMRuntimeConfig;
  onLlmConfigChange: (config: LLMRuntimeConfig) => void;
}

const RETRIEVAL_OPTIONS: Array<{ id: RetrievalMode; label: string }> = [
  { id: "cosine", label: "Cosine" },
  { id: "mmr", label: "MMR" },
];

const CorpusButton = ({
  id,
  label,
  active,
  disabled,
  onClick,
}: {
  id: string;
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <button
    key={id}
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={[
      "rounded-md border px-2.5 py-2 text-left text-xs transition-colors",
      active
        ? "border-primary/50 bg-primary/10 text-foreground"
        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    ].join(" ")}
  >
    {label}
  </button>
);

const AppSettingsMenu = ({
  topK,
  onTopKChange,
  retrievalMode,
  onRetrievalModeChange,
  accentId,
  onAccentChange,
  corpusId,
  onCorpusChange,
  disabled,
  envModel,
  envBaseUrl,
  llmConfig,
  onLlmConfigChange,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [customEntries, setCustomEntries] = useState<ManifestEntry[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load custom corpus manifest once on mount
  useEffect(() => {
    loadManifest().then(setCustomEntries).catch(() => {});
  }, []);

  const updateLLMConfig = (patch: Partial<LLMRuntimeConfig>) => {
    onLlmConfigChange({ ...llmConfig, ...patch });
  };

  const handleProviderChange = (provider: LLMProviderMode) => {
    if (provider === "env") {
      onLlmConfigChange({ ...llmConfig, provider });
      return;
    }

    onLlmConfigChange({
      provider,
      ...LLM_PROVIDER_PRESETS[provider],
    });
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card/70 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open settings"
        disabled={disabled}
      >
        <Settings2 className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-64 rounded-lg border border-border bg-card p-3 shadow-xl">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Settings
              </p>
              <p className="text-[11px] text-muted-foreground/75">
                Tune retrieval, corpus, and accent colors.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close settings"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mb-4">
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
                    className="w-full rounded-md border border-border bg-background px-2.5 py-2 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50"
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
                    className="w-full rounded-md border border-border bg-background px-2.5 py-2 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50"
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
                      className="w-full rounded-md border border-border bg-background px-2.5 py-2 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50"
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="mb-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Corpus
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CORPUS_IDS.map((id) => (
                <CorpusButton
                  key={id}
                  id={id}
                  label={CORPUS_LABELS[id]}
                  active={id === corpusId}
                  disabled={disabled}
                  onClick={() => onCorpusChange(id)}
                />
              ))}
            </div>

            {customEntries.length > 0 && (
              <div className="mt-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Your Projects
                </p>
                <select
                  value={customEntries.some((e) => e.id === corpusId) ? corpusId : ""}
                  onChange={(e) => e.target.value && onCorpusChange(e.target.value)}
                  disabled={disabled}
                  className="w-full rounded-md border border-border bg-background px-2.5 py-2 text-xs text-foreground outline-none transition-colors focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>Select a project…</option>
                  {customEntries.map((entry) => (
                    <option key={entry.id} value={entry.id}>{entry.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mb-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Retrieval
            </p>
            <div className="grid grid-cols-2 gap-2">
              {RETRIEVAL_OPTIONS.map((option) => {
                const active = option.id === retrievalMode;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onRetrievalModeChange(option.id)}
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
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Top K
              </span>
              <span className="w-5 text-right text-xs text-foreground">{topK}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={topK}
              onChange={(event) => onTopKChange(Number(event.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Accent
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ACCENT_OPTIONS.map((accent) => {
                const active = accent.id === accentId;
                return (
                  <button
                    key={accent.id}
                    type="button"
                    onClick={() => onAccentChange(accent.id)}
                    className={[
                      "flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs transition-colors",
                      active
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                    aria-label={`Use ${accent.label} accent`}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full border border-white/20"
                      style={{ backgroundColor: accent.value }}
                    />
                    {accent.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSettingsMenu;
