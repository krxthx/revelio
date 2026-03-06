"use client";

import type { Chunk } from "@/lib/corpus";

interface Props {
  query: string | null;
  answer: string;
  streaming: boolean;
  retrievedChunks: Chunk[];
  error: string | null;
  onClear?: () => void;
}

const AnswerPanel = ({ query, answer, streaming, retrievedChunks, error, onClear }: Props) => {
  const idle = !query;

  return (
    <div className="flex flex-col gap-4">
      {/* Query echo */}
      {query && (
        <div className="rounded-md bg-muted px-4 py-3">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Query
            </p>
            {onClear && (
              <button
                onClick={onClear}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-sm text-foreground">{query}</p>
        </div>
      )}

      {/* Answer */}
      <div className="min-h-20 rounded-md bg-muted px-4 py-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Answer
        </p>
        {idle && (
          <p className="text-sm italic text-muted-foreground">
            Pick a query on the left to get started.
          </p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!idle && !error && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {answer || (streaming ? "" : "…")}
            {streaming && (
              <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-primary align-middle" />
            )}
          </p>
        )}
      </div>

      {/* Sources */}
      {retrievedChunks.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Sources ({retrievedChunks.length})
          </p>
          <div className="flex flex-col gap-2">
            {retrievedChunks.map((chunk, i) => (
              <div
                key={chunk.id}
                className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2"
              >
                <p className="mb-1 font-mono text-[10px] text-primary/70">
                  [{i + 1}] {chunk.id}
                </p>
                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {chunk.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerPanel;
