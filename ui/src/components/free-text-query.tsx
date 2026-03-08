"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { embedQuery, warmUpEmbedder, type EmbedderStatus } from "@/lib/embedder";
import type { Query } from "@/lib/corpus";

interface Props {
  onSubmit: (query: Query) => void;
  disabled?: boolean;
}

const FreeTextQuery = ({ onSubmit, disabled }: Props) => {
  const [text, setText] = useState("");
  const [embedderStatus, setEmbedderStatus] = useState<EmbedderStatus>("idle");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Warm up the model as soon as the component mounts so it is ready by the
  // time the user types their first question.
  useEffect(() => {
    setEmbedderStatus("loading");
    warmUpEmbedder()
      .then(() => setEmbedderStatus("ready"))
      .catch(() => setEmbedderStatus("idle"));
  }, []);

  const isReady = embedderStatus === "ready";
  const canSubmit = isReady && !disabled && !submitting && text.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const trimmed = text.trim();
    setSubmitting(true);
    try {
      const embedding = await embedQuery(trimmed);
      const query: Query = {
        id: `freetext-${Date.now()}`,
        text: trimmed,
        embedding,
      };
      onSubmit(query);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Ask a Question
      </p>

      {embedderStatus === "loading" && (
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
          Loading model (one-time download)…
        </div>
      )}

      <div className={[
        "flex flex-col rounded-md border bg-background transition-colors",
        "focus-within:border-primary/50 border-border",
        (!isReady || disabled || submitting) ? "opacity-50" : "",
      ].join(" ")}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isReady || disabled || submitting}
          placeholder={isReady ? "Ask anything…" : "Waiting for model…"}
          rows={3}
          className="w-full resize-none bg-transparent px-3 pt-2 pb-1 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed"
        />
        <div className="flex items-center justify-between px-2 pb-2">
          <p className="text-[10px] text-muted-foreground/60">
            Shift+Enter for newline
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            aria-label="Submit query"
            className={[
              "flex h-6 w-6 items-center justify-center rounded-md transition-colors",
              canSubmit
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
            ].join(" ")}
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeTextQuery;
