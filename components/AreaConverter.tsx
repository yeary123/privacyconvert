"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Base: 1 square meter
const AREA_UNITS = [
  { id: "m2", name: "Square meter (m²)", toM2: 1 },
  { id: "km2", name: "Square kilometer (km²)", toM2: 1e6 },
  { id: "cm2", name: "Square centimeter (cm²)", toM2: 1e-4 },
  { id: "ft2", name: "Square foot (ft²)", toM2: 0.09290304 },
  { id: "in2", name: "Square inch (in²)", toM2: 0.00064516 },
  { id: "mi2", name: "Square mile (mi²)", toM2: 2589988.11 },
  { id: "yd2", name: "Square yard (yd²)", toM2: 0.836127 },
  { id: "acre", name: "Acre (acre)", toM2: 4046.86 },
  { id: "hectare", name: "Hectare (ha)", toM2: 10000 },
] as const;

function convertArea(value: number, fromId: string): Record<string, number> {
  const from = AREA_UNITS.find((u) => u.id === fromId);
  if (!from || !Number.isFinite(value)) return {};
  const m2 = value * from.toM2;
  const result: Record<string, number> = {};
  AREA_UNITS.forEach((u) => {
    result[u.name] = m2 / u.toM2;
  });
  return result;
}

export function AreaConverter() {
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState<string>("m2");
  const [results, setResults] = useState<Record<string, number>>({});

  const update = useCallback(() => {
    const num = parseFloat(value);
    setResults(convertArea(num, unit));
  }, [value, unit]);

  useEffect(() => {
    update();
  }, [update]);

  const text = Object.entries(results)
    .map(([name, v]) => `${name}: ${v}`)
    .join("\n");
  const copy = () => navigator.clipboard.writeText(text);
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "area-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter an area and choose unit. All conversions update in real time. 100% local, no upload.
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
          <label className="text-xs text-muted-foreground">From unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-[200px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {AREA_UNITS.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">Result (all units)</p>
        <div className="grid gap-1 text-sm font-mono max-h-48 overflow-y-auto">
          {Object.entries(results).map(([name, v]) => (
            <div key={name} className="flex justify-between gap-4">
              <span className="text-muted-foreground">{name}</span>
              <span>{Number.isFinite(v) ? v.toFixed(6) : "—"}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> Copy</Button>
          <Button type="button" variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> Download</Button>
        </div>
      </div>
    </div>
  );
}
