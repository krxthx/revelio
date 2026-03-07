/**
 * Parser for <think>...</think> tags emitted by reasoning models
 * (e.g. DeepSeek-R1, Qwen-QwQ, Claude extended thinking).
 *
 * Handles both complete and partial (mid-stream) tags so it can be
 * called on the incrementally growing response string while streaming.
 */

export interface StreamParseResult {
  /** Accumulated content from all completed <think> blocks, plus any in-progress block. */
  thinking: string;
  /** Everything outside <think> blocks. */
  response: string;
  /** True while the cursor is inside an unclosed <think> tag. */
  isThinking: boolean;
}

const OPEN_TAG = "<think>";
const CLOSE_TAG = "</think>";

export function parseStreamingThink(text: string): StreamParseResult {
  const thinkParts: string[] = [];
  let remaining = text;

  // Strip all complete <think>…</think> blocks
  const completeRe = /<think>([\s\S]*?)<\/think>/gi;
  remaining = remaining.replace(completeRe, (_, content: string) => {
    const trimmed = content.trim();
    if (trimmed) thinkParts.push(trimmed);
    return "";
  });

  // Check if we are currently inside an unclosed <think> block
  const openIdx = remaining.toLowerCase().lastIndexOf(OPEN_TAG);
  const closeIdx = remaining.toLowerCase().lastIndexOf(CLOSE_TAG);
  const isThinking = openIdx !== -1 && openIdx > closeIdx;

  if (isThinking) {
    const partialContent = remaining.slice(openIdx + OPEN_TAG.length).trim();
    if (partialContent) thinkParts.push(partialContent);
    remaining = remaining.slice(0, openIdx);
  }

  return {
    thinking: thinkParts.join("\n\n"),
    response: remaining.trim(),
    isThinking,
  };
}
