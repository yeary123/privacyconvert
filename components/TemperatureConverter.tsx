"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function cToF(c: number) {
  return (c * 9) / 5 + 32;
}
function cToK(c: number) {
  return c + 273.15;
}
function fToC(f: number) {
  return ((f - 32) * 5) / 9;
}
function kToC(k: number) {
  return k - 273.15;
}

export function TemperatureConverter() {
  const [value, setValue] = useState("0");
  const [unit, setUnit] = useState<string>("c");
  const [results, setResults] = useState<{ Celsius: number; Fahrenheit: number; Kelvin: number }>({ Celsius: 0, Fahrenheit: 32, Kelvin: 273.15 });

  const update = useCallback(() => {
    const num = parseFloat(value);
    if (!Number.isFinite(num)) return;
    let c = num;
    if (unit === "f") c = fToC(num);
    else if (unit === "k") c = kToC(num);
    setResults({
      Celsius: c,
      Fahrenheit: cToF(c),
      Kelvin: cToK(c),
    });
  }, [value, unit]);

  useEffect(() => {
    update();
  }, [update]);

  const text = `Celsius: ${results.Celsius}\nFahrenheit: ${results.Fahrenheit}\nKelvin: ${results.Kelvin}`;
  const copy = () => navigator.clipboard.writeText(text);
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "temperature-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  useEffect(() => {
    console.log("完成：/convert/temperature-converter");
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a temperature and choose unit. Celsius, Fahrenheit, and Kelvin update in real time. 100% local.
      </p>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Value</label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0" className="w-32" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">From unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-[180px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="c">Celsius (°C)</option>
            <option value="f">Fahrenheit (°F)</option>
            <option value="k">Kelvin (K)</option>
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">Result</p>
        <div className="grid gap-1 text-sm font-mono">
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">Celsius</span><span>{results.Celsius.toFixed(4)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">Fahrenheit</span><span>{results.Fahrenheit.toFixed(4)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">Kelvin</span><span>{results.Kelvin.toFixed(4)}</span></div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> Copy</Button>
          <Button type="button" variant="outline" size="sm" onClick={download}><Download className="h-4 w-4" /> Download</Button>
        </div>
      </div>
    </div>
  );
}
