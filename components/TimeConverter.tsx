"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SEC = 1;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

function convertTime(seconds: number) {
  return {
    "Seconds (s)": seconds,
    "Minutes (min)": seconds / MIN,
    "Hours (hr)": seconds / HOUR,
    "Days (d)": seconds / DAY,
    "Weeks (wk)": seconds / WEEK,
  };
}

function parseInput(val: string, mode: "seconds" | "timestamp"): number {
  const t = val.trim();
  if (mode === "timestamp") {
    const ts = parseInt(t, 10);
    if (!Number.isFinite(ts)) return 0;
    if (ts > 1e12) return ts / 1000;
    return ts;
  }
  return parseFloat(t) || 0;
}

export function TimeConverter() {
  const [value, setValue] = useState("0");
  const [mode, setMode] = useState<"seconds" | "timestamp">("seconds");
  const [results, setResults] = useState<ReturnType<typeof convertTime>>(convertTime(0));
  const [dateStr, setDateStr] = useState("");

  const update = useCallback(() => {
    const sec = parseInput(value, mode);
    setResults(convertTime(sec));
    try {
      const d = new Date(sec * 1000);
      setDateStr(Number.isFinite(sec) ? d.toISOString() : "");
    } catch {
      setDateStr("");
    }
  }, [value, mode]);

  useEffect(() => {
    update();
  }, [update]);

  const text = [
    ...Object.entries(results).map(([k, v]) => `${k}: ${v}`),
    dateStr ? `ISO date: ${dateStr}` : "",
  ].filter(Boolean).join("\n");
  const copy = () => navigator.clipboard.writeText(text);
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "time-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  useEffect(() => {
    console.log("完成：/convert/time-converter");
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter seconds or Unix timestamp. Get equivalent time in seconds, minutes, hours, days, weeks and ISO date. 100% local.
      </p>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Value</label>
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mode === "timestamp" ? "1700000000" : "3600"}
            className="w-40"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Input as</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "seconds" | "timestamp")}
            className="w-[160px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="seconds">Seconds</option>
            <option value="timestamp">Unix timestamp</option>
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">Result</p>
        <div className="grid gap-1 text-sm font-mono">
          {Object.entries(results).map(([name, v]) => (
            <div key={name} className="flex justify-between gap-4">
              <span className="text-muted-foreground">{name}</span>
              <span>{Number.isFinite(v) ? v.toFixed(4) : "—"}</span>
            </div>
          ))}
          {dateStr && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">ISO date</span>
              <span className="text-xs">{dateStr}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> Copy</Button>
          <Button type="button" variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> Download</Button>
        </div>
      </div>
    </div>
  );
}
