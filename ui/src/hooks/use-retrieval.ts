import { useCallback, useEffect, useMemo, useState } from "react";
import { retrieve, retrieveMMR, type RetrievalMode, type ScoredChunk } from "@/lib/retrieval";
import type { Chunk, Corpus, Query } from "@/lib/corpus";

export interface UseRetrievalResult {
  selectedQuery: Query | null;
  selectedWord: Chunk | null;
  retrievedChunks: ScoredChunk[];
  retrievedIds: Set<string>;
  retrievedScores: Map<string, number>;
  hoveredChunk: Chunk | null;
  setHoveredChunk: (chunk: Chunk | null) => void;
  doRetrieve: (embedding: number[], chunks: Chunk[], k: number) => ScoredChunk[];
  applyQuery: (query: Query, top: ScoredChunk[]) => void;
  handleWordSelect: (word: Chunk) => void;
  reset: () => void;
}

export const useRetrieval = (
  corpus: Corpus | null,
  topK: number,
  retrievalMode: RetrievalMode,
): UseRetrievalResult => {
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [selectedWord, setSelectedWord] = useState<Chunk | null>(null);
  const [retrievedChunks, setRetrievedChunks] = useState<ScoredChunk[]>([]);
  const [retrievedIds, setRetrievedIds] = useState<Set<string>>(new Set());
  const [hoveredChunk, setHoveredChunk] = useState<Chunk | null>(null);

  // Min-max normalized scores [0.25, 1] so even lowest scorer is clearly visible
  const retrievedScores = useMemo(() => {
    const map = new Map<string, number>();
    if (retrievedChunks.length === 0) return map;
    const scores = retrievedChunks.map((s) => s.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const range = maxScore - minScore;
    for (const { chunk, score } of retrievedChunks) {
      const t = range > 0.005 ? (score - minScore) / range : 1;
      map.set(chunk.id, 0.25 + t * 0.75);
    }
    return map;
  }, [retrievedChunks]);

  const doRetrieve = useCallback(
    (embedding: number[], chunks: Chunk[], k: number): ScoredChunk[] =>
      retrievalMode === "mmr" ? retrieveMMR(embedding, chunks, k) : retrieve(embedding, chunks, k),
    [retrievalMode],
  );

  // Re-retrieve when topK or retrievalMode changes while a query is active.
  // Intentionally omits corpus/selectedQuery/doRetrieve to only react to setting changes.
  useEffect(() => {
    if (!corpus || !selectedQuery) return;
    const top = doRetrieve(selectedQuery.embedding, corpus.chunks, topK);
    setRetrievedChunks(top);
    setRetrievedIds(new Set(top.map((s) => s.chunk.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topK, retrievalMode]);

  const applyQuery = useCallback((query: Query, top: ScoredChunk[]) => {
    setSelectedQuery(query);
    setRetrievedChunks(top);
    setRetrievedIds(new Set(top.map((s) => s.chunk.id)));
  }, []);

  const handleWordSelect = useCallback(
    (word: Chunk) => {
      if (!corpus) return;
      setSelectedWord(word);
      const neighbors = doRetrieve(word.embedding, corpus.chunks, topK + 1).filter(
        (s) => s.chunk.id !== word.id,
      );
      setRetrievedChunks(neighbors);
      setRetrievedIds(new Set([word.id, ...neighbors.map((s) => s.chunk.id)]));
    },
    [corpus, topK, doRetrieve],
  );

  const reset = useCallback(() => {
    setSelectedQuery(null);
    setSelectedWord(null);
    setRetrievedChunks([]);
    setRetrievedIds(new Set());
  }, []);

  return {
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
    reset,
  };
};
