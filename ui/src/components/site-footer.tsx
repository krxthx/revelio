import { Github } from "lucide-react";

const SiteFooter = () => (
  <footer className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
    <a
      href="https://github.com/krxthx/revelio"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
    >
      <Github className="h-3.5 w-3.5 shrink-0" />
      made with love by krithika
    </a>
  </footer>
);

export default SiteFooter;
