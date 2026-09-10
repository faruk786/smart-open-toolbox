import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { useMemo } from "react";

import { useToolSearch } from "@/lib/search-context";
import { toolTree, type Tool } from "@/lib/tools";

const featured: Tool[] = [
  {
    name: "AI Mock Data Engine",
    description:
      "Describe your schema in natural language and export realistic SQL, JSON, or CSV rows.",
    path: "/mock-data",
    status: "live",
  },
  ...toolTree
    .flatMap((group) => group.tools)
    .filter((tool) => tool.status === "soon")
    .slice(0, 3),
];

export default function Home() {
  const { query } = useToolSearch();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return featured;
    return featured.filter(
      (tool) => tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <section className="border-b border-border pb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <Sparkles className="size-3" /> No signup, no tracking walls
        </span>
        <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Free, Open Developer Utilities — Zero Signup, Instant Access
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          A fast, minimal hub of everyday engineering tools. Everything runs in the browser and
          stays free, forever.
        </p>
      </section>

      <section className="pt-8" aria-label="Tool directory">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Directory
        </h2>
        <div className="mt-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((tool) =>
            tool.path ? (
              <article key={tool.name} className="group">
                <Link
                  to={tool.path}
                  className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/25 hover:bg-accent/40"
                >
                  <h3 className="text-base font-semibold text-foreground">{tool.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    Open tool
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </article>
            ) : (
              <article
                key={tool.name}
                className="flex h-full flex-col rounded-xl border border-dashed border-border bg-muted/30 p-5"
              >
                <h3 className="text-base font-semibold text-muted-foreground">{tool.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground/80">
                  {tool.description}
                </p>
                <span className="mt-4 w-fit rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                  Coming soon
                </span>
              </article>
            ),
          )}
        </div>
        {results.length === 0 && (
          <p className="mt-6 text-sm text-muted-foreground">No tools match “{query}”.</p>
        )}
      </section>
    </div>
  );
}
