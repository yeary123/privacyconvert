"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Base: 1 m/s
const MPS_PER_KMH = 1 / 3.6;
const MPS_PER_MPH = 0.44704;
const MPS_PER_KNOT = 0.514444;
const MPS_PER_MACH = 340.29; // at sea level, 15°C
const MPS_PER_FPS = 0.3048;

const SPEED_UNITS = [
  { id: "mps", name: "Meter per second (m/s)", toMps: 1 },
  { id: "kmh", name: "Kilometer per hour (km/h)", toMps: MPS_PER_KMH },
  { id: "mph", name: "Mile per hour (mph)", toMps: MPS_PER_MPH },
  { id: "knot", name: "Knot (kn)", toMps: MPS_PER_KNOT },
  { id: "mach", name: "Mach (sea level)", toMps: MPS_PER_MACH },
  { id: "fps", name: "Foot per second (ft/s)", toMps: MPS_PER_FPS },
] as const;

function convertSpeed(value: number, fromId: string): Record<string, number> {
  const from = SPEED_UNITS.find((u) => u.id === fromId);
  if (!from || !Number.isFinite(value)) return {};
  const mps = value * from.toMps;
  const result: Record<string, number> = {};
  SPEED_UNITS.forEach((u) => {
    result[u.name] = mps / u.toMps;
  });
  return result;
}

export function SpeedConverter() {
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState<string>("kmh");
  const [results, setResults] = useState<Record<string, number>>({});

  const update = useCallback(() => {
    const num = parseFloat(value);
    setResults(convertSpeed(num, unit));
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
    a.download = "speed-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a speed and choose unit. km/h, mph, knots, m/s, and Mach update in real time. 100% local, no upload.
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
            className="w-[220px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {SPEED_UNITS.map((u) => (
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
