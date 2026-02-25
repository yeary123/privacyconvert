"use client";

import { useCallback, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mergePdfs } from "@/lib/documentConversion";

type Props = { toolSlug?: string };

export function MergePdfsConverter({ toolSlug = "merge-pdfs" }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const list = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
    if (list.length === 0) {
      setError("Please drop PDF files only.");
      return;
    }
    setError(null);
    setFiles((prev) => [...prev, ...list]);
    setPdfBlob(null);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []).filter((f) => f.type === "application/pdf");
    if (list.length === 0) return;
    setError(null);
    setFiles((prev) => [...prev, ...list]);
    setPdfBlob(null);
    e.target.value = "";
  }, []);

  const handleConvert = useCallback(async () => {
    if (files.length < 2) {
      setError("Add at least 2 PDF files to merge.");
      return;
    }
    setLoading(true);
    setError(null);
    setPdfBlob(null);
    try {
      const blob = await mergePdfs(files);
      setPdfBlob(blob);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Merge failed");
    } finally {
      setLoading(false);
    }
  }, [files]);

  const handleDownload = useCallback(() => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }, [pdfBlob]);

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
          multiple
          onChange={handleFileSelect}
          disabled={loading}
          className="hidden"
          id="merge-pdfs-input"
          aria-label="Select PDFs"
        />
        <label htmlFor="merge-pdfs-input" className="cursor-pointer flex flex-col items-center w-full">
          <FileText className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {files.length > 0 ? `${files.length} PDF(s) — order preserved` : "Drop PDFs here or click to select"}
          </p>
        </label>
        {files.length >= 2 && !loading && (
          <div className="mt-3 flex gap-2 flex-wrap justify-center">
            <Button type="button" onClick={handleConvert}>Merge PDFs</Button>
            <Button type="button" variant="outline" onClick={() => { setFiles([]); setPdfBlob(null); setError(null); }}>Clear</Button>
          </div>
        )}
      </div>
      {loading && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Merging…
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
          <p className="text-sm font-medium">Merged PDF ready</p>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download merged.pdf
          </Button>
        </div>
      )}
    </div>
  );
}
