"use client";

import { useState } from "react";
import type { Chunk } from "@/lib/corpus";

const SYSTEM_PROMPT =
  "You are a helpful assistant. Answer the question using only the provided context. " +
  "If the context does not contain enough information to answer, say so.";

interface Props {
  query: string | null;
  retrievedChunks: Chunk[];
}

function buildPrompt(query: string, chunks: Chunk[]): string {
  const context = chunks.map((c, i) => `[${i + 1}] ${c.text}`).join("\n\n");
  return `Context:\n${context}\n\nQuestion: ${query}`;
}

export default function PromptBuilder({ query, retrievedChunks }: Props) {
  const [open, setOpen] = useState(false);
  const hasContent = query !== null && retrievedChunks.length > 0;

  return (
    <div className="rounded-lg border border-border bg-card/60 backdrop-blur">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Prompt Builder
        </span>
        <span className="text-muted-foreground text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          {!hasContent ? (
            <p className="text-xs text-muted-foreground italic">
              Select a query to see how the prompt is assembled.
            </p>
          ) : (
            <div className="flex flex-col gap-3 text-xs font-mono">
              <PromptSection label="system" color="text-blue-400">
                {SYSTEM_PROMPT}
              </PromptSection>
              {retrievedChunks.map((chunk, i) => (
                <PromptSection key={chunk.id} label={`context [${i + 1}]`} color="text-primary">
                  {chunk.text}
                </PromptSection>
              ))}
              <PromptSection label="user" color="text-green-400">
                {query}
              </PromptSection>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PromptSection({
  label,
  color,
  children,
}: {
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className={`mb-1 block text-[10px] uppercase tracking-wider ${color}`}>{label}</span>
      <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

// Keep buildPrompt available for external use
export { buildPrompt };
