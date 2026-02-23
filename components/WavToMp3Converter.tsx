"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { fetchFile } from "@ffmpeg/util";
import { Loader2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversionResult } from "@/components/ConversionResult";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { useProStore } from "@/store/useProStore";

const BATCH_LIMIT_FREE = 1;

function getBatchLimit(isPro: boolean): number {
  return isPro ? 999 : BATCH_LIMIT_FREE;
}

type Props = { toolSlug?: string };

export function WavToMp3Converter({ toolSlug = "wav-to-mp3" }: Props) {
  const isPro = useProStore((s) => s.isPro);
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
        const ffmpeg = await loadFFmpeg();
        if (!ffmpeg) throw new Error("FFmpeg not loaded");
        const onProgress = (e: { progress?: number }) => setProgress(Math.round((e.progress ?? 0) * 100));
        ffmpeg.on("progress", onProgress);
        const outputs: { name: string; blob: Blob }[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const inName = `input_${i}.wav`;
          const outName = `output_${i}.mp3`;
          const data = await fetchFile(file);
          await ffmpeg.writeFile(inName, data);
          await ffmpeg.exec(["-i", inName, "-codec:a", "libmp3lame", "-q:a", "2", outName]);
          const outData = await ffmpeg.readFile(outName);
          await ffmpeg.deleteFile(inName);
          await ffmpeg.deleteFile(outName);
          outputs.push({
            name: file.name.replace(/\.wav$/i, ".mp3"),
            blob: new Blob([outData as BlobPart], { type: "audio/mpeg" }),
          });
        }
        ffmpeg.off("progress", onProgress);
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
    accept: { "audio/wav": [".wav"], "audio/wave": [".wav"], "audio/x-wav": [".wav"] },
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
        <input {...getInputProps()} aria-label="Drop or select WAV files" />
        <Music className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {converting ? "Converting..." : "Drop WAV files here, or click to select"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {isPro ? "Pro: unlimited batch." : `Free: max ${BATCH_LIMIT_FREE} file. Pro: unlimited.`}
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
        <ConversionResult results={results} type="audio" onDownload={download} />
      )}
    </div>
  );
}
