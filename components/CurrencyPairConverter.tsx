"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseCurrencyPairSlug } from "@/lib/currencyPairs";

const API_URL = "https://api.frankfurter.app/latest";

type Props = { toolSlug: string };

export function CurrencyPairConverter({ toolSlug }: Props) {
  const pair = parseCurrencyPairSlug(toolSlug);
  const [from, setFrom] = useState(pair?.from ?? "USD");
  const [to, setTo] = useState(pair?.to ?? "EUR");
  const [amount, setAmount] = useState("1");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pair) {
      setFrom(pair.from);
      setTo(pair.to);
    }
  }, [toolSlug, pair]);

  useEffect(() => {
    if (!from || !to || from === to) {
      setRate(1);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${API_URL}?from=${from}&to=${to}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.rates?.[to] != null) {
          setRate(data.rates[to]);
        } else {
          setError("Rate not available");
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Failed to fetch rate");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const result = rate != null && Number.isFinite(parseFloat(amount))
    ? parseFloat(amount) * rate
    : null;

  const swap = useCallback(() => {
    setFrom((prev) => to);
    setTo((prev) => from);
  }, [from, to]);

  const text = result != null ? `${amount} ${from} = ${result.toFixed(4)} ${to}` : "";
  const copy = () => navigator.clipboard.writeText(text);
  const download = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `currency-${from}-to-${to}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!pair) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Unknown currency pair. <a href="/tools" className="underline">Browse all tools</a>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter amount. Rate is fetched from <a href="https://api.frankfurter.app/latest" target="_blank" rel="noopener noreferrer" className="underline">Frankfurter</a>; conversion is then done locally.
      </p>
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Amount</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1"
            className="w-32"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">From</label>
          <p className="w-[120px] h-9 flex items-center text-sm font-medium">{from}</p>
        </div>
        <Button type="button" variant="outline" size="icon" onClick={swap} className="shrink-0" aria-label="Swap">
          ⇄
        </Button>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">To</label>
          <p className="w-[120px] h-9 flex items-center text-sm font-medium">{to}</p>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">Result</p>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading rate…</p>
        ) : (
          <p className="text-lg font-mono">
            {result != null ? `${amount} ${from} = ${result.toFixed(4)} ${to}` : "—"}
          </p>
        )}
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={copy} disabled={result == null}>
            <Copy className="h-4 w-4" /> Copy
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={download} disabled={result == null}>
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>
    </div>
  );
}
