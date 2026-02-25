"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileImage } from "lucide-react";
import { ConversionResult } from "@/components/ConversionResult";
import { convert } from "@/lib/conversion";
import type { ToolSlug } from "@/lib/tools";
import type { ImageOutputMime } from "@/lib/imageConversion";
import { DEFAULT_JPEG_QUALITY } from "@/lib/imageConversion";
import { useAuthStore } from "@/store/useAuthStore";
import { useProStore } from "@/store/useProStore";

const BATCH_LIMIT_FREE = 1;
const BATCH_LIMIT_MAX = 10;

function getBatchLimit(isPro: boolean): number {
  return isPro ? BATCH_LIMIT_MAX : BATCH_LIMIT_FREE;
}

/** Dedupe by name + size. */
function dedupeFiles(files: File[]): File[] {
  const seen = new Set<string>();
  return files.filter((f) => {
    const key = `${f.name}-${f.size}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export type CanvasImageConverterConfig = {
  /** MIME for accept, e.g. "image/avif". */
  acceptMime: string;
  /** Extensions for accept, e.g. [".avif"]. */
  acceptExt: string[];
  /** Output MIME: "image/png" | "image/jpeg". */
  outputMime: ImageOutputMime;
  /** Output extension, e.g. ".png". */
  outputExt: string;
  /** Replace input extension with this to get output name. */
  inputExtPattern: RegExp;
  /** Quality for JPEG (0–1). Ignored for PNG. */
  quality?: number;
  toolSlug: ToolSlug;
  ariaLabel: string;
  dropMessage: string;
};

type Props = { config: CanvasImageConverterConfig };

export function CanvasImageConverter({ config }: Props) {
  const {
    acceptMime,
    acceptExt,
    outputMime,
    outputExt,
    inputExtPattern,
    quality = DEFAULT_JPEG_QUALITY,
    toolSlug,
    ariaLabel,
    dropMessage,
  } = config;

  const isPro = useAuthStore((s) => s.isPro);
  const addHistory = useProStore((s) => s.addHistory);
  const incrementProtected = useProStore((s) => s.incrementProtected);
  const batchLimit = getBatchLimit(isPro);

  const [isConverting, setIsConverting] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [results, setResults] = useState<{ name: string; blob: Blob }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processFiles = useCallback(
    async (acceptedFiles: File[]) => {
      const files = dedupeFiles(acceptedFiles).slice(0, batchLimit);
      if (files.length === 0) return;
      if (acceptedFiles.length > batchLimit) {
        setError(`Max ${batchLimit} file(s). Upgrade to Pro for more.`);
      }

      setIsConverting(true);
      setError(null);
      setResults([]);
      setCurrentFileIndex(0);
      setCurrentProgress(0);

      const outputs: { name: string; blob: Blob }[] = [];
      const total = files.length;

      try {
        for (let i = 0; i < files.length; i++) {
          setCurrentFileIndex(i + 1);
          const file = files[i];
          const { blob, suggestedName } = await convert(toolSlug, file);
          outputs.push({ name: suggestedName, blob });
          setCurrentProgress(Math.round(((i + 1) / total) * 100));
        }
        setResults(outputs);
        if (outputs.length > 0) incrementProtected(outputs.length);
        if (isPro && outputs.length > 0) addHistory(toolSlug, outputs.length);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Conversion failed");
      } finally {
        setIsConverting(false);
        setCurrentProgress(0);
        setCurrentFileIndex(0);
      }
    },
    [batchLimit, toolSlug, isPro, addHistory, incrementProtected]
  );

  const onDrop = useCallback(
    (dropped: File[]) => processFiles(dropped),
    [processFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [acceptMime]: acceptExt } as Record<string, string[]>,
    maxFiles: batchLimit,
    disabled: isConverting,
    noClick: false,
    noKeyboard: false,
  });

  const download = useCallback((name: string, blob: Blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }, []);

  const downloadAll = useCallback(() => {
    if (results.length === 0) return;
    if (results.length === 1) {
      download(results[0].name, results[0].blob);
      return;
    }
    results.forEach((r, i) => {
      setTimeout(() => download(r.name, r.blob), i * 300);
    });
  }, [results, download]);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`rounded-xl border-2 border-dashed p-4 sm:p-6 md:p-8 text-center transition-colors min-h-[140px] sm:min-h-[160px] flex flex-col items-center justify-center touch-manipulation select-none ${
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        } ${isConverting ? "pointer-events-none opacity-70" : ""}`}
      >
        <input {...getInputProps()} aria-label={ariaLabel} />
        <FileImage className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isConverting ? "Converting..." : dropMessage}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {isPro ? "Pro active — batch & more unlocked" : "Free: 1 file at a time. Unlock batch & history with Pro."}
        </p>
      </div>

      {isConverting && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            File {currentFileIndex} — {currentProgress}%
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium"
        >
          {error}
        </div>
      )}

      {results.length > 0 && (
        <ConversionResult
          results={results}
          type="image"
          onDownload={download}
          onDownloadAll={results.length > 1 ? downloadAll : undefined}
        />
      )}
    </div>
  );
}
