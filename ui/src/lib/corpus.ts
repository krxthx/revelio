export type CorpusId = "alice" | "fastapi" | "space";

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
};

export const CORPUS_IDS: CorpusId[] = ["alice", "fastapi", "space"];

export async function loadCorpus(id: CorpusId): Promise<Corpus> {
  const res = await fetch(`/data/${id}.json`);
  if (!res.ok) throw new Error(`Failed to load corpus "${id}": ${res.status}`);
  return res.json() as Promise<Corpus>;
}
