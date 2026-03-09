"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  CORPUS_IDS,
  CORPUS_LABELS,
  loadManifest,
  type CorpusId,
  type ManifestEntry,
} from "@/lib/corpus";

const FIELD_CLASS_NAME =
  "w-full rounded-md border border-border bg-muted/70 px-2.5 py-2 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50";

interface Props {
  corpusId: CorpusId;
  onCorpusChange: (id: CorpusId) => void;
  disabled?: boolean;
}

const CorpusSettings = ({ corpusId, onCorpusChange, disabled }: Props) => {
  const [customEntries, setCustomEntries] = useState<ManifestEntry[]>([]);

  useEffect(() => {
    loadManifest().then(setCustomEntries).catch(() => {});
  }, []);

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Corpus
      </p>
      <div className="grid grid-cols-2 gap-2">
        {CORPUS_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onCorpusChange(id)}
            disabled={disabled}
            className={[
              "rounded-md border px-2.5 py-2 text-left text-xs transition-colors",
              id === corpusId
                ? "border-primary/50 bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            ].join(" ")}
          >
            {CORPUS_LABELS[id]}
          </button>
        ))}
      </div>

      {customEntries.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Your Projects
          </p>
          <div className="relative">
            <select
              value={customEntries.some((e) => e.id === corpusId) ? corpusId : ""}
              onChange={(e) => e.target.value && onCorpusChange(e.target.value)}
              disabled={disabled}
              className={`${FIELD_CLASS_NAME} appearance-none pr-9`}
            >
              <option value="" disabled>Select a project…</option>
              {customEntries.map((entry) => (
                <option key={entry.id} value={entry.id}>{entry.label}</option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CorpusSettings;
