import type { Chunk } from "./corpus";

const TOP_K = 5;
const SIMILARITY_THRESHOLD = 0.3;
const MMR_LAMBDA = 0.5;

export type RetrievalMode = "cosine" | "mmr";

export interface ScoredChunk {
  chunk: Chunk;
  /** Cosine similarity between the query and this chunk (0–1). */
  score: number;
}

export const cosineSimilarity = (a: number[], b: number[]): number => {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
};

export const retrieve = (
  queryEmbedding: number[],
  chunks: Chunk[],
  topK: number = TOP_K,
): ScoredChunk[] => {
  const scored = chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).filter((s) => s.score >= SIMILARITY_THRESHOLD);
};

export const retrieveMMR = (
  queryEmbedding: number[],
  chunks: Chunk[],
  topK: number = TOP_K,
): ScoredChunk[] => {
  const candidates = chunks
    .map((chunk) => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .filter((c) => c.score >= SIMILARITY_THRESHOLD);

  const selected: ScoredChunk[] = [];

  while (selected.length < topK && candidates.length > 0) {
    let bestIdx = -1;
    let bestMMR = -Infinity;

    for (let i = 0; i < candidates.length; i++) {
      const { chunk, score } = candidates[i];
      const maxSimilarityToSelected =
        selected.length === 0
          ? 0
          : Math.max(...selected.map((s) => cosineSimilarity(chunk.embedding, s.chunk.embedding)));

      const mmrScore = MMR_LAMBDA * score - (1 - MMR_LAMBDA) * maxSimilarityToSelected;
      if (mmrScore > bestMMR) {
        bestMMR = mmrScore;
        bestIdx = i;
      }
    }

    if (bestIdx === -1) break;
    selected.push(candidates[bestIdx]);
    candidates.splice(bestIdx, 1);
  }

  return selected;
};
