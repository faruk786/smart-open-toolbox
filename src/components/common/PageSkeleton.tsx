/** Minimal, layout-stable fallback for lazily loaded route views. */
export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-pulse" aria-busy="true">
      <div className="h-6 w-40 rounded bg-muted" />
      <div className="mt-4 h-9 w-3/4 rounded bg-muted" />
      <div className="mt-3 h-4 w-1/2 rounded bg-muted" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-40 rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
