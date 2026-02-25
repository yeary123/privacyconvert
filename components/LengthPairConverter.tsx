"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LENGTH_UNITS = [
  { id: "m", name: "Meter (m)", toMeter: 1 },
  { id: "km", name: "Kilometer (km)", toMeter: 1000 },
  { id: "cm", name: "Centimeter (cm)", toMeter: 0.01 },
  { id: "ft", name: "Foot (ft)", toMeter: 0.3048 },
  { id: "in", name: "Inch (in)", toMeter: 0.0254 },
  { id: "mi", name: "Mile (mi)", toMeter: 1609.344 },
  { id: "nmi", name: "Nautical mile (nmi)", toMeter: 1852 },
] as const;

const LENGTH_PAIRS: Record<string, { fromId: string; toId: string }> = {
  "miles-to-km": { fromId: "mi", toId: "km" },
  "feet-to-meters": { fromId: "ft", toId: "m" },
  "inches-to-cm": { fromId: "in", toId: "cm" },
  "nautical-miles-to-km": { fromId: "nmi", toId: "km" },
};

function convertLength(value: number, fromId: string, toId: string): number {
  const from = LENGTH_UNITS.find((u) => u.id === fromId);
  const to = LENGTH_UNITS.find((u) => u.id === toId);
  if (!from || !to || !Number.isFinite(value)) return 0;
  const meters = value * from.toMeter;
  return meters / to.toMeter;
}

type LengthPairConverterProps = { toolSlug: string };

export function LengthPairConverter({ toolSlug }: LengthPairConverterProps) {
  const pair = LENGTH_PAIRS[toolSlug];
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState(pair?.fromId ?? "mi");
  const [toUnit, setToUnit] = useState(pair?.toId ?? "km");
  const [result, setResult] = useState(0);

  const fromInfo = LENGTH_UNITS.find((u) => u.id === fromUnit);
  const toInfo = LENGTH_UNITS.find((u) => u.id === toUnit);

  const update = useCallback(() => {
    const num = parseFloat(value);
    setResult(convertLength(num, fromUnit, toUnit));
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

  const text = `${fromInfo?.name ?? fromUnit}: ${value}\n${toInfo?.name ?? toUnit}: ${Number.isFinite(result) ? result.toFixed(6) : "—"}`;
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
        Unknown length pair. <a href="/tools" className="underline">Browse all tools</a>.
      </div>
    );
  }

  const unitA = LENGTH_UNITS.find((u) => u.id === pair.fromId);
  const unitB = LENGTH_UNITS.find((u) => u.id === pair.toId);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a value and convert between the two units. 100% local, no upload.
      </p>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Value</label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="1"
            className="w-32"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">From</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-[180px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value={pair.fromId}>{unitA?.name ?? pair.fromId}</option>
            <option value={pair.toId}>{unitB?.name ?? pair.toId}</option>
          </select>
        </div>
        <Button type="button" variant="outline" size="icon" onClick={swap} className="shrink-0" aria-label="Swap units">
          ⇄
        </Button>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">To</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-[180px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value={pair.fromId}>{unitA?.name ?? pair.fromId}</option>
            <option value={pair.toId}>{unitB?.name ?? pair.toId}</option>
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">Result</p>
        <p className="text-lg font-mono">
          {Number.isFinite(result) ? result.toFixed(6) : "—"} {toInfo?.name ?? toUnit}
        </p>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> Copy</Button>
          <Button type="button" variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> Download</Button>
        </div>
      </div>
    </div>
  );
}
