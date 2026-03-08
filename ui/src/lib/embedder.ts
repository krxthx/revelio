"use client";

/**
 * Browser-side embedding via Transformers.js (WASM, ~25 MB, cached by the browser).
 *
 * The pipeline is a lazy singleton: the first call to embedQuery() or
 * warmUpEmbedder() downloads + compiles the model; all subsequent calls reuse
 * the cached instance (~50–200 ms per query once warm).
 *
 * Status lifecycle:  idle → loading → ready
 */

import type { FeatureExtractionPipeline } from "@huggingface/transformers";

export type EmbedderStatus = "idle" | "loading" | "ready";

// Xenova/ prefix = ONNX-converted model hosted on Hugging Face Hub
const MODEL_ID = "Xenova/all-MiniLM-L6-v2";

let _pipe: FeatureExtractionPipeline | null = null;
let _status: EmbedderStatus = "idle";
let _loadPromise: Promise<void> | null = null;

export const getEmbedderStatus = (): EmbedderStatus => _status;

/**
 * Begin loading the model in the background.
 * Safe to call multiple times — returns the same promise after the first call.
 */
export const warmUpEmbedder = (): Promise<void> => {
  if (_loadPromise) return _loadPromise;

  _status = "loading";
  _loadPromise = (async () => {
    const { pipeline } = await import("@huggingface/transformers");
    _pipe = (await pipeline("feature-extraction", MODEL_ID)) as FeatureExtractionPipeline;
    _status = "ready";
  })();

  return _loadPromise;
};

/**
 * Embed a query string. Loads the model on first call if not already warm.
 * Returns a normalized float32 embedding vector.
 */
export const embedQuery = async (text: string): Promise<number[]> => {
  await warmUpEmbedder();

  // _pipe is guaranteed non-null after warmUpEmbedder resolves
  const output = await _pipe!(text, { pooling: "mean", normalize: true });

  // Tensor.data is a Float32Array; spread into a plain number[]
  return Array.from(output.data as Float32Array);
};
