"use client";

import { useCallback, useRef, useState } from "react";
import { Download, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertHtmlToPdf } from "@/lib/documentConversion";

type Props = { toolSlug?: string };

function extractBodyContent(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1];
  if (/<html[\s>]/i.test(html)) {
    const stripped = html
      .replace(/<\/?html[^>]*>/gi, "")
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
      .replace(/<\/?body[^>]*>/gi, "")
      .trim();
    return stripped;
  }
  return html;
}

export function HtmlToPdfConverter({ toolSlug = "html-to-pdf" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const loadHtmlFile = useCallback((file: File) => {
    const name = file.name.toLowerCase();
    if (!name.endsWith(".html") && !name.endsWith(".htm")) {
      setError("Please select an HTML file (.html or .htm).");
      return;
    }
    setError(null);
    setPdfBlob(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = e.target?.result as string;
      const content = extractBodyContent(raw);
      if (containerRef.current) {
        containerRef.current.innerHTML = content;
      }
      setFileName(file.name);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) loadHtmlFile(file);
    },
    [loadHtmlFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadHtmlFile(file);
      e.target.value = "";
    },
    [loadHtmlFile]
  );

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
    a.download = fileName
      ? fileName.replace(/\.html?$/i, "") + ".pdf"
      : "export.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }, [pdfBlob, fileName]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload an HTML file or edit content below, then export as PDF. All
        processing runs in your browser.
      </p>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`rounded-xl border-2 border-dashed p-4 sm:p-6 text-center transition-colors flex flex-col items-center justify-center ${
          dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        } ${loading ? "pointer-events-none opacity-70" : ""}`}
      >
        <input
          type="file"
          accept=".html,.htm,text/html"
          onChange={handleFileSelect}
          disabled={loading}
          className="hidden"
          id="html-to-pdf-input"
          aria-label="Select HTML file"
        />
        <label
          htmlFor="html-to-pdf-input"
          className="cursor-pointer flex flex-col items-center w-full"
        >
          <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {fileName
              ? fileName
              : "Drop an HTML file (.html) here, or click to select"}
          </p>
        </label>
      </div>

      <div
        ref={containerRef}
        className="rounded-xl border border-border bg-card p-6 min-h-[200px] text-foreground prose prose-sm dark:prose-invert max-w-none"
        contentEditable
        suppressContentEditableWarning
      >
        <h2 className="text-lg font-semibold">Sample heading</h2>
        <p>
          Edit this content. You can change the text, add more paragraphs, or
          paste HTML. Click &quot;Export as PDF&quot; to download.
        </p>
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
          <Button
            type="button"
            variant="secondary"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        )}
      </div>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium"
        >
          {error}
        </div>
      )}
    </div>
  );
}
