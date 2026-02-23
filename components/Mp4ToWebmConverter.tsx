"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { fetchFile } from "@ffmpeg/util";
import { Loader2, Download, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { getIsPro } from "@/lib/pro";

const BATCH_LIMIT_FREE = 1;

function getBatchLimit(): number {
  return getIsPro() ? 999 : BATCH_LIMIT_FREE;
}

export function Mp4ToWebmConverter() {
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
      const limit = getBatchLimit();
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
          const inName = `input_${i}.mp4`;
          const outName = `output_${i}.webm`;
          const data = await fetchFile(file);
          await ffmpeg.writeFile(inName, data);
          await ffmpeg.exec(["-i", inName, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libopus", outName]);
          const outData = await ffmpeg.readFile(outName);
          await ffmpeg.deleteFile(inName);
          await ffmpeg.deleteFile(outName);
          outputs.push({
            name: file.name.replace(/\.mp4$/i, ".webm"),
            blob: new Blob([outData as BlobPart], { type: "video/webm" }),
          });
        }
        ffmpeg.off("progress", onProgress);
        setResults(outputs);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Conversion failed");
      } finally {
        setConverting(false);
        setProgress(0);
      }
    },
    [loaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/mp4": [".mp4"] },
    maxFiles: getBatchLimit(),
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
        <Button onClick={onLoad} className="mt-4" disabled={loading}>
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
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        } ${converting ? "pointer-events-none opacity-70" : ""}`}
      >
        <input {...getInputProps()} />
        <Video className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {converting ? "Converting..." : "Drop MP4 files here, or click to select"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Free: max {BATCH_LIMIT_FREE} file. Pro: unlimited.
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
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Download</p>
          <div className="flex flex-wrap gap-2">
            {results.map((r) => (
              <Button
                key={r.name}
                variant="outline"
                size="sm"
                onClick={() => download(r.name, r.blob)}
              >
                <Download className="h-4 w-4" />
                {r.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
