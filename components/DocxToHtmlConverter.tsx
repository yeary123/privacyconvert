"use client";

import { useCallback, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertDocxToHtml } from "@/lib/documentConversion";

type Props = { toolSlug?: string };

export function DocxToHtmlConverter({ toolSlug = "docx-to-html" }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ type: string; message: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (!f || !f.name.toLowerCase().endsWith(".docx")) {
      setError("Please select a .docx file.");
      return;
    }
    setError(null);
    setFile(f);
    setHtml(null);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".docx")) {
      setError("Please select a .docx file.");
      return;
    }
    setError(null);
    setFile(f);
    setHtml(null);
    e.target.value = "";
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setHtml(null);
    setMessages([]);
    try {
      const result = await convertDocxToHtml(file);
      setHtml(result.html);
      setMessages(result.messages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setLoading(false);
    }
  }, [file]);

  const handleCopyHtml = useCallback(() => {
    if (!html) return;
    void navigator.clipboard.writeText(html);
  }, [html]);

  const handleDownloadHtml = useCallback(() => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name ?? "document").replace(/\.docx$/i, "") + ".html";
    a.click();
    URL.revokeObjectURL(url);
  }, [html, file?.name]);

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
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileSelect}
          disabled={loading}
          className="hidden"
          id="docx-to-html-input"
          aria-label="Select DOCX"
        />
        <label htmlFor="docx-to-html-input" className="cursor-pointer flex flex-col items-center w-full">
          <FileText className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {file ? file.name : "Drop a .docx here or click to select"}
          </p>
        </label>
        {file && !loading && (
          <div className="mt-3 flex gap-2 flex-wrap justify-center">
            <Button type="button" onClick={handleConvert}>Convert to HTML</Button>
            <Button type="button" variant="outline" onClick={() => { setFile(null); setHtml(null); setError(null); setMessages([]); }}>Clear</Button>
          </div>
        )}
      </div>
      {loading && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Converting…
          </p>
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}
      {messages.length > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
          {messages.map((m, i) => (
            <div key={i}><span className="font-medium">{m.type}:</span> {m.message}</div>
          ))}
        </div>
      )}
      {html && (
        <div className="space-y-3">
          <p className="text-sm font-medium">HTML output</p>
          <div className="rounded-lg border border-border bg-card p-4 max-h-[320px] overflow-auto">
            <pre className="text-xs whitespace-pre-wrap break-words font-mono">{html}</pre>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={handleCopyHtml}>Copy HTML</Button>
            <Button type="button" variant="secondary" size="sm" onClick={handleDownloadHtml}>Download .html</Button>
          </div>
        </div>
      )}
    </div>
  );
}
