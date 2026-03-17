export const BUILTIN_CORPUS_IDS = ["alice", "fastapi", "space", "words"] as const;
export type BuiltInCorpusId = (typeof BUILTIN_CORPUS_IDS)[number];

export type CorpusId = string;

export interface Chunk {
  id: string;
  text: string;
  embedding: number[];
  x: number;
  y: number;
  z: number;
  /** Filename of the source document — present only in custom corpora. */
  source?: string;
}

export interface Query {
  id: string;
  text: string;
  embedding: number[];
}

export interface Corpus {
  corpus: string;
  label?: string;
  model: string;
  chunks: Chunk[];
  queries: Query[];
}


export const CORPUS_LABELS: Record<BuiltInCorpusId, string> = {
  alice: "Alice in Wonderland",
  fastapi: "FastAPI Docs",
  space: "Space Exploration",
  words: "Word Embeddings",
};

export const CORPUS_IDS: BuiltInCorpusId[] = [...BUILTIN_CORPUS_IDS];
export const QUERY_CORPUS_IDS: BuiltInCorpusId[] = ["alice", "fastapi", "space"];

/** Returns the display label for any corpus id (built-in or custom). */
export const getCorpusLabel = (id: CorpusId, fallback?: string): string =>
  CORPUS_LABELS[id as BuiltInCorpusId] ?? fallback ?? id;

export const isWordCorpus = (id: CorpusId): boolean => id === "words";
export const isCustomCorpus = (id: CorpusId): boolean =>
  !(BUILTIN_CORPUS_IDS as readonly string[]).includes(id);


export interface ManifestEntry {
  id: string;
  label: string;
  file: string;
}

/** Fetch the custom corpus manifest. Returns [] when no custom corpora exist yet. */
export const loadManifest = async (): Promise<ManifestEntry[]> => {
  try {
    const res = await fetch("/data/custom/manifest.json");
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`manifest fetch failed: ${res.status}`);
    const data = (await res.json()) as { projects?: ManifestEntry[] };
    return data.projects ?? [];
  } catch {
    return [];
  }
};


export const loadCorpus = async (id: CorpusId): Promise<Corpus> => {
  const path = isCustomCorpus(id) ? `/data/custom/${id}.json` : `/data/${id}.json`;
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load corpus "${id}": ${res.status}`);
  return res.json() as Promise<Corpus>;
};
