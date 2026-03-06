"use client";

import { CORPUS_IDS, CORPUS_LABELS, type CorpusId } from "@/lib/corpus";

interface Props {
  selected: CorpusId;
  onChange: (id: CorpusId) => void;
  disabled?: boolean;
}

export default function CorpusSelector({ selected, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Corpus
      </span>
      <div className="flex gap-1">
        {CORPUS_IDS.map((id) => (
          <button
            key={id}
            onClick={() => !disabled && onChange(id)}
            disabled={disabled}
            className={[
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              id === selected
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            ].join(" ")}
          >
            {CORPUS_LABELS[id]}
          </button>
        ))}
      </div>
    </div>
  );
}
