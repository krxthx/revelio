"use client";

import type { Query } from "@/lib/corpus";

interface Props {
  queries: Query[];
  selectedId: string | null;
  onSelect: (query: Query) => void;
  disabled?: boolean;
}

const QuerySelector = ({ queries, selectedId, onSelect, disabled }: Props) => {
  if (queries.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Example Queries
      </p>
      {queries.map((q) => {
        const active = q.id === selectedId;
        return (
          <button
            key={q.id}
            onClick={() => !disabled && onSelect(q)}
            disabled={disabled}
            className={[
              "rounded-md px-3 py-2 text-left text-sm transition-colors",
              active
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : "text-foreground hover:bg-muted hover:text-foreground",
              disabled && !active ? "cursor-not-allowed opacity-40" : "cursor-pointer",
            ].join(" ")}
          >
            {q.text}
          </button>
        );
      })}
    </div>
  );
};

export default QuerySelector;
