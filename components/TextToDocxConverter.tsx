"use client";

import { useCallback, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateSimpleDocx } from "@/lib/documentConversion";

type Props = { toolSlug?: string };

export function TextToDocxConverter({ toolSlug = "text-to-docx" }: Props) {
  const [title, setTitle] = useState("");
  const [paragraphsText, setParagraphsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(async () => {
    const trimmedTitle = title.trim() || "Untitled";
    const paragraphs = paragraphsText
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (paragraphs.length === 0) {
      setError("Add at least one paragraph (one or more lines of text).");
      return;
    }
    setLoading(true);
    setError(null);
    setDocxBlob(null);
    try {
      const blob = await generateSimpleDocx(trimmedTitle, paragraphs);
      setDocxBlob(blob);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }, [title, paragraphsText]);

  const handleDownload = useCallback(() => {
    if (!docxBlob) return;
    const url = URL.createObjectURL(docxBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (title.trim() || "document").replace(/[^\w\s-]/g, "") + ".docx";
    a.click();
    URL.revokeObjectURL(url);
  }, [docxBlob, title]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter a title and paragraphs (one per line). The document is generated in your browser.
      </p>
      <div className="space-y-2">
        <label htmlFor="text-to-docx-title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="text-to-docx-title"
          type="text"
          placeholder="Document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="text-to-docx-paragraphs" className="text-sm font-medium">
          Paragraphs (one per line)
        </label>
        <textarea
          id="text-to-docx-paragraphs"
          placeholder="First paragraph&#10;Second paragraph&#10;..."
          value={paragraphsText}
          onChange={(e) => setParagraphsText(e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleConvert} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            "Generate DOCX"
          )}
        </Button>
        {docxBlob && (
          <Button type="button" variant="secondary" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download .docx
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
