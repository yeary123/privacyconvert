"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BookOpen, Copy, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractEpubToHtml } from "@/lib/epubConversion";

type Props = { toolSlug: string };

export function EpubToMobiConverter({ toolSlug }: Props) {
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<{ name: string; blob: Blob } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setConverting(true);
    setError(null);
    setResult(null);
    try {
      const { blob, suggestedName } = await extractEpubToHtml(file);
      setResult({ name: suggestedName, blob });
      if (typeof console !== "undefined" && console.log) {
        console.log("完成：/convert/" + toolSlug);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setConverting(false);
    }
  }, [toolSlug]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/epub+zip": [".epub"], "application/zip": [".epub"] },
    maxFiles: 1,
    disabled: converting,
  });

  const download = useCallback(() => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(result.blob);
    a.download = result.name;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [result]);

  const copyAsHtml = useCallback(async () => {
    if (!result) return;
    const text = await result.blob.text();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload an EPUB file. We extract the book content 100% in your browser and give you an HTML file. Open it in Calibre (free) to convert to MOBI or AZW3. No upload, no server.
      </p>
      <div
        {...getRootProps()}
        className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors min-h-[140px] flex flex-col items-center justify-center touch-manipulation select-none ${
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        } ${converting ? "pointer-events-none opacity-70" : ""}`}
      >
        <input {...getInputProps()} aria-label="Drop or select EPUB file" />
        <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {converting ? "Extracting…" : "Drop EPUB here, or click to select"}
        </p>
      </div>
      {error && (
        <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}
      {result && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <p className="text-sm font-medium">Result: {result.name}</p>
          <p className="text-xs text-muted-foreground">
            Open this HTML in Calibre: File → Add books, then Convert books → MOBI or AZW3. Your file never left your device.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="default" size="sm" onClick={download}>
              <Download className="h-4 w-4" />
              Download HTML
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={copyAsHtml}>
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy content"}
            </Button>
          </div>
        </div>
      )}
      {converting && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Extracting content…
        </div>
      )}
    </div>
  );
}
