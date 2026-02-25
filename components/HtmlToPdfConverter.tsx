"use client";

import { useCallback, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertHtmlToPdf } from "@/lib/documentConversion";

type Props = { toolSlug?: string };

export function HtmlToPdfConverter({ toolSlug = "html-to-pdf" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(async () => {
    const el = containerRef.current;
    if (!el) {
      setError("No content area to convert.");
      return;
    }
    setLoading(true);
    setError(null);
    setPdfBlob(null);
    try {
      const blob = await convertHtmlToPdf(el, { scale: 2 });
      setPdfBlob(blob);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }, [pdfBlob]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Add or edit content below, then export it as PDF. All processing runs in your browser.
      </p>
      <div
        ref={containerRef}
        className="rounded-xl border border-border bg-card p-6 min-h-[200px] text-foreground prose prose-sm dark:prose-invert max-w-none"
        contentEditable
        suppressContentEditableWarning
      >
        <h2 className="text-lg font-semibold">Sample heading</h2>
        <p>Edit this content. You can change the text, add more paragraphs, or paste HTML. Click &quot;Export as PDF&quot; to download.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleConvert} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Converting…
            </>
          ) : (
            "Export as PDF"
          )}
        </Button>
        {pdfBlob && (
          <Button type="button" variant="secondary" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        )}
      </div>
      {error && (
        <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
