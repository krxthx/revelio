"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import CorpusSelector from "@/components/CorpusSelector";
import QuerySelector from "@/components/QuerySelector";
import PromptBuilder from "@/components/PromptBuilder";
import AnswerPanel from "@/components/AnswerPanel";
import ChunkTooltip from "@/components/ChunkTooltip";
import AppSettingsMenu from "@/components/AppSettingsMenu";

import { loadCorpus, type Chunk, type Corpus, type CorpusId, type Query } from "@/lib/corpus";
import { retrieve } from "@/lib/retrieval";
import { ACCENT_OPTIONS, type AccentId } from "@/lib/theme";

// R3F canvas must be client-only (no SSR)
const EmbeddingSpace = dynamic(() => import("@/components/EmbeddingSpace"), { ssr: false });

const DEFAULT_CORPUS: CorpusId = "alice";
const DEFAULT_ACCENT: AccentId = "orange";
const SYSTEM_PROMPT =
  "You are a helpful assistant. Answer the question using only the provided context. " +
  "If the context does not contain enough information to answer, say so.";

// ---------------------------------------------------------------------------
// LLM streaming helper
// ---------------------------------------------------------------------------

async function streamAnswer(
  query: string,
  chunks: Chunk[],
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const context = chunks.map((c, i) => `[${i + 1}] ${c.text}`).join("\n\n");
  const userMessage = `Context:\n${context}\n\nQuestion: ${query}`;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `HTTP ${res.status}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Home() {
  const [corpusId, setCorpusId] = useState<CorpusId>(DEFAULT_CORPUS);
  const [corpus, setCorpus] = useState<Corpus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [topK, setTopK] = useState(5);
  const [accentId, setAccentId] = useState<AccentId>(DEFAULT_ACCENT);

  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [retrievedChunks, setRetrievedChunks] = useState<Chunk[]>([]);
  const [retrievedIds, setRetrievedIds] = useState<Set<string>>(new Set());

  const [hoveredChunk, setHoveredChunk] = useState<Chunk | null>(null);

  const [answer, setAnswer] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const accentColor =
    ACCENT_OPTIONS.find((option) => option.id === accentId)?.value ?? ACCENT_OPTIONS[0].value;

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", accentColor);
  }, [accentColor]);

  // Load corpus whenever corpusId changes
  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    setSelectedQuery(null);
    setRetrievedChunks([]);
    setRetrievedIds(new Set());
    setAnswer("");
    setAnswerError(null);
    abortRef.current?.abort();

    loadCorpus(corpusId)
      .then(setCorpus)
      .catch((err: unknown) => setLoadError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [corpusId]);

  // Re-retrieve when topK changes and a query is already selected
  useEffect(() => {
    if (!corpus || !selectedQuery) return;
    const top = retrieve(selectedQuery.embedding, corpus.chunks, topK);
    setRetrievedChunks(top);
    setRetrievedIds(new Set(top.map((c) => c.id)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topK]);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setSelectedQuery(null);
    setRetrievedChunks([]);
    setRetrievedIds(new Set());
    setAnswer("");
    setAnswerError(null);
  }, []);

  const handleQuerySelect = useCallback(
    async (query: Query) => {
      if (!corpus) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setSelectedQuery(query);
      setAnswer("");
      setAnswerError(null);

      const top = retrieve(query.embedding, corpus.chunks, topK);
      setRetrievedChunks(top);
      setRetrievedIds(new Set(top.map((c) => c.id)));

      setStreaming(true);
      try {
        await streamAnswer(
          query.text,
          top,
          (chunk) => setAnswer((prev) => prev + chunk),
          controller.signal,
        );
      } catch (err: unknown) {
        if ((err as { name?: string }).name === "AbortError") return;
        setAnswerError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setStreaming(false);
      }
    },
    [corpus, topK],
  );

  const handleCorpusChange = (id: CorpusId) => {
    abortRef.current?.abort();
    setCorpusId(id);
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border px-5 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-tight text-foreground">Revelio</span>
          <span className="text-xs text-muted-foreground">RAG Explorer</span>
        </div>
        <div className="flex items-center gap-3">
          <CorpusSelector
            selected={corpusId}
            onChange={handleCorpusChange}
            disabled={loading || streaming}
          />
          <AppSettingsMenu
            topK={topK}
            onTopKChange={setTopK}
            accentId={accentId}
            onAccentChange={setAccentId}
          />
        </div>
      </header>

      {/* Main layout — desktop: 3-col, mobile: stacked */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Left sidebar — query selector */}
        <aside className="shrink-0 overflow-x-hidden overflow-y-auto border-b border-border px-3 py-4 lg:w-72 lg:border-b-0 lg:border-r">
          {loading ? (
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-9 rounded-md bg-muted animate-pulse" />
              ))}
            </div>
          ) : loadError ? (
            <p className="text-xs text-destructive">{loadError}</p>
          ) : corpus ? (
            <QuerySelector
              queries={corpus.queries}
              selectedId={selectedQuery?.id ?? null}
              onSelect={handleQuerySelect}
              disabled={streaming}
            />
          ) : null}
        </aside>

        {/* Centre — 3D embedding space */}
        <main className="relative h-[40vh] shrink-0 lg:h-auto lg:flex-1">
          {corpus && (
            <EmbeddingSpace
              chunks={corpus.chunks}
              retrievedIds={retrievedIds}
              streaming={streaming}
              retrievedColor={accentColor}
              onHoverChunk={setHoveredChunk}
            />
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-6 w-6 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Loading corpus…</p>
              </div>
            </div>
          )}
          <ChunkTooltip chunk={hoveredChunk} />
        </main>

        {/* Right sidebar — prompt builder + answer; hidden by default on mobile, toggle */}
        <aside className="flex shrink-0 flex-col gap-4 overflow-y-auto border-t border-border px-4 py-4 lg:w-96 lg:border-l lg:border-t-0">
          <PromptBuilder
            query={selectedQuery?.text ?? null}
            retrievedChunks={retrievedChunks}
          />
          <AnswerPanel
            query={selectedQuery?.text ?? null}
            answer={answer}
            streaming={streaming}
            retrievedChunks={retrievedChunks}
            error={answerError}
            onClear={selectedQuery && !streaming ? handleReset : undefined}
          />
        </aside>
      </div>

      {/* Streaming toast — fixed bottom-right */}
      {streaming && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border border-primary/20 bg-card px-4 py-3 shadow-lg">
          <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <span className="text-sm text-foreground">Generating answer…</span>
        </div>
      )}
    </div>
  );
}
