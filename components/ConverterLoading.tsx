"use client";

/** Shown while a converter chunk is loading (dynamic import). */
export function ConverterLoading() {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-muted/30">
      <p className="text-sm text-muted-foreground">Loading converter…</p>
    </div>
  );
}
