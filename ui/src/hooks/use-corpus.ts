import { useEffect, useState } from "react";
import { loadCorpus, type Corpus, type CorpusId } from "@/lib/corpus";

interface UseCorpusResult {
  corpus: Corpus | null;
  loading: boolean;
  loadError: string | null;
}

export const useCorpus = (corpusId: CorpusId): UseCorpusResult => {
  const [corpus, setCorpus] = useState<Corpus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    setCorpus(null);
    loadCorpus(corpusId)
      .then(setCorpus)
      .catch((err: unknown) =>
        setLoadError(err instanceof Error ? err.message : String(err)),
      )
      .finally(() => setLoading(false));
  }, [corpusId]);

  return { corpus, loading, loadError };
};
