"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function toCelsius(val: number, from: string): number {
  if (from === "c") return val;
  if (from === "f") return ((val - 32) * 5) / 9;
  return val - 273.15; // k
}
function fromCelsius(c: number, to: string): number {
  if (to === "c") return c;
  if (to === "f") return (c * 9) / 5 + 32;
  return c + 273.15; // k
}

const TEMP_UNITS: Record<string, string> = {
  c: "Celsius (°C)",
  f: "Fahrenheit (°F)",
  k: "Kelvin (K)",
};

const TEMP_PAIRS: Record<string, { fromId: string; toId: string }> = {
  "fahrenheit-to-celsius": { fromId: "f", toId: "c" },
  "fahrenheit-to-kelvin": { fromId: "f", toId: "k" },
  "celsius-to-kelvin": { fromId: "c", toId: "k" },
};

function convertTemp(value: number, fromId: string, toId: string): number {
  if (!Number.isFinite(value)) return 0;
  const c = toCelsius(value, fromId);
  return fromCelsius(c, toId);
}

type TemperaturePairConverterProps = { toolSlug: string };

export function TemperaturePairConverter({ toolSlug }: TemperaturePairConverterProps) {
  const pair = TEMP_PAIRS[toolSlug];
  const [value, setValue] = useState("0");
  const [fromUnit, setFromUnit] = useState(pair?.fromId ?? "f");
  const [toUnit, setToUnit] = useState(pair?.toId ?? "c");
  const [result, setResult] = useState(0);

  const update = useCallback(() => {
    const num = parseFloat(value);
    setResult(convertTemp(num, fromUnit, toUnit));
  }, [value, fromUnit, toUnit]);

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    if (pair) {
      setFromUnit(pair.fromId);
      setToUnit(pair.toId);
    }
  }, [toolSlug, pair]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const text = `${TEMP_UNITS[fromUnit] ?? fromUnit}: ${value}\n${TEMP_UNITS[toUnit] ?? toUnit}: ${Number.isFinite(result) ? result.toFixed(4) : "—"}`;
  const copy = () => navigator.clipboard.writeText(text);
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${toolSlug}-conversion.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!pair) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Unknown temperature pair. <a href="/tools" className="underline">Browse all tools</a>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a value and convert between the two units. 100% local, no upload.
      </p>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Value</label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0" className="w-32" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">From</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-[180px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
            <option value={pair.fromId}>{TEMP_UNITS[pair.fromId]}</option>
            <option value={pair.toId}>{TEMP_UNITS[pair.toId]}</option>
          </select>
        </div>
        <Button type="button" variant="outline" size="icon" onClick={swap} className="shrink-0" aria-label="Swap units">⇄</Button>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">To</label>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-[180px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
            <option value={pair.fromId}>{TEMP_UNITS[pair.fromId]}</option>
            <option value={pair.toId}>{TEMP_UNITS[pair.toId]}</option>
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">Result</p>
        <p className="text-lg font-mono">{Number.isFinite(result) ? result.toFixed(4) : "—"} {TEMP_UNITS[toUnit] ?? toUnit}</p>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> Copy</Button>
          <Button type="button" variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> Download</Button>
        </div>
      </div>
    </div>
  );
}
