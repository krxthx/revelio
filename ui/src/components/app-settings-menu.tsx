"use client";

import { useEffect, useRef, useState } from "react";
import { Settings2, X } from "lucide-react";
import { ACCENT_OPTIONS, type AccentId } from "@/lib/theme";
import type { CorpusId } from "@/lib/corpus";
import type { LLMRuntimeConfig } from "@/lib/llm/types";
import type { RetrievalMode } from "@/lib/retrieval";
import LlmSettings from "./settings/llm-settings";
import CorpusSettings from "./settings/corpus-settings";
import RetrievalSettings from "./settings/retrieval-settings";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
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

          <div className="flex flex-col gap-4">
            <LlmSettings
              envModel={envModel}
              envBaseUrl={envBaseUrl}
              llmConfig={llmConfig}
              onLlmConfigChange={onLlmConfigChange}
              disabled={disabled}
            />
            <CorpusSettings
              corpusId={corpusId}
              onCorpusChange={onCorpusChange}
              disabled={disabled}
            />
            <RetrievalSettings
              retrievalMode={retrievalMode}
              onRetrievalModeChange={onRetrievalModeChange}
              topK={topK}
              onTopKChange={onTopKChange}
              disabled={disabled}
            />
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
        </div>
      )}
    </div>
  );
};

export default AppSettingsMenu;
