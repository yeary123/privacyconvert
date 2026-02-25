"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CURRENCIES = [
  { id: "USD", name: "US Dollar (USD)" },
  { id: "EUR", name: "Euro (EUR)" },
  { id: "GBP", name: "British Pound (GBP)" },
  { id: "CNY", name: "Chinese Yuan (CNY)" },
  { id: "JPY", name: "Japanese Yen (JPY)" },
  { id: "CHF", name: "Swiss Franc (CHF)" },
  { id: "CAD", name: "Canadian Dollar (CAD)" },
  { id: "AUD", name: "Australian Dollar (AUD)" },
  { id: "INR", name: "Indian Rupee (INR)" },
  { id: "KRW", name: "South Korean Won (KRW)" },
];

const API_URL = "https://api.frankfurter.app/latest";

export function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const toList = CURRENCIES.filter((c) => c.id !== from).map((c) => c.id).join(",");
    fetch(`${API_URL}?from=${from}&to=${toList || "EUR"}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.rates) {
          const r: Record<string, number> = { [from]: 1 };
          Object.assign(r, data.rates);
          setRates(r);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Failed to fetch rates");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [from]);

  const updateResult = useCallback(() => {
    const num = parseFloat(amount);
    if (!Number.isFinite(num) || !rates[to]) {
      setResult(null);
      return;
    }
    setResult((num * rates[to]) / (rates[from] || 1));
  }, [amount, from, to, rates]);

  useEffect(() => {
    updateResult();
  }, [updateResult]);

  const text = result != null
    ? `${amount} ${from} = ${result.toFixed(4)} ${to}`
    : "";
  const copy = () => navigator.clipboard.writeText(text);
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "currency-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  useEffect(() => {
    console.log("完成：/convert/currency-converter");
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter amount and select currencies. Rates are fetched from a free API (Frankfurter); conversion is then done locally. Privacy: we do not send your data.
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
            className="w-28"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-[180px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-[180px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">Result</p>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading rates…</p>
        ) : (
          <p className="text-lg font-mono">
            {result != null ? `${amount} ${from} = ${result.toFixed(4)} ${to}` : "—"}
          </p>
        )}
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={copy} disabled={result == null}><Copy className="h-4 w-4" /> Copy</Button>
          <Button type="button" variant="outline" size="sm" onClick={download} disabled={result == null}><Download className="h-4 w-4" /> Download</Button>
        </div>
      </div>
    </div>
  );
}
