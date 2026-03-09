/**
 * OpenAI-compatible streaming adapter.
 * Works with OpenRouter, LM Studio, vLLM, and any other
 * backend that implements the OpenAI chat completions API.
 */

import type { ChatMessage, LLMAdapter, LLMConfig } from "./types";

export class OpenAICompatibleAdapter implements LLMAdapter {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async stream(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
    const url = `${this.config.baseUrl.replace(/\/$/, "")}/chat/completions`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.config.apiKey) {
      headers.Authorization = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: this.config.model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("rate_limit");
      }
      const body = await response.text();
      throw new Error(`LLM request failed (${response.status}): ${body}`);
    }

    if (!response.body) {
      throw new Error("LLM response has no body");
    }

    return this._parseSSEStream(response.body);
  }

  /**
   * Transforms a raw SSE byte stream into a plain text stream.
   * Parses `data: {...}` lines and extracts `choices[0].delta.content`.
   */
  private _parseSSEStream(raw: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = raw.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (data === "[DONE]") {
                controller.close();
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content: string | undefined = parsed?.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Malformed JSON line from the SSE stream — skip silently in production.
                // In development, log so unexpected format issues are visible.
                if (process.env.NODE_ENV === "development") {
                  console.warn("[SSE] Malformed JSON chunk:", data); // eslint-disable-line no-console
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
        controller.close();
      },
    });
  }
}
