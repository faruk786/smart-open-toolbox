import { Link } from "@tanstack/react-router";
import { Github, Search, SquareTerminal } from "lucide-react";

import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useToolSearch } from "@/lib/search-context";

export function Header() {
  const { query, setQuery } = useToolSearch();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-14 w-full items-center justify-between gap-2 px-4 sm:gap-6 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <SquareTerminal className="size-5 text-foreground" />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            SmartOpenTools
          </span>
        </Link>

        <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-xs md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools…"
            aria-label="Search tools"
            className="h-9 w-full rounded-md border border-border bg-muted/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:outline-none"
          />
        </div>

        <nav aria-label="Primary" className="flex shrink-0 items-center gap-2">
          <Link
            to="/"
            className="hidden rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            activeProps={{ className: "text-foreground" }}
          >
            Directory
          </Link>
          <ThemeToggle />
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub repository"
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Github className="size-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
