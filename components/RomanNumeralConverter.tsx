"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { intToRoman, romanToInt } from "@/lib/romanNumeral";

export function RomanNumeralConverter() {
  const [decimalInput, setDecimalInput] = useState("1");
  const [romanInput, setRomanInput] = useState("I");
  const [lastEdited, setLastEdited] = useState<"decimal" | "roman">("decimal");
  const [decimalValue, setDecimalValue] = useState<number | null>(1);
  const [romanStr, setRomanStr] = useState<string>("I");

  const syncFromDecimal = useCallback((s: string) => {
    const trimmed = s.trim();
    if (trimmed === "") {
      setDecimalValue(null);
      setRomanStr("—");
      return;
    }
    const n = parseInt(trimmed, 10);
    if (!Number.isInteger(n) || n < 1 || n > 3999) {
      setDecimalValue(null);
      setRomanStr("—");
      return;
    }
    setDecimalValue(n);
    setRomanStr(intToRoman(n) ?? "—");
    setRomanInput(intToRoman(n) ?? "");
  }, []);

  const syncFromRoman = useCallback((s: string) => {
    const trimmed = s.trim().toUpperCase();
    if (trimmed === "") {
      setDecimalValue(null);
      setRomanStr("—");
      return;
    }
    const n = romanToInt(trimmed);
    if (n == null) {
      setDecimalValue(null);
      setRomanStr("—");
      return;
    }
    setDecimalValue(n);
    setRomanStr(intToRoman(n) ?? "—");
    setDecimalInput(String(n));
  }, []);

  useEffect(() => {
    if (lastEdited === "decimal") syncFromDecimal(decimalInput);
    else syncFromRoman(romanInput);
  }, [lastEdited, decimalInput, romanInput, syncFromDecimal, syncFromRoman]);

  const decimalDisplay = decimalValue != null ? String(decimalValue) : "—";
  const romanDisplay = romanStr !== "—" ? romanStr : "—";
  const text = `Decimal: ${decimalDisplay}\nRoman: ${romanDisplay}`;
  const copy = () =>
    navigator.clipboard.writeText(
      `${decimalDisplay}\t${romanDisplay}`.replace("—\t—", "—")
    );
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "roman-numeral-conversion.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const swap = () => {
    if (decimalValue != null && romanStr !== "—") {
      setDecimalInput(decimalDisplay);
      setRomanInput(romanDisplay);
      setLastEdited(lastEdited === "decimal" ? "roman" : "decimal");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Convert between decimal numbers (1–3999) and Roman numerals (I, V, X, L, C, D, M). 100% in your browser. No upload.
      </p>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Decimal (1–3999)</label>
          <Input
            type="text"
            value={decimalInput}
            onChange={(e) => {
              setDecimalInput(e.target.value);
              setLastEdited("decimal");
            }}
            placeholder="1"
            className="w-32 font-mono"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={swap}
          className="shrink-0"
          aria-label="Swap"
        >
          ⇄
        </Button>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Roman numeral</label>
          <Input
            type="text"
            value={romanInput}
            onChange={(e) => {
              setRomanInput(e.target.value.toUpperCase());
              setLastEdited("roman");
            }}
            placeholder="I"
            className="w-40 font-mono uppercase"
          />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium">Result</p>
        <p className="text-lg font-mono">
          Decimal: {decimalDisplay} &nbsp; Roman: {romanDisplay}
        </p>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}>
            <Copy className="h-4 w-4" /> Copy
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={download}>
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>
    </div>
  );
}
