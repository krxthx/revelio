"use client";

import { useEffect, useRef, useState } from "react";
import type { Chunk } from "@/lib/corpus";

const MAX_PREVIEW_CHARS = 300;
const OFFSET_X = 16;
const OFFSET_Y = -12;

interface Props {
  chunk: Chunk | null;
  score?: number;
}

const ScoreBar = ({ score }: { score: number }) => {
  const pct = Math.round(score * 100);
  const color =
    score >= 0.75 ? "bg-emerald-400" : score >= 0.5 ? "bg-amber-400" : "bg-zinc-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="tabular-nums text-[10px] text-muted-foreground">{pct}%</span>
    </div>
  );
};

const ChunkTooltip = ({ chunk, score }: Props) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chunk) { setVisible(false); return; }
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = el?.offsetWidth ?? 280;
      const h = el?.offsetHeight ?? 120;
      const x = e.clientX + OFFSET_X + w > vw ? e.clientX - w - OFFSET_X : e.clientX + OFFSET_X;
      const y = e.clientY + OFFSET_Y + h > vh ? e.clientY - h - OFFSET_Y : e.clientY + OFFSET_Y;
      setPos({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    const t = setTimeout(() => setVisible(true), 30);
    return () => { window.removeEventListener("mousemove", onMove); clearTimeout(t); };
  }, [chunk]);

  if (!chunk) return null;

  const wordCount = chunk.text.trim().split(/\s+/).length;
  const preview =
    chunk.text.length > MAX_PREVIEW_CHARS
      ? chunk.text.slice(0, MAX_PREVIEW_CHARS).trimEnd() + "…"
      : chunk.text;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-50 w-72 rounded-xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-md"
      style={{
        left: pos.x,
        top: pos.y,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(4px)",
        transition: "opacity 120ms ease, transform 120ms ease",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 px-3 py-2">
        <span className="font-mono text-[10px] tracking-wide text-zinc-500">{chunk.id}</span>
        {score !== undefined && <ScoreBar score={score} />}
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        {chunk.source && (
          <p className="mb-1.5 text-[10px] text-zinc-500">{chunk.source}</p>
        )}
        <p className="text-xs leading-relaxed text-zinc-200">{preview}</p>
      </div>

      {/* Footer */}
      <div className="border-t border-white/8 px-3 py-1.5">
        <span className="text-[10px] text-zinc-600">{wordCount} words</span>
      </div>
    </div>
  );
};

export default ChunkTooltip;
