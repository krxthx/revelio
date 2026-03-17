"use client";

import type { FeatureExtractionPipeline } from "@huggingface/transformers";

export type EmbedderStatus = "idle" | "loading" | "ready";

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";

let _pipe: FeatureExtractionPipeline | null = null;
let _status: EmbedderStatus = "idle";
let _loadPromise: Promise<void> | null = null;

export const getEmbedderStatus = (): EmbedderStatus => _status;

export const warmUpEmbedder = (): Promise<void> => {
  if (_loadPromise) return _loadPromise;

  _status = "loading";
  _loadPromise = (async () => {
    const { pipeline } = await import("@huggingface/transformers");
    _pipe = (await pipeline("feature-extraction", MODEL_ID)) as unknown as FeatureExtractionPipeline;
    _status = "ready";
  })();

  return _loadPromise;
};

export const embedQuery = async (text: string): Promise<number[]> => {
  await warmUpEmbedder();
  const output = await _pipe!(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
};
