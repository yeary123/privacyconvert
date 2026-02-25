"use client";

import { HeifToJpgConverter } from "@/components/HeifToJpgConverter";
import { PdfToImagesConverter } from "@/components/PdfToImagesConverter";
import { ImagesToPdfConverter } from "@/components/ImagesToPdfConverter";
import { HtmlToPdfConverter } from "@/components/HtmlToPdfConverter";
import { MergePdfsConverter } from "@/components/MergePdfsConverter";
import { SplitPdfConverter } from "@/components/SplitPdfConverter";
import { DocxToHtmlConverter } from "@/components/DocxToHtmlConverter";
import { TextToDocxConverter } from "@/components/TextToDocxConverter";
import { EpubToMobiConverter } from "@/components/EpubToMobiConverter";
import { MobiToEpubConverter } from "@/components/MobiToEpubConverter";
import { PdfToDocxConverter } from "@/components/PdfToDocxConverter";
import { PdfToEpubConverter } from "@/components/PdfToEpubConverter";
import { LengthConverter } from "@/components/LengthConverter";
import { LengthPairConverter } from "@/components/LengthPairConverter";
import { WeightConverter } from "@/components/WeightConverter";
import { WeightPairConverter } from "@/components/WeightPairConverter";
import { TemperatureConverter } from "@/components/TemperatureConverter";
import { TemperaturePairConverter } from "@/components/TemperaturePairConverter";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { DataStorageConverter } from "@/components/DataStorageConverter";
import { TimeConverter } from "@/components/TimeConverter";
import { CookingUnitsConverter } from "@/components/CookingUnitsConverter";
import { AreaConverter } from "@/components/AreaConverter";
import { AreaPairConverter } from "@/components/AreaPairConverter";
import { VolumeConverter } from "@/components/VolumeConverter";
import { VolumePairConverter } from "@/components/VolumePairConverter";
import { SpeedConverter } from "@/components/SpeedConverter";
import { SpeedPairConverter } from "@/components/SpeedPairConverter";
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
  if (slug === "html-to-pdf") {
    return <HtmlToPdfConverter toolSlug="html-to-pdf" />;
  }
  if (slug === "merge-pdfs") {
    return <MergePdfsConverter toolSlug="merge-pdfs" />;
  }
  if (slug === "split-pdf") {
    return <SplitPdfConverter toolSlug="split-pdf" />;
  }
  if (slug === "docx-to-html") {
    return <DocxToHtmlConverter toolSlug="docx-to-html" />;
  }
  if (slug === "text-to-docx") {
    return <TextToDocxConverter toolSlug="text-to-docx" />;
  }
  if (slug === "epub-to-mobi") {
    return <EpubToMobiConverter toolSlug="epub-to-mobi" />;
  }
  if (slug === "mobi-to-epub") {
    return <MobiToEpubConverter toolSlug="mobi-to-epub" />;
  }
  if (slug === "pdf-to-docx") {
    return <PdfToDocxConverter toolSlug="pdf-to-docx" />;
  }
  if (slug === "pdf-to-epub") {
    return <PdfToEpubConverter toolSlug="pdf-to-epub" />;
  }
  if (slug === "length-converter") {
    return <LengthConverter />;
  }
  if (slug === "miles-to-km" || slug === "feet-to-meters" || slug === "inches-to-cm" || slug === "nautical-miles-to-km") {
    return <LengthPairConverter toolSlug={slug} />;
  }
  if (slug === "weight-converter") {
    return <WeightConverter />;
  }
  if (slug === "pounds-to-kg" || slug === "ounces-to-grams" || slug === "stone-to-kg" || slug === "jin-to-kg") {
    return <WeightPairConverter toolSlug={slug} />;
  }
  if (slug === "temperature-converter") {
    return <TemperatureConverter />;
  }
  if (slug === "fahrenheit-to-celsius" || slug === "fahrenheit-to-kelvin" || slug === "celsius-to-kelvin") {
    return <TemperaturePairConverter toolSlug={slug} />;
  }
  if (slug === "currency-converter") {
    return <CurrencyConverter />;
  }
  if (slug === "data-storage-converter") {
    return <DataStorageConverter />;
  }
  if (slug === "time-converter") {
    return <TimeConverter />;
  }
  if (slug === "cooking-units-converter") {
    return <CookingUnitsConverter />;
  }
  if (slug === "area-converter") {
    return <AreaConverter />;
  }
  if (slug === "sqft-to-sqm" || slug === "acres-to-hectares" || slug === "sqmi-to-sqkm") {
    return <AreaPairConverter toolSlug={slug} />;
  }
  if (slug === "volume-converter") {
    return <VolumeConverter />;
  }
  if (slug === "gallons-to-liters" || slug === "pints-to-ml" || slug === "cubic-feet-to-cubic-meters") {
    return <VolumePairConverter toolSlug={slug} />;
  }
  if (slug === "speed-converter") {
    return <SpeedConverter />;
  }
  if (slug === "mph-to-kmh" || slug === "knots-to-kmh" || slug === "mach-to-kmh") {
    return <SpeedPairConverter toolSlug={slug} />;
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
