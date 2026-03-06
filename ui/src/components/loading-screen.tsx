"use client";

const LoadingScreen = () => (
  <div className="absolute inset-0 z-20 flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      <p className="text-xs text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export default LoadingScreen;
