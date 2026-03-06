"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";

interface Props {
  rightSlot?: React.ReactNode;
}

const NavBar = ({ rightSlot }: Props) => {
  const pathname = usePathname();
  const transparentHeader =
    pathname === "/" || pathname === "/docs" || pathname.startsWith("/docs/");

  const linkClass = (href: string) =>
    [
      "inline-flex h-7 items-center rounded px-2.5 text-xs transition-colors",
      pathname === href || pathname.startsWith(href + "/")
        ? "text-primary"
        : "text-muted-foreground hover:text-foreground",
    ].join(" ");

  return (
    <header
      className={[
        "sticky top-0 z-40 flex shrink-0 items-center justify-between px-5 py-3",
        transparentHeader
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border bg-background/85 backdrop-blur",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm font-semibold tracking-tight text-foreground">
          Revelio
        </Link>
        <nav className="flex items-center gap-0.5">
          <Link href="/demo" className={linkClass("/demo")}>
            Demo
          </Link>
          <Link href="/docs" className={linkClass("/docs")}>
            Docs
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {rightSlot}
        <a
          href="https://github.com/krxthx/revelio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card/70 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="GitHub repository"
        >
          <Github className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
};

export default NavBar;
