"use client";

import { AvifToPngConverter } from "@/components/AvifToPngConverter";
import { WavToMp3Converter } from "@/components/WavToMp3Converter";
import { WebpToPngConverter } from "@/components/WebpToPngConverter";
import { Mp4ToWebmConverter } from "@/components/Mp4ToWebmConverter";
import { PngToJpegConverter } from "@/components/PngToJpegConverter";
import { OggToMp3Converter } from "@/components/OggToMp3Converter";
import { GifToMp4Converter } from "@/components/GifToMp4Converter";
import { PdfToImagesConverter } from "@/components/PdfToImagesConverter";

type ConversionUIProps = { slug: string };

/**
 * Shared conversion UI: picks the right converter by tool slug.
 * Used by all tool pages under /convert/[slug].
 * Free: single file; Pro: batch + large files.
 */
export function ConversionUI({ slug }: ConversionUIProps) {
  switch (slug) {
    case "avif-to-png":
      return <AvifToPngConverter />;
    case "wav-to-mp3":
      return <WavToMp3Converter />;
    case "webp-to-png":
      return <WebpToPngConverter />;
    case "mp4-to-webm":
      return <Mp4ToWebmConverter />;
    case "png-to-jpeg":
      return <PngToJpegConverter />;
    case "ogg-to-mp3":
      return <OggToMp3Converter />;
    case "gif-to-mp4":
      return <GifToMp4Converter />;
    case "pdf-to-images":
      return <PdfToImagesConverter />;
    default:
      return (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          This converter is not yet available. <a href="/tools" className="underline">Browse all tools</a>.
        </div>
      );
  }
}
