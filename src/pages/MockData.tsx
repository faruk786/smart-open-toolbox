import { Construction } from "lucide-react";

export default function MockData() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="border-b border-border pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Generators
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          AI Mock Data Engine
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Generate realistic SQL, JSON, and CSV mock data from plain-language prompts.
        </p>
      </header>

      <section className="mt-8">
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
          <Construction className="size-6 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">Under Construction (Step 2)</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            The generator interface and output panels will be built here next.
          </p>
        </div>
      </section>
    </div>
  );
}
