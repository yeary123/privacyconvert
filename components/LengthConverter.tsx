"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LENGTH_UNITS = [
  { id: "m", name: "Meter (m)", toMeter: 1 },
  { id: "km", name: "Kilometer (km)", toMeter: 1000 },
  { id: "cm", name: "Centimeter (cm)", toMeter: 0.01 },
  { id: "mm", name: "Millimeter (mm)", toMeter: 0.001 },
  { id: "ft", name: "Foot (ft)", toMeter: 0.3048 },
  { id: "in", name: "Inch (in)", toMeter: 0.0254 },
  { id: "mi", name: "Mile (mi)", toMeter: 1609.344 },
  { id: "yd", name: "Yard (yd)", toMeter: 0.9144 },
  { id: "nmi", name: "Nautical mile (nmi)", toMeter: 1852 },
] as const;

function convertLength(value: number, fromId: string): Record<string, number> {
  const from = LENGTH_UNITS.find((u) => u.id === fromId);
  if (!from || !Number.isFinite(value)) return {};
  const meters = value * from.toMeter;
  const result: Record<string, number> = {};
  LENGTH_UNITS.forEach((u) => {
    result[u.name] = meters / u.toMeter;
  });
  return result;
}

export function LengthConverter() {
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState<string>("m");
  const [results, setResults] = useState<Record<string, number>>({});

  const update = useCallback(() => {
    const num = parseFloat(value);
    setResults(convertLength(num, unit));
  }, [value, unit]);

  useEffect(() => {
    update();
  }, [update]);

  const text = Object.entries(results)
    .map(([name, v]) => `${name}: ${v}`)
    .join("\n");
  const copy = () => {
    navigator.clipboard.writeText(text);
  };
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "length-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  useEffect(() => {
    console.log("完成：/convert/length-converter");
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a length and choose unit. All conversions update in real time. 100% local, no upload.
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
            className="w-[180px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {LENGTH_UNITS.map((u) => (
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
          <Button type="button" variant="outline" size="sm" onClick={copy}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={download}>
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
