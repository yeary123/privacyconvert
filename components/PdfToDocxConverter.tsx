"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertPdfToDocx } from "@/lib/pdfToDocx";

type Props = { toolSlug: string };

export function PdfToDocxConverter({ toolSlug }: Props) {
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<{ name: string; blob: Blob } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setConverting(true);
    setError(null);
    setResult(null);
    try {
      const { blob, suggestedName } = await convertPdfToDocx(file);
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
    accept: { "application/pdf": [".pdf"] },
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

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload a PDF. We extract text and build a Word document 100% in your browser. No upload, no server.
      </p>
      <div
        {...getRootProps()}
        className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors min-h-[140px] flex flex-col items-center justify-center ${
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        } ${converting ? "pointer-events-none opacity-70" : ""}`}
      >
        <input {...getInputProps()} aria-label="Drop or select PDF file" />
        <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {converting ? "Converting…" : "Drop PDF here, or click to select"}
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
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="default" size="sm" onClick={download}>
              Download DOCX
            </Button>
          </div>
        </div>
      )}
      {converting && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Extracting text and building DOCX…
        </div>
      )}
    </div>
  );
}
