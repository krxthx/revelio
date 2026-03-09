"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ error, reset }: Props) => {
  useEffect(() => {
    console.error(error); // eslint-disable-line no-console
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <p className="text-sm text-destructive">Something went wrong.</p>
      <button
        onClick={reset}
        className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

export default GlobalError;
