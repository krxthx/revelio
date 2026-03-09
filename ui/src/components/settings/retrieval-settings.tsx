"use client";

import type { RetrievalMode } from "@/lib/retrieval";

const RETRIEVAL_OPTIONS: Array<{ id: RetrievalMode; label: string }> = [
  { id: "cosine", label: "Cosine" },
  { id: "mmr", label: "MMR" },
];

interface Props {
  retrievalMode: RetrievalMode;
  onRetrievalModeChange: (mode: RetrievalMode) => void;
  topK: number;
  onTopKChange: (value: number) => void;
  disabled?: boolean;
}

const RetrievalSettings = ({
  retrievalMode,
  onRetrievalModeChange,
  topK,
  onTopKChange,
  disabled,
}: Props) => (
  <div className="flex flex-col gap-4">
    <div>
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

    <div>
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
  </div>
);

export default RetrievalSettings;
