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

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* 3D canvas fills the entire viewport */}
      <div className="absolute inset-0">
        <LandingCanvas accentColor={accentColor} onReady={() => setCanvasReady(true)} />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
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
              style={{ backgroundColor: accentColor }}
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
