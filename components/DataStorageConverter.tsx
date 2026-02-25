"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_UNITS = [
  { id: "B", name: "Byte (B)", toBytes: 1 },
  { id: "b", name: "Bit (b)", toBytes: 1 / 8 },
  { id: "KB", name: "Kilobyte (KB)", toBytes: 1024 },
  { id: "MB", name: "Megabyte (MB)", toBytes: 1024 ** 2 },
  { id: "GB", name: "Gigabyte (GB)", toBytes: 1024 ** 3 },
  { id: "TB", name: "Terabyte (TB)", toBytes: 1024 ** 4 },
  { id: "PB", name: "Petabyte (PB)", toBytes: 1024 ** 5 },
  { id: "KiB", name: "Kibibyte (KiB)", toBytes: 1024 },
  { id: "MiB", name: "Mebibyte (MiB)", toBytes: 1024 ** 2 },
  { id: "GiB", name: "Gibibyte (GiB)", toBytes: 1024 ** 3 },
] as const;

function convertStorage(value: number, fromId: string): Record<string, number> {
  const from = STORAGE_UNITS.find((u) => u.id === fromId);
  if (!from || !Number.isFinite(value)) return {};
  const bytes = value * from.toBytes;
  const result: Record<string, number> = {};
  STORAGE_UNITS.forEach((u) => {
    result[u.name] = bytes / u.toBytes;
  });
  return result;
}

export function DataStorageConverter() {
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState<string>("MB");
  const [results, setResults] = useState<Record<string, number>>({});

  const update = useCallback(() => {
    const num = parseFloat(value);
    setResults(convertStorage(num, unit));
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
    a.download = "data-storage-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  useEffect(() => {
    console.log("完成：/convert/data-storage-converter");
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a value and choose unit. Bytes, KB, MB, GB, TB, bits — all conversions 100% local.
      </p>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Value</label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="1" className="w-32" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">From unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-[180px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {STORAGE_UNITS.map((u) => (
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
