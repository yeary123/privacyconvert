"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convertBase, getBasesFromPairSlug } from "@/lib/baseConverter";

const BASE_LABEL: Record<number, string> = {
  2: "Binary (2)",
  8: "Octal (8)",
  10: "Decimal (10)",
  16: "Hexadecimal (16)",
};

type BasePairConverterProps = { toolSlug: string };

export function BasePairConverter({ toolSlug }: BasePairConverterProps) {
  const pair = getBasesFromPairSlug(toolSlug);
  const [value, setValue] = useState("0");
  const [fromBase, setFromBase] = useState(pair?.fromBase ?? 10);
  const [toBase, setToBase] = useState(pair?.toBase ?? 2);
  const [result, setResult] = useState<string>("0");

  const update = useCallback(() => {
    const out = convertBase(value, fromBase, toBase);
    setResult(out ?? "—");
  }, [value, fromBase, toBase]);

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    if (pair) {
      setFromBase(pair.fromBase);
      setToBase(pair.toBase);
    }
  }, [toolSlug, pair]);

  const swap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    setValue(result !== "—" ? result : value);
  };

  const resultDisplay = result !== "—" ? result : "—";
  const text = `${BASE_LABEL[fromBase] ?? fromBase}: ${value}\n${BASE_LABEL[toBase] ?? toBase}: ${resultDisplay}`;
  const copy = () => navigator.clipboard.writeText(resultDisplay);
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
        Unknown base pair. <a href="/tools" className="underline">Browse all tools</a>.
      </div>
    );
  }

  const optionsForPair = [pair.fromBase, pair.toBase].map((b) => ({
    value: b,
    label: BASE_LABEL[b] ?? `Base ${b}`,
  }));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a value and convert between the two bases. 100% local, no upload.
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
          <label className="text-xs text-muted-foreground">From</label>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="w-[160px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {optionsForPair.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <Button type="button" variant="outline" size="icon" onClick={swap} className="shrink-0" aria-label="Swap bases">⇄</Button>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">To</label>
          <select
            value={toBase}
            onChange={(e) => setToBase(Number(e.target.value))}
            className="w-[160px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {optionsForPair.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">Result</p>
        <p className="text-lg font-mono break-all">{resultDisplay}</p>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> Copy</Button>
          <Button type="button" variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> Download</Button>
        </div>
      </div>
    </div>
  );
}
