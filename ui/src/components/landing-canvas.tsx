"use client";

import { useEffect } from "react";

interface Props {
  accentColor: string;
  onReady?: () => void;
}

const LandingCanvas = ({ accentColor, onReady }: Props) => {
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage: `
          linear-gradient(to right, color-mix(in srgb, ${accentColor} 8%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, ${accentColor} 8%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: "96px 96px",
      }}
    />
  );
};

export default LandingCanvas;
