"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Download, FileText, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { convertPdfToImages } from "@/lib/pdfConversion";

type Props = { toolSlug?: string };

type ResultItem = { name: string; blob: Blob };

export function PdfToImagesConverter({ toolSlug = "pdf-to-images" }: Props) {
  const isPro = useAuthStore((s) => s.isPro);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadPhase, setLoadPhase] = useState<"idle" | "library" | "convert">("idle");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (!f || f.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }
    setError(null);
    setFile(f);
    setResults([]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }
    setError(null);
    setFile(f);
    setResults([]);
    e.target.value = "";
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file || !isPro) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setLoadPhase("library");
    try {
      setLoadPhase("convert");
      const items = await convertPdfToImages(file);
      setResults(items.map(({ name, blob }) => ({ name, blob })));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setLoading(false);
      setLoadPhase("idle");
    }
  }, [file, isPro]);

  const handleDownload = useCallback((item: ResultItem) => {
    const url = URL.createObjectURL(item.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.name;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (results[0]) {
      const url = URL.createObjectURL(results[0].blob);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [results]);

  if (!isPro) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Lock className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-2 font-medium">PDF to Images — Pro only</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Unlock batch PDF page extraction and more with Pro. All conversion stays 100% in your browser.
        </p>
        <Link href="/pricing" className={buttonVariants({ className: "mt-4 inline-block" })}>
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`rounded-xl border-2 border-dashed p-4 sm:p-6 md:p-8 text-center transition-colors min-h-[140px] flex flex-col items-center justify-center ${
          dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        } ${loading ? "pointer-events-none opacity-70" : ""}`}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          disabled={loading}
          className="hidden"
          id="pdf-file-input"
          aria-label="Select PDF file"
        />
        <label htmlFor="pdf-file-input" className="cursor-pointer flex flex-col items-center w-full">
          <FileText className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {file ? file.name : "Drop a PDF file (.pdf) here, or click to select"}
          </p>
        </label>
        {file && !loading && (
          <div className="mt-3 flex gap-2 flex-wrap justify-center">
            <Button type="button" onClick={handleConvert}>Extract pages to images</Button>
            <Button type="button" variant="outline" onClick={() => { setFile(null); setResults([]); setError(null); }}>Clear</Button>
          </div>
        )}
      </div>

      {loading && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary animate-pulse w-3/4" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadPhase === "library" ? "Loading PDF library…" : "Converting…"}
          </p>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium">Preview &amp; Download</p>
          <div className="rounded-lg border border-border bg-muted/30 overflow-hidden">
            {previewUrl && (
              <img src={previewUrl} alt="First page" className="max-h-48 w-full object-contain bg-background" />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {results.map((item) => (
              <Button key={item.name} variant="outline" size="sm" onClick={() => handleDownload(item)}>
                <Download className="h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
