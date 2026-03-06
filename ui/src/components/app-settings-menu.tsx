"use client";

import { useEffect, useRef, useState } from "react";
import { Settings2 } from "lucide-react";
import { ACCENT_OPTIONS, type AccentId } from "@/lib/theme";

interface Props {
  topK: number;
  onTopKChange: (value: number) => void;
  accentId: AccentId;
  onAccentChange: (id: AccentId) => void;
  disabled?: boolean;
}

const AppSettingsMenu = ({
  topK,
  onTopKChange,
  accentId,
  onAccentChange,
  disabled,
}: Props) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card/70 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open settings"
        disabled={disabled}
      >
        <Settings2 className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-64 rounded-lg border border-border bg-card p-3 shadow-xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Settings
          </p>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Top K
              </span>
              <span className="w-5 text-right text-xs text-foreground">{topK}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={topK}
              onChange={(event) => onTopKChange(Number(event.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Accent
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ACCENT_OPTIONS.map((accent) => {
                const active = accent.id === accentId;
                return (
                  <button
                    key={accent.id}
                    type="button"
                    onClick={() => onAccentChange(accent.id)}
                    className={[
                      "flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs transition-colors",
                      active
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                    aria-label={`Use ${accent.label} accent`}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full border border-white/20"
                      style={{ backgroundColor: accent.value }}
                    />
                    {accent.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSettingsMenu;
