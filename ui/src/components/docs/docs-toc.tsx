import { DOCS_SECTIONS } from "./constants";

interface DocsTocProps {
  mobile?: boolean;
}

export default function DocsToc({ mobile = false }: DocsTocProps) {
  if (mobile) {
    return (
      <nav className="mb-10 rounded-2xl border border-white/12 bg-white/6 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md lg:hidden">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-foreground/45">
          Contents
        </p>
        <ol className="flex flex-col gap-1.5 text-sm">
          {DOCS_SECTIONS.map(({ href, label }, i) => (
            <li key={href}>
              <a href={href} className="text-foreground/78 transition-colors hover:text-foreground">
                {i + 1}. {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <aside
      className="fixed right-5 top-15 z-30 hidden w-44 overflow-y-auto lg:block"
      style={{ maxHeight: "calc(100vh - 60px)" }}
    >
      <nav className="py-10">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-foreground/45">
          Contents
        </p>
        <ol className="flex flex-col gap-0.5">
          {DOCS_SECTIONS.map(({ href, label }, i) => (
            <li key={href}>
              <a
                href={href}
                className="group flex items-start gap-2 rounded-md px-2 py-1.5 text-xs text-foreground/55 transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <span className="mt-px shrink-0 font-mono text-[10px] text-foreground/30 group-hover:text-foreground/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
