"use client";

import dynamic from "next/dynamic";
import { ConverterLoading } from "@/components/ConverterLoading";

const loading = () => <ConverterLoading />;

export const LazyHeifToJpgConverter = dynamic(
  () => import("@/components/HeifToJpgConverter").then((m) => ({ default: m.HeifToJpgConverter })),
  { loading }
);
export const LazyPdfToImagesConverter = dynamic(
  () => import("@/components/PdfToImagesConverter").then((m) => ({ default: m.PdfToImagesConverter })),
  { loading }
);
export const LazyImagesToPdfConverter = dynamic(
  () => import("@/components/ImagesToPdfConverter").then((m) => ({ default: m.ImagesToPdfConverter })),
  { loading }
);
export const LazyHtmlToPdfConverter = dynamic(
  () => import("@/components/HtmlToPdfConverter").then((m) => ({ default: m.HtmlToPdfConverter })),
  { loading }
);
export const LazyMergePdfsConverter = dynamic(
  () => import("@/components/MergePdfsConverter").then((m) => ({ default: m.MergePdfsConverter })),
  { loading }
);
export const LazySplitPdfConverter = dynamic(
  () => import("@/components/SplitPdfConverter").then((m) => ({ default: m.SplitPdfConverter })),
  { loading }
);
export const LazyDocxToHtmlConverter = dynamic(
  () => import("@/components/DocxToHtmlConverter").then((m) => ({ default: m.DocxToHtmlConverter })),
  { loading }
);
export const LazyTextToDocxConverter = dynamic(
  () => import("@/components/TextToDocxConverter").then((m) => ({ default: m.TextToDocxConverter })),
  { loading }
);
export const LazyMobiToEpubConverter = dynamic(
  () => import("@/components/MobiToEpubConverter").then((m) => ({ default: m.MobiToEpubConverter })),
  { loading }
);
export const LazyPdfToDocxConverter = dynamic(
  () => import("@/components/PdfToDocxConverter").then((m) => ({ default: m.PdfToDocxConverter })),
  { loading }
);
export const LazyPdfToEpubConverter = dynamic(
  () => import("@/components/PdfToEpubConverter").then((m) => ({ default: m.PdfToEpubConverter })),
  { loading }
);
export const LazyLengthConverter = dynamic(
  () => import("@/components/LengthConverter").then((m) => ({ default: m.LengthConverter })),
  { loading }
);
export const LazyLengthPairConverter = dynamic(
  () => import("@/components/LengthPairConverter").then((m) => ({ default: m.LengthPairConverter })),
  { loading }
);
export const LazyWeightConverter = dynamic(
  () => import("@/components/WeightConverter").then((m) => ({ default: m.WeightConverter })),
  { loading }
);
export const LazyWeightPairConverter = dynamic(
  () => import("@/components/WeightPairConverter").then((m) => ({ default: m.WeightPairConverter })),
  { loading }
);
export const LazyTemperatureConverter = dynamic(
  () => import("@/components/TemperatureConverter").then((m) => ({ default: m.TemperatureConverter })),
  { loading }
);
export const LazyTemperaturePairConverter = dynamic(
  () => import("@/components/TemperaturePairConverter").then((m) => ({ default: m.TemperaturePairConverter })),
  { loading }
);
export const LazyCurrencyConverter = dynamic(
  () => import("@/components/CurrencyConverter").then((m) => ({ default: m.CurrencyConverter })),
  { loading }
);
export const LazyCurrencyPairConverter = dynamic(
  () => import("@/components/CurrencyPairConverter").then((m) => ({ default: m.CurrencyPairConverter })),
  { loading }
);
export const LazyDataStorageConverter = dynamic(
  () => import("@/components/DataStorageConverter").then((m) => ({ default: m.DataStorageConverter })),
  { loading }
);
export const LazyTimeConverter = dynamic(
  () => import("@/components/TimeConverter").then((m) => ({ default: m.TimeConverter })),
  { loading }
);
export const LazyCookingUnitsConverter = dynamic(
  () => import("@/components/CookingUnitsConverter").then((m) => ({ default: m.CookingUnitsConverter })),
  { loading }
);
export const LazyAreaConverter = dynamic(
  () => import("@/components/AreaConverter").then((m) => ({ default: m.AreaConverter })),
  { loading }
);
export const LazyAreaPairConverter = dynamic(
  () => import("@/components/AreaPairConverter").then((m) => ({ default: m.AreaPairConverter })),
  { loading }
);
export const LazyVolumeConverter = dynamic(
  () => import("@/components/VolumeConverter").then((m) => ({ default: m.VolumeConverter })),
  { loading }
);
export const LazyVolumePairConverter = dynamic(
  () => import("@/components/VolumePairConverter").then((m) => ({ default: m.VolumePairConverter })),
  { loading }
);
export const LazySpeedConverter = dynamic(
  () => import("@/components/SpeedConverter").then((m) => ({ default: m.SpeedConverter })),
  { loading }
);
export const LazySpeedPairConverter = dynamic(
  () => import("@/components/SpeedPairConverter").then((m) => ({ default: m.SpeedPairConverter })),
  { loading }
);
export const LazyKwKvaConverter = dynamic(
  () => import("@/components/KwKvaConverter").then((m) => ({ default: m.KwKvaConverter })),
  { loading }
);
export const LazyPantsSizeConverter = dynamic(
  () => import("@/components/PantsSizeConverter").then((m) => ({ default: m.PantsSizeConverter })),
  { loading }
);
export const LazyBaseConverter = dynamic(
  () => import("@/components/BaseConverter").then((m) => ({ default: m.BaseConverter })),
  { loading }
);
export const LazyRomanNumeralConverter = dynamic(
  () => import("@/components/RomanNumeralConverter").then((m) => ({ default: m.RomanNumeralConverter })),
  { loading }
);
export const LazyBasePairConverter = dynamic(
  () => import("@/components/BasePairConverter").then((m) => ({ default: m.BasePairConverter })),
  { loading }
);
export const LazyGenericConverter = dynamic(
  () => import("@/components/GenericConverter").then((m) => ({ default: m.GenericConverter })),
  { loading }
);
