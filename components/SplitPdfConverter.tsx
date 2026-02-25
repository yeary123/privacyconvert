"use client";

import { useCallback, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { splitPdfToPdfs } from "@/lib/documentConversion";

type Props = { toolSlug?: string };

type ResultItem = { name: string; blob: Blob };

export function SplitPdfConverter({ toolSlug = "split-pdf" }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
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
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const items = await splitPdfToPdfs(file);
      setResults(items.map(({ name, blob }) => ({ name, blob })));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Split failed");
    } finally {
      setLoading(false);
    }
  }, [file]);

  const handleDownload = useCallback((item: ResultItem) => {
    const url = URL.createObjectURL(item.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.name;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

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
          id="split-pdf-input"
          aria-label="Select PDF"
        />
        <label htmlFor="split-pdf-input" className="cursor-pointer flex flex-col items-center w-full">
          <FileText className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {file ? file.name : "Drop a PDF here or click to select"}
          </p>
        </label>
        {file && !loading && (
          <div className="mt-3 flex gap-2 flex-wrap justify-center">
            <Button type="button" onClick={handleConvert}>Split into pages</Button>
            <Button type="button" variant="outline" onClick={() => { setFile(null); setResults([]); setError(null); }}>Clear</Button>
          </div>
        )}
      </div>
      {loading && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Splitting…
          </p>
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}
      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{results.length} page(s)</p>
          <div className="flex flex-wrap gap-2">
            {results.map((item) => (
              <Button key={item.name} type="button" variant="outline" size="sm" onClick={() => handleDownload(item)}>
                <Download className="h-3 w-3" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
