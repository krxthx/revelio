export type CorpusId = "alice" | "fastapi" | "space" | "words";

export interface Chunk {
  id: string;
  text: string;
  embedding: number[];
  x: number;
  y: number;
  z: number;
}

export interface Query {
  id: string;
  text: string;
  embedding: number[];
}

export interface Corpus {
  corpus: CorpusId;
  model: string;
  chunks: Chunk[];
  queries: Query[];
}

export const CORPUS_LABELS: Record<CorpusId, string> = {
  alice: "Alice in Wonderland",
  fastapi: "FastAPI Docs",
  space: "Space Exploration",
  words: "Word Embeddings",
};

export const CORPUS_IDS: CorpusId[] = ["alice", "fastapi", "space", "words"];
export const QUERY_CORPUS_IDS: CorpusId[] = ["alice", "fastapi", "space"];

export const isWordCorpus = (id: CorpusId): boolean => id === "words";

export const loadCorpus = async (id: CorpusId): Promise<Corpus> => {
  const res = await fetch(`/data/${id}.json`);
  if (!res.ok) throw new Error(`Failed to load corpus "${id}": ${res.status}`);
  return res.json() as Promise<Corpus>;
};
