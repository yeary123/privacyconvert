"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Base: 1 liter
const VOLUME_UNITS = [
  { id: "L", name: "Liter (L)", toL: 1 },
  { id: "mL", name: "Milliliter (mL)", toL: 0.001 },
  { id: "m3", name: "Cubic meter (m³)", toL: 1000 },
  { id: "ft3", name: "Cubic foot (ft³)", toL: 28.3168 },
  { id: "in3", name: "Cubic inch (in³)", toL: 0.0163871 },
  { id: "galUS", name: "US gallon (gal)", toL: 3.78541 },
  { id: "galUK", name: "UK gallon (gal)", toL: 4.54609 },
  { id: "ptUS", name: "US pint (pt)", toL: 0.473176 },
  { id: "ptUK", name: "UK pint (pt)", toL: 0.568261 },
  { id: "qtUS", name: "US quart (qt)", toL: 0.946353 },
  { id: "qtUK", name: "UK quart (qt)", toL: 1.13652 },
  { id: "flozUS", name: "US fl oz", toL: 0.0295735 },
  { id: "flozUK", name: "UK fl oz", toL: 0.0284131 },
] as const;

function convertVolume(value: number, fromId: string): Record<string, number> {
  const from = VOLUME_UNITS.find((u) => u.id === fromId);
  if (!from || !Number.isFinite(value)) return {};
  const liters = value * from.toL;
  const result: Record<string, number> = {};
  VOLUME_UNITS.forEach((u) => {
    result[u.name] = liters / u.toL;
  });
  return result;
}

export function VolumeConverter() {
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState<string>("L");
  const [results, setResults] = useState<Record<string, number>>({});

  const update = useCallback(() => {
    const num = parseFloat(value);
    setResults(convertVolume(num, unit));
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
    a.download = "volume-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a volume or capacity and choose unit. All conversions update in real time. 100% local, no upload.
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
            {VOLUME_UNITS.map((u) => (
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
