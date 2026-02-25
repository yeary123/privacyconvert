"use client";

import { HeifToJpgConverter } from "@/components/HeifToJpgConverter";
import { PdfToImagesConverter } from "@/components/PdfToImagesConverter";
import { ImagesToPdfConverter } from "@/components/ImagesToPdfConverter";
import { GenericConverter } from "@/components/GenericConverter";
import { hasConvertHandler } from "@/lib/conversion";
import type { ToolSlug } from "@/lib/tools";

type ConversionUIProps = { slug: string };

/**
 * Shared conversion UI: picks the right converter by tool slug.
 * Used by all tool pages under /convert/[slug].
 * Free: single file; Pro: batch + large files.
 */
export function ConversionUI({ slug }: ConversionUIProps) {
  if (slug === "heif-to-jpg" || slug === "heif-to-png" || slug === "heif-to-gif") {
    return <HeifToJpgConverter toolSlug={slug} />;
  }
  if (slug === "pdf-to-images") {
    return <PdfToImagesConverter toolSlug="pdf-to-images" />;
  }
  if (slug === "images-to-pdf") {
    return <ImagesToPdfConverter toolSlug="images-to-pdf" />;
  }
  if (hasConvertHandler(slug as ToolSlug)) {
    return <GenericConverter toolSlug={slug as ToolSlug} />;
  }
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
      This converter is not yet available. <a href="/tools" className="underline">Browse all tools</a>.
    </div>
  );
}
