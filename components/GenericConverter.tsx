"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileImage, Music, Video } from "lucide-react";
import { ConversionResult } from "@/components/ConversionResult";
import { convert, loadFFmpeg, needsFFmpeg } from "@/lib/conversion";
import { getAccept, getAcceptDropHint } from "@/lib/conversion/accept";
import { TOOLS, type ToolSlug } from "@/lib/tools";
import { useAuthStore } from "@/store/useAuthStore";
import { useProStore } from "@/store/useProStore";

const BATCH_LIMIT_FREE = 1;

function getBatchLimit(isPro: boolean): number {
  return isPro ? 999 : BATCH_LIMIT_FREE;
}

function resultType(category: string): "image" | "audio" | "video" {
  if (category === "audio") return "audio";
  if (category === "video") return "video";
  return "image";
}

type Props = { toolSlug: ToolSlug };

export function GenericConverter({ toolSlug }: Props) {
  const tool = TOOLS.find((t) => t.slug === toolSlug);
  const isPro = useAuthStore((s) => s.isPro);
  const addHistory = useProStore((s) => s.addHistory);
  const incrementProtected = useProStore((s) => s.incrementProtected);
  const batchLimit = getBatchLimit(isPro);
  const useFFmpeg = needsFFmpeg(toolSlug);
  const [loaded, setLoaded] = useState(!useFFmpeg);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingFFmpeg, setLoadingFFmpeg] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ name: string; blob: Blob }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const accept = getAccept(toolSlug) ?? (tool?.category === "audio" ? { "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac"] } : tool?.category === "video" ? { "video/*": [".mp4", ".webm", ".mov", ".mkv", ".avi", ".gif"] } : { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif", ".bmp"] });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
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
        if (useFFmpeg && !loaded) {
          setLoadingFFmpeg(true);
          setLoadProgress(0);
          await loadFFmpeg((p) => {
            if (p.phase === "loading") setLoadProgress(p.percent);
            if (p.phase === "done") setLoaded(true);
          });
          setLoadingFFmpeg(false);
        }
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
        setLoadingFFmpeg(false);
        setProgress(0);
      }
    },
    [loaded, batchLimit, isPro, addHistory, incrementProtected, toolSlug, useFFmpeg]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: batchLimit,
    disabled: converting,
  });

  const download = (name: string, blob: Blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const Icon = tool?.category === "audio" ? Music : tool?.category === "video" ? Video : FileImage;
  const resultTypeVal = tool ? resultType(tool.category) : "image";

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`rounded-xl border-2 border-dashed p-4 sm:p-6 md:p-8 text-center transition-colors min-h-[140px] sm:min-h-[160px] flex flex-col items-center justify-center touch-manipulation select-none ${
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        } ${converting ? "pointer-events-none opacity-70" : ""}`}
      >
        <input {...getInputProps()} aria-label={`Drop or select files for ${tool?.name ?? toolSlug}`} />
        <Icon className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {converting
            ? loadingFFmpeg
              ? "Loading converter…"
              : "Converting..."
            : `Drop ${getAcceptDropHint(toolSlug)} here, or click to select`}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {isPro ? "Pro active — batch & more unlocked" : "Free: 1 file at a time. Unlock batch & history with Pro."}
        </p>
      </div>
      {converting && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${loadingFFmpeg ? loadProgress : progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {loadingFFmpeg ? `Loading converter… ${loadProgress}%` : `${progress}%`}
          </p>
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}
      {results.length > 0 && (
        <ConversionResult results={results} type={resultTypeVal} onDownload={download} />
      )}
    </div>
  );
}
