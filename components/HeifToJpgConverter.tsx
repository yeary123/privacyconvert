"use client";

import { useCallback, useRef, useState } from "react";
import { Download, FileImage, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  convertHeicTo,
  isHeicFile,
  DEFAULT_QUALITY,
} from "@/lib/conversion";
import type { HeicOutputType } from "@/lib/heicConversion";
import { useAuthStore } from "@/store/useAuthStore";

const PROGRESS_INTERVAL_MS = 300;
const PROGRESS_CAP = 85;

type ConvertedImage = { name: string; dataUrl: string };

type Props = { toolSlug?: string };

const SLUG_TO_TYPE: Record<string, HeicOutputType> = {
  "heif-to-jpg": "image/jpeg",
  "heif-to-png": "image/png",
  "heif-to-gif": "image/gif",
};
const SLUG_TO_LABEL: Record<string, string> = {
  "heif-to-jpg": "JPG",
  "heif-to-png": "PNG",
  "heif-to-gif": "GIF",
};

export function HeifToJpgConverter({ toolSlug = "heif-to-jpg" }: Props) {
  const isPro = useAuthStore((s) => s.isPro);
  const toType = SLUG_TO_TYPE[toolSlug] ?? "image/jpeg";
  const outputLabel = SLUG_TO_LABEL[toolSlug] ?? "JPG";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        return Math.min(PROGRESS_CAP, p + 10 + Math.floor(Math.random() * 15));
      });
    }, PROGRESS_INTERVAL_MS);
  }, [clearProgressInterval]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (!isHeicFile(file)) {
        setError("Please select a HEIC or HEIF file.");
        return;
      }
      setError(null);
      setSelectedFile(file);
      setConvertedImages([]);
    },
    []
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

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isHeicFile(file)) {
      setError("Please select a HEIC or HEIF file.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    setConvertedImages([]);
    e.target.value = "";
  }, []);

  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;
    setIsConverting(true);
    setError(null);
    setConvertedImages([]);
    setConversionProgress(0);
    startSimulatedProgress();

    try {
      const items = await convertHeicTo(
        selectedFile,
        selectedFile.name,
        toType,
        DEFAULT_QUALITY
      );
      clearProgressInterval();
      setConversionProgress(95);
      requestAnimationFrame(() => setConversionProgress(100));
      setConvertedImages(items);
    } catch (e) {
      clearProgressInterval();
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setIsConverting(false);
    }
  }, [selectedFile, toType, startSimulatedProgress, clearProgressInterval]);

  const handleDownload = useCallback((name: string, dataUrl: string) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = dataUrl;
    link.click();
  }, []);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setConvertedImages([]);
    setError(null);
    setConversionProgress(0);
    clearProgressInterval();
  }, [clearProgressInterval]);

  const firstImage = convertedImages[0];

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
          accept=".heic,.heif,image/heic,image/heif"
          onChange={handleFileSelect}
          disabled={isConverting}
          className="hidden"
          id="heif-file-input"
          aria-label="Select HEIC or HEIF file"
        />
        <label htmlFor="heif-file-input" className="cursor-pointer flex flex-col items-center w-full">
          <FileImage className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedFile
              ? selectedFile.name
              : "Drop HEIC/HEIF here or click to select"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isPro ? "Pro active — batch & more unlocked" : "Free: 1 file at a time. Unlock batch, history & P2P with Pro."}
          </p>
        </label>
        {selectedFile && !isConverting && (
          <div className="mt-3 flex gap-2 flex-wrap justify-center">
            <Button
              type="button"
              onClick={handleConvert}
              className="min-h-[44px] min-w-[44px] sm:min-w-0"
            >
              Convert to {outputLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="min-h-[44px] min-w-[44px] sm:min-w-0"
            >
              Clear
            </Button>
          </div>
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

      {convertedImages.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium">Preview &amp; Download</p>
          <div className="rounded-lg border border-border bg-muted/30 overflow-hidden">
            {firstImage && (
              <img
                src={firstImage.dataUrl}
                alt={firstImage.name}
                className="max-h-48 w-full object-contain bg-background"
              />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {convertedImages.map((img) => (
              <Button
                key={img.name}
                variant="outline"
                size="sm"
                onClick={() => handleDownload(img.name, img.dataUrl)}
              >
                <Download className="h-4 w-4" />
                {img.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
