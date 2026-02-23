export default function ToolsLoading() {
  return (
    <div className="container py-8">
      <div className="mb-2 h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="mb-6 h-4 w-96 animate-pulse rounded bg-muted" />
      <div className="mb-6 h-10 w-full max-w-md animate-pulse rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl border border-border bg-muted/30" />
        ))}
      </div>
    </div>
  );
}
