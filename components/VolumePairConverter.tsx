"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VOLUME_UNITS = [
  { id: "L", name: "Liter (L)", toL: 1 },
  { id: "mL", name: "Milliliter (mL)", toL: 0.001 },
  { id: "m3", name: "Cubic meter (m³)", toL: 1000 },
  { id: "ft3", name: "Cubic foot (ft³)", toL: 28.3168 },
  { id: "galUS", name: "US gallon (gal)", toL: 3.78541 },
  { id: "galUK", name: "UK gallon (gal)", toL: 4.54609 },
  { id: "ptUS", name: "US pint (pt)", toL: 0.473176 },
  { id: "ptUK", name: "UK pint (pt)", toL: 0.568261 },
] as const;

// allowedUnits: all units for this card; From/To dropdowns list these so user can pick US or UK
const VOLUME_PAIRS: Record<string, { allowedUnits: string[] }> = {
  "gallons-to-liters": { allowedUnits: ["galUS", "galUK", "L"] },
  "pints-to-ml": { allowedUnits: ["ptUS", "ptUK", "mL"] },
  "cubic-feet-to-cubic-meters": { allowedUnits: ["ft3", "m3"] },
};

function convertVolume(value: number, fromId: string, toId: string): number {
  const from = VOLUME_UNITS.find((u) => u.id === fromId);
  const to = VOLUME_UNITS.find((u) => u.id === toId);
  if (!from || !to || !Number.isFinite(value)) return 0;
  const liters = value * from.toL;
  return liters / to.toL;
}

type VolumePairConverterProps = { toolSlug: string };

export function VolumePairConverter({ toolSlug }: VolumePairConverterProps) {
  const pair = VOLUME_PAIRS[toolSlug];
  const allowed = pair?.allowedUnits ?? [];
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState(allowed[0] ?? "galUS");
  const [toUnit, setToUnit] = useState(allowed[allowed.length - 1] ?? "L");
  const [result, setResult] = useState(0);

  const toInfo = VOLUME_UNITS.find((u) => u.id === toUnit);

  const update = useCallback(() => {
    const num = parseFloat(value);
    setResult(convertVolume(num, fromUnit, toUnit));
  }, [value, fromUnit, toUnit]);

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    if (pair?.allowedUnits.length) {
      setFromUnit(pair.allowedUnits[0]);
      setToUnit(pair.allowedUnits[pair.allowedUnits.length - 1]);
    }
  }, [toolSlug, pair]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const text = `${VOLUME_UNITS.find((u) => u.id === fromUnit)?.name ?? fromUnit}: ${value}\n${toInfo?.name ?? toUnit}: ${Number.isFinite(result) ? result.toFixed(6) : "—"}`;
  const copy = () => navigator.clipboard.writeText(text);
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${toolSlug}-conversion.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!pair?.allowedUnits?.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Unknown volume pair. <a href="/tools" className="underline">Browse all tools</a>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a value and convert between the two units. Choose US or UK gallon/pint in the dropdown. 100% local, no upload.
      </p>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Value</label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="1" className="w-32" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">From</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-[200px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
            {allowed.map((id) => {
              const u = VOLUME_UNITS.find((x) => x.id === id);
              return u ? <option key={id} value={id}>{u.name}</option> : null;
            })}
          </select>
        </div>
        <Button type="button" variant="outline" size="icon" onClick={swap} className="shrink-0" aria-label="Swap units">⇄</Button>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">To</label>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-[200px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
            {allowed.map((id) => {
              const u = VOLUME_UNITS.find((x) => x.id === id);
              return u ? <option key={id} value={id}>{u.name}</option> : null;
            })}
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
