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

/** Three.js sphere colors */
export const POINT_COLORS = {
  default:   "#a1a1aa",              /* zinc-400 — clearly visible on dark bg */
  hovered:   COLORS.foreground,
  retrieved: COLORS.primary,
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
