"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_OPTIONS, convertBase } from "@/lib/baseConverter";

export function BaseConverter() {
  const [value, setValue] = useState("0");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [result, setResult] = useState<string>("0");

  const update = useCallback(() => {
    const out = convertBase(value, fromBase, toBase);
    setResult(out ?? "—");
  }, [value, fromBase, toBase]);

  useEffect(() => {
    update();
  }, [update]);

  const resultDisplay = result !== "—" ? result : "—";
  const text = `From base ${fromBase}: ${value}\nTo base ${toBase}: ${resultDisplay}`;
  const copy = () => navigator.clipboard.writeText(resultDisplay);
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "base-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const swap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    setValue(result !== "—" ? result : value);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a number and choose source and target base (binary, octal, decimal, hex). Conversion runs 100% in your browser. No upload.
      </p>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Value</label>
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0"
            className="w-40 font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">From base</label>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="w-[160px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {BASE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <Button type="button" variant="outline" size="icon" onClick={swap} className="shrink-0" aria-label="Swap bases">⇄</Button>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">To base</label>
          <select
            value={toBase}
            onChange={(e) => setToBase(Number(e.target.value))}
            className="w-[160px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {BASE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">Result (base {toBase})</p>
        <p className="text-lg font-mono break-all">{resultDisplay}</p>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> Copy</Button>
          <Button type="button" variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> Download</Button>
        </div>
      </div>
    </div>
  );
}
