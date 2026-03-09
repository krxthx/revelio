"use client";

import { useEffect, useRef } from "react";
import { parseStreamingThink } from "@/lib/think-parser";
import type { ScoredChunk } from "@/lib/retrieval";

interface Props {
  query: string | null;
  answer: string;
  streaming: boolean;
  retrievedChunks: ScoredChunk[];
  error: string | null;
  onClear?: () => void;
}

const AnswerPanel = ({ query, answer, streaming, retrievedChunks, error, onClear }: Props) => {
  const idle = !query;
  const bottomRef = useRef<HTMLDivElement>(null);
  const { thinking, response, isThinking } = parseStreamingThink(answer);

  // Scroll to bottom as content streams in
  useEffect(() => {
    if (streaming) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [answer, streaming]);

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
          <div className="flex flex-col gap-2">
            {/* Thinking block */}
            {(thinking || isThinking) && (
              <div className="rounded-md border border-border bg-background/50 px-3 py-2">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {isThinking && !thinking ? "Thinking…" : "Reasoning"}
                </p>
                {thinking && (
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground italic">
                    {thinking}
                  </p>
                )}
                {isThinking && (
                  <span className="ml-0.5 inline-block h-2.5 w-0.5 animate-pulse bg-muted-foreground/50 align-middle" />
                )}
              </div>
            )}

            {/* Main response */}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {response || (!streaming && !isThinking ? "…" : "")}
              {streaming && !isThinking && (
                <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-primary align-middle" />
              )}
            </p>
          </div>
        )}
      </div>

      {/* Sources */}
      {retrievedChunks.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Sources ({retrievedChunks.length})
          </p>
          <div className="flex flex-col gap-2">
            {retrievedChunks.map(({ chunk, score }, i) => (
              <div
                key={chunk.id}
                className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="truncate font-mono text-[10px] text-primary/70">
                    [{i + 1}] {chunk.id}
                  </p>
                  <span
                    className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--primary) ${Math.round(score * 18)}%, transparent)`,
                      color: `color-mix(in srgb, var(--primary) 90%, var(--foreground))`,
                    }}
                    title="Cosine similarity"
                  >
                    {score.toFixed(3)}
                  </span>
                </div>
                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {chunk.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};

export default AnswerPanel;
