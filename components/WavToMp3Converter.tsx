"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversionResult } from "@/components/ConversionResult";
import { WAV_MP3_WORKER_CODE } from "@/lib/wavMp3WorkerCode";
import { useAuthStore } from "@/store/useAuthStore";
import { useProStore } from "@/store/useProStore";

const BATCH_LIMIT_FREE = 1;
const PROGRESS_INTERVAL_MS = 300;
const PROGRESS_CAP = 90;

function getBatchLimit(isPro: boolean): number {
  return isPro ? 20 : BATCH_LIMIT_FREE;
}

function isWavFile(file: File): boolean {
  const t = file.type?.toLowerCase() ?? "";
  const n = file.name?.toLowerCase() ?? "";
  return (
    n.endsWith(".wav") ||
    t === "audio/wav" ||
    t === "audio/wave" ||
    t === "audio/x-wav"
  );
}

type Props = { toolSlug?: string };

export function WavToMp3Converter({ toolSlug = "wav-to-mp3" }: Props) {
  const isPro = useAuthStore((s) => s.isPro);
  const addHistory = useProStore((s) => s.addHistory);
  const incrementProtected = useProStore((s) => s.incrementProtected);
  const batchLimit = getBatchLimit(isPro);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<{ name: string; blob: Blob }[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const dropZoneRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startSimulatedProgress = useCallback(() => {
    clearProgressInterval();
    setConversionProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setConversionProgress((p) => {
        if (p >= PROGRESS_CAP) {
          clearProgressInterval();
          return PROGRESS_CAP;
        }
        return Math.min(PROGRESS_CAP, p + 8 + Math.floor(Math.random() * 12));
      });
    }, PROGRESS_INTERVAL_MS);
  }, [clearProgressInterval]);

  const getOrCreateWorker = useCallback((): Worker => {
    if (workerRef.current) return workerRef.current;
    const blob = new Blob([WAV_MP3_WORKER_CODE], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    workerRef.current = new Worker(url);
    URL.revokeObjectURL(url);
    return workerRef.current;
  }, []);

  const convertOneFile = useCallback(
    (file: File): Promise<Blob> =>
      new Promise((resolve, reject) => {
        const worker = getOrCreateWorker();
        const onMessage = (e: MessageEvent) => {
          worker.removeEventListener("message", onMessage);
          worker.removeEventListener("error", onError);
          const { ok, blob, error: msg } = e.data ?? {};
          if (ok && blob) resolve(blob);
          else reject(new Error(msg || "Conversion failed"));
        };
        const onError = () => {
          worker.removeEventListener("message", onMessage);
          worker.removeEventListener("error", onError);
          reject(new Error("Worker error"));
        };
        worker.addEventListener("message", onMessage);
        worker.addEventListener("error", onError);
        file.arrayBuffer().then((buf) => worker.postMessage(buf));
      }),
    [getOrCreateWorker]
  );

  const handleFile = useCallback(
    (files: FileList | File[] | null) => {
      if (!files?.length) return;
      const list = Array.from(files);
      const valid = list.filter(isWavFile);
      if (valid.length === 0) {
        setError("Please select WAV files.");
        return;
      }
      const limited = valid.slice(0, batchLimit);
      if (valid.length > batchLimit) {
        setError(`Max ${batchLimit} file(s). Upgrade to Pro for more.`);
      } else {
        setError(null);
      }
      setSelectedFiles(limited);
      setResults([]);
    },
    [batchLimit]
  );

  const handleConvert = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    setIsConverting(true);
    setError(null);
    setResults([]);
    setConversionProgress(0);
    startSimulatedProgress();

    try {
      const outputs: { name: string; blob: Blob }[] = [];
      const total = selectedFiles.length;
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const blob = await convertOneFile(file);
        const name = file.name.replace(/\.wav$/i, ".mp3");
        outputs.push({ name, blob });
        setConversionProgress(Math.round(((i + 1) / total) * PROGRESS_CAP));
      }
      clearProgressInterval();
      setConversionProgress(100);
      setResults(outputs);
      if (outputs.length > 0) incrementProtected(outputs.length);
      if (isPro && outputs.length > 0) addHistory(toolSlug, outputs.length);
    } catch (e) {
      clearProgressInterval();
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setIsConverting(false);
    }
  }, [
    selectedFiles,
    convertOneFile,
    startSimulatedProgress,
    clearProgressInterval,
    isPro,
    addHistory,
    incrementProtected,
    toolSlug,
  ]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFile(e.dataTransfer.files);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const related = e.relatedTarget as Node | null;
    if (dropZoneRef.current && related && !dropZoneRef.current.contains(related)) {
      setIsDragOver(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFile(e.target.files);
      e.target.value = "";
    },
    [handleFile]
  );

  const download = useCallback((name: string, blob: Blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }, []);

  const canConvert = selectedFiles.length > 0 && !isConverting;

  return (
    <div className="space-y-4">
      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-xl border-2 border-dashed p-4 sm:p-6 md:p-8 text-center transition-colors min-h-[140px] sm:min-h-[160px] flex flex-col items-center justify-center touch-manipulation select-none ${
          isDragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        } ${isConverting ? "pointer-events-none opacity-70" : ""}`}
      >
        <input
          type="file"
          accept=".wav,audio/wav,audio/wave,audio/x-wav"
          multiple={batchLimit > 1}
          onChange={handleInputChange}
          disabled={isConverting}
          className="hidden"
          id="wav-mp3-file-input"
          aria-label="Select WAV files"
        />
        <label
          htmlFor="wav-mp3-file-input"
          className="cursor-pointer flex flex-col items-center w-full"
        >
          <Music className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} file(s) selected`
              : "Drop WAV files here or click to select"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isPro ? `Pro: up to ${batchLimit} files.` : `Free: max ${BATCH_LIMIT_FREE} file.`}
          </p>
        </label>
        {selectedFiles.length > 0 && !isConverting && (
          <Button
            type="button"
            onClick={handleConvert}
            className="mt-3 min-h-[44px] min-w-[44px] sm:min-w-0"
          >
            Convert to MP3
          </Button>
        )}
      </div>

      {isConverting && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${conversionProgress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Converting… {conversionProgress}%
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
        <ConversionResult results={results} type="audio" onDownload={download} />
      )}
    </div>
  );
}
