"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WEIGHT_UNITS = [
  { id: "kg", name: "Kilogram (kg)", toKg: 1 },
  { id: "g", name: "Gram (g)", toKg: 0.001 },
  { id: "lb", name: "Pound (lb)", toKg: 0.453592 },
  { id: "oz", name: "Ounce (oz)", toKg: 0.0283495 },
  { id: "jin", name: "Jin (市斤)", toKg: 0.5 },
  { id: "st", name: "Stone (st)", toKg: 6.35029 },
] as const;

const WEIGHT_PAIRS: Record<string, { fromId: string; toId: string }> = {
  "pounds-to-kg": { fromId: "lb", toId: "kg" },
  "ounces-to-grams": { fromId: "oz", toId: "g" },
  "stone-to-kg": { fromId: "st", toId: "kg" },
  "jin-to-kg": { fromId: "jin", toId: "kg" },
};

function convertWeight(value: number, fromId: string, toId: string): number {
  const from = WEIGHT_UNITS.find((u) => u.id === fromId);
  const to = WEIGHT_UNITS.find((u) => u.id === toId);
  if (!from || !to || !Number.isFinite(value)) return 0;
  const kg = value * from.toKg;
  return kg / to.toKg;
}

type WeightPairConverterProps = { toolSlug: string };

export function WeightPairConverter({ toolSlug }: WeightPairConverterProps) {
  const pair = WEIGHT_PAIRS[toolSlug];
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState(pair?.fromId ?? "lb");
  const [toUnit, setToUnit] = useState(pair?.toId ?? "kg");
  const [result, setResult] = useState(0);

  const toInfo = WEIGHT_UNITS.find((u) => u.id === toUnit);

  const update = useCallback(() => {
    const num = parseFloat(value);
    setResult(convertWeight(num, fromUnit, toUnit));
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

  const unitA = pair ? WEIGHT_UNITS.find((u) => u.id === pair.fromId) : null;
  const unitB = pair ? WEIGHT_UNITS.find((u) => u.id === pair.toId) : null;

  const text = `${WEIGHT_UNITS.find((u) => u.id === fromUnit)?.name ?? fromUnit}: ${value}\n${toInfo?.name ?? toUnit}: ${Number.isFinite(result) ? result.toFixed(6) : "—"}`;
  const copy = () => navigator.clipboard.writeText(text);
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${toolSlug}-conversion.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!pair || !unitA || !unitB) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Unknown weight pair. <a href="/tools" className="underline">Browse all tools</a>.
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
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="1" className="w-32" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">From</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-[180px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
            <option value={pair.fromId}>{unitA.name}</option>
            <option value={pair.toId}>{unitB.name}</option>
          </select>
        </div>
        <Button type="button" variant="outline" size="icon" onClick={swap} className="shrink-0" aria-label="Swap units">⇄</Button>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">To</label>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-[180px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
            <option value={pair.fromId}>{unitA.name}</option>
            <option value={pair.toId}>{unitB.name}</option>
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">Result</p>
        <p className="text-lg font-mono">{Number.isFinite(result) ? result.toFixed(6) : "—"} {toInfo?.name ?? toUnit}</p>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> Copy</Button>
          <Button type="button" variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> Download</Button>
        </div>
      </div>
    </div>
  );
}
