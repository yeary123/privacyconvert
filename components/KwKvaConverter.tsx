"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** KVA = KW / powerFactor; KW = KVA * powerFactor */
function kwToKva(kw: number, pf: number): number {
  if (!Number.isFinite(kw) || !Number.isFinite(pf) || pf <= 0 || pf > 1) return 0;
  return kw / pf;
}
function kvaToKw(kva: number, pf: number): number {
  if (!Number.isFinite(kva) || !Number.isFinite(pf) || pf <= 0 || pf > 1) return 0;
  return kva * pf;
}

type KwKvaConverterProps = { toolSlug: string };

export function KwKvaConverter({ toolSlug }: KwKvaConverterProps) {
  const [kw, setKw] = useState("");
  const [kva, setKva] = useState("");
  const [pf, setPf] = useState("0.8");
  const [kvaFromKw, setKvaFromKw] = useState(0);
  const [kwFromKva, setKwFromKva] = useState(0);

  const update = useCallback(() => {
    const pfNum = parseFloat(pf);
    setKvaFromKw(kwToKva(parseFloat(kw) || 0, pfNum));
    setKwFromKva(kvaToKw(parseFloat(kva) || 0, pfNum));
  }, [kw, kva, pf]);

  useEffect(() => {
    update();
  }, [update]);

  const text = `Power factor: ${pf}\nKW: ${kw || "—"} → KVA: ${Number.isFinite(kvaFromKw) ? kvaFromKw.toFixed(4) : "—"}\nKVA: ${kva || "—"} → KW: ${Number.isFinite(kwFromKva) ? kwFromKva.toFixed(4) : "—"}`;
  const copy = () => navigator.clipboard.writeText(text);
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kw-kva-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Convert between kW (real power) and kVA (apparent power) using power factor. KVA = KW ÷ PF; KW = KVA × PF. 100% local, no upload.
      </p>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Power factor (0.01 – 1.0)</label>
        <Input
          type="number"
          min="0.01"
          max="1"
          step="0.01"
          value={pf}
          onChange={(e) => setPf(e.target.value)}
          placeholder="0.8"
          className="w-32"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <p className="text-sm font-medium">KW → KVA</p>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Kilowatts (kW)</label>
            <Input type="number" value={kw} onChange={(e) => setKw(e.target.value)} placeholder="100" className="w-full" />
          </div>
          <p className="text-lg font-mono">= {Number.isFinite(kvaFromKw) ? kvaFromKw.toFixed(4) : "—"} kVA</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <p className="text-sm font-medium">KVA → KW</p>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Kilovolt-amperes (kVA)</label>
            <Input type="number" value={kva} onChange={(e) => setKva(e.target.value)} placeholder="125" className="w-full" />
          </div>
          <p className="text-lg font-mono">= {Number.isFinite(kwFromKva) ? kwFromKva.toFixed(4) : "—"} kW</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> Copy</Button>
        <Button type="button" variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> Download</Button>
      </div>
    </div>
  );
}
