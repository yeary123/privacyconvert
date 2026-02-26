"use client";

import {
  LazyHeifToJpgConverter,
  LazyPdfToImagesConverter,
  LazyImagesToPdfConverter,
  LazyHtmlToPdfConverter,
  LazyMergePdfsConverter,
  LazySplitPdfConverter,
  LazyDocxToHtmlConverter,
  LazyTextToDocxConverter,
  LazyMobiToEpubConverter,
  LazyPdfToDocxConverter,
  LazyPdfToEpubConverter,
  LazyLengthConverter,
  LazyLengthPairConverter,
  LazyWeightConverter,
  LazyWeightPairConverter,
  LazyTemperatureConverter,
  LazyTemperaturePairConverter,
  LazyCurrencyConverter,
  LazyCurrencyPairConverter,
  LazyDataStorageConverter,
  LazyTimeConverter,
  LazyCookingUnitsConverter,
  LazyAreaConverter,
  LazyAreaPairConverter,
  LazyVolumeConverter,
  LazyVolumePairConverter,
  LazySpeedConverter,
  LazySpeedPairConverter,
  LazyBaseConverter,
  LazyBasePairConverter,
  LazyGenericConverter,
} from "@/components/lazyConverters";
import { isCurrencyPairSlug } from "@/lib/currencyPairs";
import { isBasePairSlug } from "@/lib/baseConverter";
import { hasConvertHandler } from "@/lib/conversion";
import type { ToolSlug } from "@/lib/tools";

type ConversionUIProps = { slug: string };

/**
 * Shared conversion UI: picks the right converter by tool slug.
 * Converters are loaded on demand (dynamic import) to keep initial chunk small.
 */
export function ConversionUI({ slug }: ConversionUIProps) {
  if (slug === "heif-to-jpg" || slug === "heif-to-png" || slug === "heif-to-gif") {
    return <LazyHeifToJpgConverter toolSlug={slug} />;
  }
  if (slug === "pdf-to-images") {
    return <LazyPdfToImagesConverter toolSlug="pdf-to-images" />;
  }
  if (slug === "images-to-pdf") {
    return <LazyImagesToPdfConverter toolSlug="images-to-pdf" />;
  }
  if (slug === "html-to-pdf") {
    return <LazyHtmlToPdfConverter toolSlug="html-to-pdf" />;
  }
  if (slug === "merge-pdfs") {
    return <LazyMergePdfsConverter toolSlug="merge-pdfs" />;
  }
  if (slug === "split-pdf") {
    return <LazySplitPdfConverter toolSlug="split-pdf" />;
  }
  if (slug === "docx-to-html") {
    return <LazyDocxToHtmlConverter toolSlug="docx-to-html" />;
  }
  if (slug === "text-to-docx") {
    return <LazyTextToDocxConverter toolSlug="text-to-docx" />;
  }
  if (slug === "mobi-to-epub") {
    return <LazyMobiToEpubConverter toolSlug="mobi-to-epub" />;
  }
  if (slug === "pdf-to-docx") {
    return <LazyPdfToDocxConverter toolSlug="pdf-to-docx" />;
  }
  if (slug === "pdf-to-epub") {
    return <LazyPdfToEpubConverter toolSlug="pdf-to-epub" />;
  }
  if (slug === "length-converter") {
    return <LazyLengthConverter />;
  }
  if (slug === "miles-to-km" || slug === "feet-to-meters" || slug === "inches-to-cm" || slug === "nautical-miles-to-km") {
    return <LazyLengthPairConverter toolSlug={slug} />;
  }
  if (slug === "weight-converter") {
    return <LazyWeightConverter />;
  }
  if (slug === "pounds-to-kg" || slug === "ounces-to-grams" || slug === "stone-to-kg" || slug === "jin-to-kg") {
    return <LazyWeightPairConverter toolSlug={slug} />;
  }
  if (slug === "temperature-converter") {
    return <LazyTemperatureConverter />;
  }
  if (slug === "fahrenheit-to-celsius" || slug === "fahrenheit-to-kelvin" || slug === "celsius-to-kelvin") {
    return <LazyTemperaturePairConverter toolSlug={slug} />;
  }
  if (isCurrencyPairSlug(slug)) {
    return <LazyCurrencyPairConverter toolSlug={slug} />;
  }
  if (slug === "currency-converter") {
    return <LazyCurrencyConverter />;
  }
  if (slug === "data-storage-converter") {
    return <LazyDataStorageConverter />;
  }
  if (slug === "time-converter") {
    return <LazyTimeConverter />;
  }
  if (slug === "cooking-units-converter") {
    return <LazyCookingUnitsConverter />;
  }
  if (slug === "area-converter") {
    return <LazyAreaConverter />;
  }
  if (slug === "sqft-to-sqm" || slug === "acres-to-hectares" || slug === "sqmi-to-sqkm") {
    return <LazyAreaPairConverter toolSlug={slug} />;
  }
  if (slug === "volume-converter") {
    return <LazyVolumeConverter />;
  }
  if (slug === "gallons-to-liters" || slug === "pints-to-ml" || slug === "cubic-feet-to-cubic-meters") {
    return <LazyVolumePairConverter toolSlug={slug} />;
  }
  if (slug === "speed-converter") {
    return <LazySpeedConverter />;
  }
  if (slug === "mph-to-kmh" || slug === "knots-to-kmh" || slug === "mach-to-kmh") {
    return <LazySpeedPairConverter toolSlug={slug} />;
  }
  if (slug === "base-converter") {
    return <LazyBaseConverter />;
  }
  if (isBasePairSlug(slug)) {
    return <LazyBasePairConverter toolSlug={slug} />;
  }
  if (hasConvertHandler(slug as ToolSlug)) {
    return <LazyGenericConverter toolSlug={slug as ToolSlug} />;
  }
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
      This converter is not yet available. <a href="/tools" className="underline">Browse all tools</a>.
    </div>
  );
}
