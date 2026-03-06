"use client";

import { useEffect, useRef, useState } from "react";
import type { Chunk } from "@/lib/corpus";

const MAX_PREVIEW_CHARS = 220;
const OFFSET_X = 14;
const OFFSET_Y = -10;

interface Props {
  chunk: Chunk | null;
}

export default function ChunkTooltip({ chunk }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chunk) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX + OFFSET_X, y: e.clientY + OFFSET_Y });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [chunk]);

  if (!chunk) return null;

  const preview =
    chunk.text.length > MAX_PREVIEW_CHARS
      ? chunk.text.slice(0, MAX_PREVIEW_CHARS).trimEnd() + "…"
      : chunk.text;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-50 max-w-xs rounded-lg border border-border bg-card/95 px-3 py-2 text-xs text-foreground shadow-xl backdrop-blur"
      style={{ left: pos.x, top: pos.y }}
    >
      <p className="mb-1 font-mono text-[10px] text-muted-foreground">{chunk.id}</p>
      <p className="leading-relaxed">{preview}</p>
    </div>
  );
}
