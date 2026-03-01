"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Download, FileImage, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { convertImagesToPdf } from "@/lib/pdfConversion";

type Props = { toolSlug?: string };

export function ImagesToPdfConverter({ toolSlug = "images-to-pdf" }: Props) {
  const isPro = useAuthStore((s) => s.isPro);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadPhase, setLoadPhase] = useState<"idle" | "library" | "convert">("idle");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const accept = "image/*,.png,.jpg,.jpeg,.webp,.gif,.bmp";

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const list = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      setError("Please select image files.");
      return;
    }
    setError(null);
    setFiles((prev) => (isPro ? [...prev, ...list] : list.slice(0, 1)));
    setPdfBlob(null);
  }, [isPro]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setError(null);
    setFiles((prev) => (isPro ? [...prev, ...list] : list.slice(0, 1)));
    setPdfBlob(null);
    e.target.value = "";
  }, [isPro]);

  const handleConvert = useCallback(async () => {
    if (files.length === 0 || !isPro) return;
    setLoading(true);
    setError(null);
    setPdfBlob(null);
    setLoadPhase("library");
    try {
      setLoadPhase("convert");
      const blob = await convertImagesToPdf(files);
      setPdfBlob(blob);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setLoading(false);
      setLoadPhase("idle");
    }
  }, [files, isPro]);

  const handleDownload = useCallback(() => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "images.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }, [pdfBlob]);

  if (!isPro) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Lock className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-2 font-medium">Images to PDF — Pro only</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Unlock combining multiple images into one PDF with Pro. All conversion stays 100% in your browser.
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
          accept={accept}
          multiple
          onChange={handleFileSelect}
          disabled={loading}
          className="hidden"
          id="images-pdf-input"
          aria-label="Select images"
        />
        <label htmlFor="images-pdf-input" className="cursor-pointer flex flex-col items-center w-full">
          <FileImage className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {files.length > 0 ? `${files.length} image(s) selected` : "Drop PNG, JPEG, WebP, GIF, or BMP images here, or click to select"}
          </p>
        </label>
        {files.length > 0 && !loading && (
          <div className="mt-3 flex gap-2 flex-wrap justify-center">
            <Button type="button" onClick={handleConvert}>Combine into PDF</Button>
            <Button type="button" variant="outline" onClick={() => { setFiles([]); setPdfBlob(null); setError(null); }}>Clear</Button>
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

      {pdfBlob && (
        <div className="space-y-4">
          <p className="text-sm font-medium">PDF ready</p>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      )}
    </div>
  );
}
