"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import NavBar from "@/components/nav-bar";
import LoadingScreen from "@/components/loading-screen";
import { useAccent } from "@/components/accent-provider";

const LandingCanvas = dynamic(() => import("@/components/landing-canvas"), {
  ssr: false,
});

const Home = () => {
  const [canvasReady, setCanvasReady] = useState(false);
  const { accentColor } = useAccent();
  const ctaColor = `color-mix(in srgb, ${accentColor} 78%, #0a0a0a)`;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* 3D canvas fills the entire viewport */}
      <div className="absolute inset-0">
        <LandingCanvas accentColor={accentColor} onReady={() => setCanvasReady(true)} />
      </div>

      {/* Atmosphere overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 15% 10%, color-mix(in srgb, var(--primary) 22%, transparent), transparent),
            radial-gradient(ellipse 50% 40% at 88% 18%, color-mix(in srgb, var(--primary) 14%, transparent), transparent),
            radial-gradient(ellipse 40% 50% at 50% 85%, color-mix(in srgb, var(--primary) 10%, transparent), transparent),
            linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.55) 100%)
          `,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(10,10,10,0.6) 100%)",
        }}
      />

      {!canvasReady && <LoadingScreen />}

      {/* Content layer sits on top */}
      <div className={`relative z-10 flex h-full flex-col transition-opacity duration-700 ${canvasReady ? "opacity-100" : "opacity-0"}`}>
        <NavBar />

        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide"
            style={{
              borderColor: `color-mix(in srgb, ${accentColor} 40%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
              color: accentColor,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: accentColor }}
            />
            Interactive RAG Explorer
          </div>

          <div className="flex flex-col gap-3">
            <h1
              className="text-5xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, #f4f4f5 30%, color-mix(in srgb, ${accentColor} 70%, #f4f4f5))`,
              }}
            >
              Revelio
            </h1>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground sm:text-base sm:max-w-md leading-relaxed">
              Watch embeddings, semantic search, and LLMs work together in real
              time. An interactive playground for understanding RAG.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex h-10 items-center gap-2 rounded-md px-6 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{
                backgroundColor: ctaColor,
                boxShadow: `0 4px 24px color-mix(in srgb, ${accentColor} 30%, transparent)`,
              }}
            >
              Try the Demo
            </Link>
            <Link
              href="/docs"
              className="inline-flex h-10 items-center rounded-md border border-border bg-background/40 px-6 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:bg-background/60 hover:border-border/80"
            >
              Read the Docs
            </Link>
          </div>

          <p className="text-xs" style={{ color: `color-mix(in srgb, ${accentColor} 70%, #71717a)` }}>
            made with love by{" "}
            <a
              href="https://github.com/krxthx"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80 underline underline-offset-2"
            >
              krxthx
            </a>
            {" <3"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
