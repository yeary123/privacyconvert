"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversionResult } from "@/components/ConversionResult";
import { convert, loadFFmpeg } from "@/lib/conversion";
import type { ToolSlug } from "@/lib/tools";
import { useAuthStore } from "@/store/useAuthStore";
import { useProStore } from "@/store/useProStore";

const BATCH_LIMIT_FREE = 1;

function getBatchLimit(isPro: boolean): number {
  return isPro ? 999 : BATCH_LIMIT_FREE;
}

type Props = { toolSlug?: ToolSlug };

export function Mp4ToWebmConverter({ toolSlug = "mp4-to-webm" }: Props) {
  const isPro = useAuthStore((s) => s.isPro);
  const addHistory = useProStore((s) => s.addHistory);
  const incrementProtected = useProStore((s) => s.incrementProtected);
  const batchLimit = getBatchLimit(isPro);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ name: string; blob: Blob }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onLoad = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await loadFFmpeg((p) => {
        if (p.phase === "loading") setLoadProgress(p.percent);
        if (p.phase === "done") setLoaded(true);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load FFmpeg");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!loaded) return;
      const limit = batchLimit;
      const files = acceptedFiles.slice(0, limit);
      if (acceptedFiles.length > limit) {
        setError(`Free: max ${limit} file(s). Upgrade to Pro for unlimited batch.`);
      }
      setConverting(true);
      setError(null);
      setResults([]);
      setProgress(0);
      try {
        const outputs: { name: string; blob: Blob }[] = [];
        for (const file of files) {
          const result = await convert(toolSlug, file, { onProgress: setProgress });
          outputs.push({ name: result.suggestedName, blob: result.blob });
        }
        setResults(outputs);
        if (outputs.length > 0) incrementProtected(outputs.length);
        if (isPro && outputs.length > 0) addHistory(toolSlug, outputs.length);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Conversion failed");
      } finally {
        setConverting(false);
        setProgress(0);
      }
    },
    [loaded, batchLimit, isPro, addHistory, incrementProtected, toolSlug]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/mp4": [".mp4"] },
    maxFiles: batchLimit,
    disabled: !loaded || converting,
  });

  const download = (name: string, blob: Blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!loaded && !loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">FFmpeg runs in your browser. Load it once to start.</p>
        <Button onClick={onLoad} className="mt-4 min-h-[44px] min-w-[44px] sm:min-w-0" disabled={loading}>
          Load FFmpeg (~31 MB)
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading FFmpeg... {loadProgress}%</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`rounded-xl border-2 border-dashed p-4 sm:p-6 md:p-8 text-center transition-colors min-h-[140px] sm:min-h-[160px] flex flex-col items-center justify-center touch-manipulation select-none ${
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        } ${converting ? "pointer-events-none opacity-70" : ""}`}
      >
        <input {...getInputProps()} aria-label="Drop or select MP4 files" />
        <Video className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {converting ? "Converting..." : "Drop MP4 files here, or click to select"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {isPro ? "Pro active — batch & more unlocked" : "Free: 1 file at a time. Unlock batch, history & P2P with Pro."}
        </p>
      </div>
      {converting && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{progress}%</p>
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}
      {results.length > 0 && (
        <ConversionResult results={results} type="video" onDownload={download} />
      )}
    </div>
  );
}
