/**
 * Runtime theme constants.
 * These mirror globals.css and are used wherever CSS variables aren't
 * available — primarily Three.js materials.
 */

export const COLORS = {
  background:      "#0a0a0a",
  foreground:      "#f4f4f5",
  muted:           "#18181b",
  mutedForeground: "#71717a",
  primary:         "#f97316",
  primaryForeground: "#ffffff",
  destructive:     "#f87171",
} as const;

export const ACCENT_OPTIONS = [
  { id: "orange", label: "Orange", value: "#f97316" },
  { id: "teal", label: "Teal", value: "#14b8a6" },
  { id: "sky", label: "Sky", value: "#38bdf8" },
  { id: "lilac", label: "Lilac", value: "#a78bfa" },
  { id: "pink", label: "Pink", value: "#f472b6" },
] as const;

export type AccentId = (typeof ACCENT_OPTIONS)[number]["id"];

/** Three.js sphere colors */
export const POINT_COLORS = {
  default:   "#a1a1aa",              /* zinc-400 — clearly visible on dark bg */
  hovered:   COLORS.foreground,
  dimmed:    "#71717a",              /* zinc-500 — de-emphasised but still legible */
} as const;

export const POINT_OPACITY = {
  default:   0.9,
  dimmed:    0.45,
  retrieved: 1.0,
} as const;

export const POINT_RADIUS = {
  default:   0.07,
  hovered:   0.09,
  retrieved: 0.09,
} as const;
