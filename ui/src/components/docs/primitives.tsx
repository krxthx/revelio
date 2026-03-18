import type { ReactNode } from "react";

export const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) => (
  <section id={id} className="flex flex-col gap-4 scroll-mt-6">
    <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
    {children}
  </section>
);

export const P = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p className={["text-sm leading-relaxed text-foreground", className].filter(Boolean).join(" ")}>
    {children}
  </p>
);

export const Code = ({ children }: { children: ReactNode }) => (
  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{children}</code>
);

export const Block = ({ children }: { children: ReactNode }) => (
  <pre className="overflow-x-auto rounded-2xl border border-white/12 bg-white/[0.07] p-4 font-mono text-xs leading-relaxed text-foreground shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
    {children}
  </pre>
);

export const Divider = () => <hr className="border-border" />;
