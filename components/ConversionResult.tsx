"use client";

import { useEffect, useMemo } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ResultItem = { name: string; blob: Blob };

type ConversionResultProps = {
  results: ResultItem[];
  type: "image" | "audio" | "video";
  onDownload: (name: string, blob: Blob) => void;
  /** When provided and results.length > 1, show a "Download all" button (e.g. sequential download). */
  onDownloadAll?: () => void;
};

/**
 * Preview + download for conversion results. First item shown as preview.
 */
export function ConversionResult({ results, type, onDownload, onDownloadAll }: ConversionResultProps) {
  const first = results[0];
  const previewUrl = useMemo(
    () => (first ? URL.createObjectURL(first.blob) : null),
    [first?.name, first?.blob?.size]
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (results.length === 0 || !previewUrl) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Preview &amp; Download</p>
      <div className="rounded-lg border border-border bg-muted/30 overflow-hidden">
        {type === "image" && (
          <img
            src={previewUrl}
            alt={first.name}
            className="max-h-48 w-full object-contain bg-background"
          />
        )}
        {type === "audio" && (
          <audio controls src={previewUrl} className="w-full">
            Your browser does not support audio.
          </audio>
        )}
        {type === "video" && (
          <video controls src={previewUrl} className="w-full max-h-48">
            Your browser does not support video.
          </video>
        )}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {onDownloadAll && results.length > 1 && (
          <Button variant="default" size="sm" onClick={onDownloadAll}>
            <Download className="h-4 w-4" />
            Download all
          </Button>
        )}
        {results.map((r) => (
          <Button
            key={r.name}
            variant="outline"
            size="sm"
            onClick={() => onDownload(r.name, r.blob)}
          >
            <Download className="h-4 w-4" />
            {r.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
