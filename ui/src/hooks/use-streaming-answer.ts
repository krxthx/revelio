import { useCallback, useState } from "react";
import { streamChatResponse } from "@/lib/llm/client";
import type { ChatMessage } from "@/lib/llm/types";
import type { LLMRuntimeConfig } from "@/lib/llm/types";

interface UseStreamingAnswerResult {
  answer: string;
  streaming: boolean;
  answerError: string | null;
  stream: (messages: ChatMessage[], signal: AbortSignal) => Promise<void>;
  reset: () => void;
}

export const useStreamingAnswer = (llmConfig: LLMRuntimeConfig): UseStreamingAnswerResult => {
  const [answer, setAnswer] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);

  const stream = useCallback(
    async (messages: ChatMessage[], signal: AbortSignal): Promise<void> => {
      setAnswer("");
      setAnswerError(null);
      setStreaming(true);
      try {
        await streamChatResponse({
          messages,
          llmConfig,
          onChunk: (chunk) => setAnswer((prev) => prev + chunk),
          signal,
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setAnswerError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setStreaming(false);
      }
    },
    [llmConfig],
  );

  const reset = useCallback(() => {
    setAnswer("");
    setAnswerError(null);
  }, []);

  return { answer, streaming, answerError, stream, reset };
};
