"use client";

import type { ScoredChunk } from "@/lib/retrieval";

interface Props {
  selectedWord: string | null;
  similarWords: ScoredChunk[];
  accentColor: string;
  onClear?: () => void;
}

const SimilarWords = ({ selectedWord, similarWords, accentColor, onClear }: Props) => {
  if (!selectedWord) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Similar Words
        </p>
        <p className="text-xs text-muted-foreground">
          Select a word to see its nearest semantic neighbors.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Similar Words
      </p>
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span
            className="text-lg font-semibold"
            style={{ color: accentColor }}
          >
            {selectedWord}
          </span>
          <span className="text-xs text-muted-foreground">→ nearest neighbors</span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {similarWords.map(({ chunk: w, score }) => (
          <div
            key={w.id}
            className="flex flex-col items-center gap-0.5"
          >
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
                border: `1px solid ${accentColor}30`,
              }}
            >
              {w.text}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/60">
              {score.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarWords;
