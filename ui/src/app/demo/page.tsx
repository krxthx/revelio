"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import NavBar from "@/components/nav-bar";
import QuerySelector from "@/components/query-selector";
import WordBrowser from "@/components/word-browser";
import PromptBuilder from "@/components/prompt-builder";
import AnswerPanel from "@/components/answer-panel";
import SimilarWords from "@/components/similar-words";
import ChunkTooltip from "@/components/chunk-tooltip";
import AppSettingsMenu from "@/components/app-settings-menu";
import { useAccent } from "@/components/accent-provider";

import { loadCorpus, isWordCorpus, type Chunk, type Corpus, type CorpusId, type Query } from "@/lib/corpus";
import { retrieve } from "@/lib/retrieval";

// R3F canvas must be client-only (no SSR)
const EmbeddingSpace = dynamic(() => import("@/components/embedding-space"), { ssr: false });

const DEFAULT_CORPUS: CorpusId = "alice";
const SYSTEM_PROMPT =
  "You are a helpful assistant. Answer the question using only the provided context. " +
  "If the context does not contain enough information to answer, say so.";

// ---------------------------------------------------------------------------
// LLM streaming helper
// ---------------------------------------------------------------------------

const streamAnswer = async (
  query: string,
  chunks: Chunk[],
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> => {
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
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const Demo = () => {
  const [corpusId, setCorpusId] = useState<CorpusId>(DEFAULT_CORPUS);
  const [corpus, setCorpus] = useState<Corpus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [topK, setTopK] = useState(5);
  const [llmModel, setLlmModel] = useState<string | null>(null);
  const { accentId, accentColor, setAccentId } = useAccent();

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => setLlmModel(data.model ?? null))
      .catch(() => {});
  }, []);

  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [selectedWord, setSelectedWord] = useState<Chunk | null>(null);
  const [retrievedChunks, setRetrievedChunks] = useState<Chunk[]>([]);
  const [retrievedIds, setRetrievedIds] = useState<Set<string>>(new Set());

  const [hoveredChunk, setHoveredChunk] = useState<Chunk | null>(null);

  const [answer, setAnswer] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // Load corpus whenever corpusId changes
  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    setSelectedQuery(null);
    setSelectedWord(null);
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
    setSelectedWord(null);
    setRetrievedChunks([]);
    setRetrievedIds(new Set());
    setAnswer("");
    setAnswerError(null);
  }, []);

  const handleWordSelect = useCallback(
    (word: Chunk) => {
      if (!corpus) return;
      setSelectedWord(word);
      // Retrieve nearest neighbors, excluding the word itself
      const neighbors = retrieve(word.embedding, corpus.chunks, topK + 1).filter(
        (c) => c.id !== word.id,
      );
      setRetrievedChunks(neighbors);
      setRetrievedIds(new Set([word.id, ...neighbors.map((c) => c.id)]));
    },
    [corpus, topK],
  );

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
      <NavBar
        rightSlot={
          <AppSettingsMenu
            topK={topK}
            onTopKChange={setTopK}
            accentId={accentId}
            onAccentChange={setAccentId}
            corpusId={corpusId}
            onCorpusChange={handleCorpusChange}
            disabled={loading || streaming}
            model={llmModel}
          />
        }
      />

      {/* Main layout — desktop: 3-col, mobile: stacked */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Left sidebar — query selector or word browser */}
        <aside className="shrink-0 overflow-x-hidden overflow-y-auto border-b border-border px-3 py-4 lg:w-72 lg:border-b-0 lg:border-r lg:flex lg:flex-col">
          {loading ? (
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-9 rounded-md bg-muted animate-pulse" />
              ))}
            </div>
          ) : loadError ? (
            <p className="text-xs text-destructive">{loadError}</p>
          ) : corpus ? (
            isWordCorpus(corpusId) ? (
              <WordBrowser
                words={corpus.chunks}
                selectedId={selectedWord?.id ?? null}
                onSelect={handleWordSelect}
              />
            ) : (
              <QuerySelector
                queries={corpus.queries}
                selectedId={selectedQuery?.id ?? null}
                onSelect={handleQuerySelect}
                disabled={streaming}
              />
            )
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
              onClickChunk={isWordCorpus(corpusId) ? handleWordSelect : undefined}
              graphCenter={isWordCorpus(corpusId) ? selectedWord ?? undefined : undefined}
              graphNeighbors={isWordCorpus(corpusId) ? retrievedChunks : undefined}
              autoRotate={!selectedQuery && !selectedWord}
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

        {/* Right sidebar — prompt builder + answer, or similar words for word corpus */}
        <aside className="flex shrink-0 flex-col gap-4 overflow-y-auto border-t border-border px-4 py-4 lg:w-96 lg:border-l lg:border-t-0">
          {isWordCorpus(corpusId) ? (
            <SimilarWords
              selectedWord={selectedWord?.text ?? null}
              similarWords={retrievedChunks}
              accentColor={accentColor}
              onClear={selectedWord ? handleReset : undefined}
            />
          ) : (
            <>
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
            </>
          )}
        </aside>
      </div>

      {/* Streaming toast — fixed bottom-center */}
      {streaming && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-full border border-primary/20 bg-card px-4 py-2.5 shadow-lg">
          <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <span className="text-sm text-foreground">Generating answer…</span>
        </div>
      )}
    </div>
  );
};

export default Demo;
