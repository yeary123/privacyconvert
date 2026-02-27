"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const IN_TO_CM = 2.54;

function inToCm(inVal: number): number {
  if (!Number.isFinite(inVal)) return 0;
  return inVal * IN_TO_CM;
}
type PantsSizeConverterProps = { toolSlug: string };

export function PantsSizeConverter({ toolSlug }: PantsSizeConverterProps) {
  const [waistIn, setWaistIn] = useState("");
  const [lengthIn, setLengthIn] = useState("");
  const [waistCm, setWaistCm] = useState(0);
  const [lengthCm, setLengthCm] = useState(0);

  const update = useCallback(() => {
    const w = parseFloat(waistIn) || 0;
    const l = parseFloat(lengthIn) || 0;
    setWaistCm(inToCm(w));
    setLengthCm(inToCm(l));
  }, [waistIn, lengthIn]);

  useEffect(() => {
    update();
  }, [update]);

  const wNum = parseFloat(waistIn);
  const lNum = parseFloat(lengthIn);
  const usLabel =
    Number.isFinite(wNum) && Number.isFinite(lNum) && (wNum > 0 || lNum > 0)
      ? `W${Math.round(wNum) || "?"} L${Math.round(lNum) || "?"}`
      : "—";

  const text = `Pants / Jeans size (US)\nWaist: ${waistIn || "—"} in = ${Number.isFinite(waistCm) ? waistCm.toFixed(2) : "—"} cm\nInseam: ${lengthIn || "—"} in = ${Number.isFinite(lengthCm) ? lengthCm.toFixed(2) : "—"} cm\nFormat: ${usLabel}`;
  const copy = () => navigator.clipboard.writeText(text);
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pants-size-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Convert US pants/jeans waist (W) and inseam length (L) between inches and cm. Common format: W30 L32 = waist 30 in, length 32 in. 100% local, no upload.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <p className="text-sm font-medium">Waist (W)</p>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Inches (US)</label>
            <Input
              type="number"
              min="24"
              max="50"
              step="1"
              value={waistIn}
              onChange={(e) => setWaistIn(e.target.value)}
              placeholder="30"
              className="w-full"
            />
          </div>
          <p className="text-lg font-mono">= {Number.isFinite(waistCm) ? waistCm.toFixed(2) : "—"} cm</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <p className="text-sm font-medium">Inseam / Length (L)</p>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Inches (US)</label>
            <Input
              type="number"
              min="26"
              max="38"
              step="1"
              value={lengthIn}
              onChange={(e) => setLengthIn(e.target.value)}
              placeholder="32"
              className="w-full"
            />
          </div>
          <p className="text-lg font-mono">= {Number.isFinite(lengthCm) ? lengthCm.toFixed(2) : "—"} cm</p>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">US size (W×L)</p>
        <p className="text-lg font-mono">{usLabel}</p>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> Copy</Button>
        <Button type="button" variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> Download</Button>
      </div>
    </div>
  );
}
