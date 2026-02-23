export default function ConvertLoading() {
  return (
    <div className="container py-8">
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mb-2 h-8 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mb-8 h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border border-border bg-muted/30" />
      </div>
    </div>
  );
}
