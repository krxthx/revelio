"use client";

import { useState, useMemo } from "react";
import type { Chunk } from "@/lib/corpus";

interface Props {
  words: Chunk[];
  selectedId: string | null;
  onSelect: (chunk: Chunk) => void;
}

const WordBrowser = ({ words, selectedId, onSelect }: Props) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return words;
    return words.filter((w) => w.text.toLowerCase().includes(q));
  }, [words, query]);

  return (
    <div className="flex flex-col gap-2 h-full">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Words
      </p>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search words…"
        className="w-full rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
      />
      <p className="text-[10px] text-muted-foreground">
        {filtered.length.toLocaleString()} word{filtered.length !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-col gap-0.5 overflow-y-auto flex-1 px-px">
        {filtered.slice(0, 200).map((w) => {
          const active = w.id === selectedId;
          return (
            <button
              key={w.id}
              onClick={() => onSelect(w)}
              className={[
                "rounded px-3 py-1.5 text-left text-sm transition-colors",
                active
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "text-foreground hover:bg-muted",
                "cursor-pointer",
              ].join(" ")}
            >
              {w.text}
            </button>
          );
        })}
        {filtered.length > 200 && (
          <p className="px-3 py-2 text-[11px] text-muted-foreground">
            Showing 200 of {filtered.length.toLocaleString()} - type to narrow
          </p>
        )}
      </div>
    </div>
  );
};

export default WordBrowser;
