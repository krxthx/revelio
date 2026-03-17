"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import NavBar from "@/components/nav-bar";
import QuerySelector from "@/components/query-selector";
import FreeTextQuery from "@/components/free-text-query";
import WordBrowser from "@/components/word-browser";
import PromptBuilder from "@/components/prompt-builder";
import AnswerPanel from "@/components/answer-panel";
import SimilarWords from "@/components/similar-words";
import ChunkTooltip from "@/components/chunk-tooltip";
import AppSettingsMenu from "@/components/app-settings-menu";
import { useAccent } from "@/components/accent-provider";

import { isWordCorpus, isCustomCorpus, type CorpusId, type Query } from "@/lib/corpus";
import {
  EMPTY_LLM_CONFIG_SUMMARY,
  DEFAULT_RUNTIME_LLM_CONFIG,
} from "@/lib/llm/constants";
import { buildRagMessages, fetchLLMConfigSummary } from "@/lib/llm/client";
import type { RetrievalMode } from "@/lib/retrieval";

import { useCorpus } from "@/hooks/use-corpus";
import { useRetrieval } from "@/hooks/use-retrieval";
import { useStreamingAnswer } from "@/hooks/use-streaming-answer";

const EmbeddingSpace = dynamic(() => import("@/components/embedding-space"), {
  ssr: false,
});

const DEFAULT_CORPUS: CorpusId = "words";

const Demo = () => {
  const [corpusId, setCorpusId] = useState<CorpusId>(DEFAULT_CORPUS);
  const { corpus, loading, loadError } = useCorpus(corpusId);

  const [topK, setTopK] = useState(5);
  const [retrievalMode, setRetrievalMode] = useState<RetrievalMode>("cosine");
  const { accentId, accentColor, setAccentId } = useAccent();

  const [envLLMConfig, setEnvLLMConfig] = useState(EMPTY_LLM_CONFIG_SUMMARY);
  const [llmConfig, setLlmConfig] = useState(DEFAULT_RUNTIME_LLM_CONFIG);

  const {
    selectedQuery,
    selectedWord,
    retrievedChunks,
    retrievedIds,
    retrievedScores,
    hoveredChunk,
    setHoveredChunk,
    doRetrieve,
    applyQuery,
    handleWordSelect,
    reset: resetRetrieval,
  } = useRetrieval(corpus, topK, retrievalMode);

  const { answer, streaming, answerError, stream, reset: resetStream } = useStreamingAnswer(llmConfig);

  const focusTarget = useMemo<[number, number, number] | null>(() => {
    if (retrievedChunks.length === 0) return null;
    const n = retrievedChunks.length;
    return [
      retrievedChunks.reduce((s, sc) => s + sc.chunk.x, 0) / n,
      retrievedChunks.reduce((s, sc) => s + sc.chunk.y, 0) / n,
      retrievedChunks.reduce((s, sc) => s + sc.chunk.z, 0) / n,
    ];
  }, [retrievedChunks]);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchLLMConfigSummary().then(setEnvLLMConfig).catch(() => {});
  }, []);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    resetRetrieval();
    resetStream();
  }, [resetRetrieval, resetStream]);

  const handleCorpusChange = useCallback(
    (id: CorpusId) => {
      abortRef.current?.abort();
      resetRetrieval();
      resetStream();
      setCorpusId(id);
    },
    [resetRetrieval, resetStream],
  );

  const handleQuerySelect = useCallback(
    async (query: Query) => {
      if (!corpus) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const top = doRetrieve(query.embedding, corpus.chunks, topK);
      applyQuery(query, top);

      const messages = buildRagMessages(query.text, top.map((s) => s.chunk));
      await stream(messages, controller.signal);
    },
    [corpus, doRetrieve, topK, applyQuery, stream],
  );

  return (
    <div className="relative flex h-screen flex-col bg-background text-foreground overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 55% 35% at 15% 5%, color-mix(in srgb, ${accentColor} 10%, transparent), transparent),
            radial-gradient(ellipse 45% 30% at 85% 8%, color-mix(in srgb, ${accentColor} 7%, transparent), transparent),
            radial-gradient(ellipse 35% 40% at 50% 95%, color-mix(in srgb, ${accentColor} 5%, transparent), transparent)
          `,
        }}
      />
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
      <NavBar
        rightSlot={
          <AppSettingsMenu
            topK={topK}
            onTopKChange={setTopK}
            retrievalMode={retrievalMode}
            onRetrievalModeChange={setRetrievalMode}
            accentId={accentId}
            onAccentChange={setAccentId}
            corpusId={corpusId}
            onCorpusChange={handleCorpusChange}
            disabled={loading || streaming}
            envModel={envLLMConfig.model}
            envBaseUrl={envLLMConfig.baseUrl}
            llmConfig={llmConfig}
            onLlmConfigChange={setLlmConfig}
          />
        }
      />

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <aside className="shrink-0 overflow-x-hidden overflow-y-auto border-b border-border px-3 py-4 lg:w-72 lg:border-b-0 lg:border-r lg:flex lg:flex-col">
          {loading ? (
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 rounded-md bg-muted animate-pulse"
                />
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
            ) : isCustomCorpus(corpusId) ? (
              <FreeTextQuery
                onSubmit={handleQuerySelect}
                disabled={streaming}
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

        <main className="relative h-[40vh] shrink-0 lg:h-auto lg:flex-1">
          {corpus && (
            <EmbeddingSpace
              chunks={corpus.chunks}
              retrievedIds={retrievedIds}
              retrievedScores={retrievedScores}
              streaming={streaming}
              retrievedColor={accentColor}
              onHoverChunk={setHoveredChunk}
              onClickChunk={
                isWordCorpus(corpusId) ? handleWordSelect : undefined
              }
              graphCenter={
                isWordCorpus(corpusId) ? (selectedWord ?? undefined) : undefined
              }
              graphNeighbors={
                isWordCorpus(corpusId) ? retrievedChunks.map((s) => s.chunk) : undefined
              }
              autoRotate={!selectedQuery && !selectedWord}
              focusTarget={focusTarget}
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
          <ChunkTooltip
            chunk={hoveredChunk}
            score={hoveredChunk ? retrievedScores?.get(hoveredChunk.id) : undefined}
          />
        </main>

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

      </div>

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
