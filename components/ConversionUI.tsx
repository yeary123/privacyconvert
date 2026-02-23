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
      return <AvifToPngConverter toolSlug={slug} />;
    case "wav-to-mp3":
      return <WavToMp3Converter toolSlug={slug} />;
    case "webp-to-png":
      return <WebpToPngConverter toolSlug={slug} />;
    case "mp4-to-webm":
      return <Mp4ToWebmConverter toolSlug={slug} />;
    case "png-to-jpeg":
      return <PngToJpegConverter toolSlug={slug} />;
    case "ogg-to-mp3":
      return <OggToMp3Converter toolSlug={slug} />;
    case "gif-to-mp4":
      return <GifToMp4Converter toolSlug={slug} />;
    case "pdf-to-images":
      return <PdfToImagesConverter toolSlug="pdf-to-images" />;
    default:
      return (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          This converter is not yet available. <a href="/tools" className="underline">Browse all tools</a>.
        </div>
      );
  }
}
