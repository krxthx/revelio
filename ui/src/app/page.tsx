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
            radial-gradient(circle at 12% 14%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 34%),
            radial-gradient(circle at 86% 22%, color-mix(in srgb, var(--primary) 13%, transparent), transparent 42%),
            radial-gradient(circle at 50% 78%, color-mix(in srgb, var(--primary) 9%, transparent), transparent 46%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(10, 10, 10, 0.5))
          `,
        }}
      />

      {!canvasReady && <LoadingScreen />}

      {/* Content layer sits on top */}
      <div className={`relative z-10 flex h-full flex-col transition-opacity ${canvasReady ? "opacity-100" : "opacity-0"}`}>
        <NavBar />

        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
          <div className="flex flex-col gap-3">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Revelio
            </h1>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground sm:text-base">
              An interactive explorer for Retrieval-Augmented Generation. Watch
              embeddings, semantic search, and LLMs work together in real time.
            </p>
            <p className="text-xs" style={{ color: accentColor }}>
              made with love by{" "}
              <a
                href="https://github.com/krxthx"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                krxthx
              </a>
              {" <3"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              style={{ backgroundColor: ctaColor }}
              className="inline-flex h-9 items-center rounded-md px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Try the Demo
            </Link>
            <Link
              href="/docs"
              className="inline-flex h-9 items-center rounded-md border border-border bg-background/50 px-5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
