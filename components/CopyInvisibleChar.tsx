"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Unicode code point in hex (e.g. "200B" for Zero Width Space). */
type CopyInvisibleCharProps = {
  code: string;
  label?: string;
  className?: string;
};

const COPIED_MS = 2000;

export function CopyInvisibleChar({ code, label, className }: CopyInvisibleCharProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const codePoint = parseInt(code, 16);
    if (Number.isNaN(codePoint)) return;
    const char = String.fromCodePoint(codePoint);
    try {
      await navigator.clipboard.writeText(char);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      setCopied(false);
    }
  }, [code]);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      aria-label={label ? `Copy ${label}` : "Copy character"}
      className={cn("shrink-0", className)}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" aria-hidden />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" aria-hidden />
          Copy
        </>
      )}
    </Button>
  );
}
