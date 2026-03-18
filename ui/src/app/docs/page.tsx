import DocsContent from "@/components/docs/docs-content";
import DocsToc from "@/components/docs/docs-toc";
import NavBar from "@/components/nav-bar";

export default function DocsPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 12% 14%, color-mix(in srgb, var(--primary) 11%, transparent), transparent 36%),
            radial-gradient(circle at 86% 22%, color-mix(in srgb, var(--primary) 7%, transparent), transparent 44%),
            radial-gradient(circle at 50% 78%, color-mix(in srgb, var(--primary) 4%, transparent), transparent 48%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgba(10, 10, 10, 0.42))
          `,
        }}
      />
      <NavBar />
      <DocsToc />

      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">How Revelio Works</h1>
          <p className="text-sm text-foreground/72">
            A guide to the concepts behind Retrieval-Augmented Generation, embeddings, and what
            Revelio is actually showing you.
          </p>
        </div>

        <div>
          <DocsToc mobile />
          <DocsContent />
        </div>
      </div>
    </div>
  );
}
