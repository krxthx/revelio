"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

const DemoError = ({ error, reset }: Props) => {
  useEffect(() => {
    console.error(error); // eslint-disable-line no-console
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <p className="text-sm text-destructive">
        {error.message || "Failed to load the demo."}
      </p>
      <button
        onClick={reset}
        className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
      >
        Reload
      </button>
    </div>
  );
};

export default DemoError;
