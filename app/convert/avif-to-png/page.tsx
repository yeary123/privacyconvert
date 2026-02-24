import type { Metadata } from "next";
import { AvifToPngConverter } from "@/components/AvifToPngConverter";
import { ConvertPageLayout } from "@/components/ConvertPageLayout";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "avif-to-png";
const TOOL_NAME = "AVIF to PNG";
const DESCRIPTION =
  "Convert AVIF to PNG in your browser. No upload 2026, privacy first file converter. 100% client-side, completely local.";

const TOOL = { name: TOOL_NAME, description: DESCRIPTION, slug: TOOL_SLUG };

export const metadata: Metadata = {
  title: `${TOOL_NAME} No Upload – 100% Local Browser Converter 2026`,
  description: `${DESCRIPTION}. No upload, browser local conversion. Zero privacy risk.`,
  openGraph: {
    title: `${TOOL_NAME} – No Upload 2026 | PrivacyConvert`,
    description: DESCRIPTION,
  },
};

const AVIF_FAQ = [
  {
    q: "Is AVIF to PNG conversion done on my device?",
    a: "Yes. PrivacyConvert runs FFmpeg entirely in your browser (WebAssembly). Your AVIF files never leave your computer. No upload, no server, zero privacy risk. 2026.",
  },
  {
    q: "What is the max file size or batch limit?",
    a: "Free users can convert one file at a time. Pro users get unlimited batch conversion. File size is limited by your device memory; we recommend files under 50MB for smooth conversion.",
  },
  {
    q: "Why convert AVIF to PNG?",
    a: "AVIF offers better compression; PNG is lossless and widely supported. Converting to PNG helps compatibility with older software, print workflows, or when you need a lossless raster format.",
  },
  {
    q: "Do you keep or store my files?",
    a: "No. We do not have access to your files. Conversion happens locally in your browser. We do not store, log, or transmit your data.",
  },
  {
    q: "How does this compare to cloud converters like Convertio?",
    a: "Cloud tools (e.g. Convertio) upload your AVIF to their servers. PrivacyConvert keeps everything browser local — same no-upload approach as VERT.sh and localconvert. 2026.",
  },
  {
    q: "What browsers are supported?",
    a: "Modern Chrome, Firefox, Edge, and Safari with WebAssembly. FFmpeg loads once (~31 MB) and is cached for future use.",
  },
  {
    q: "Is conversion really free?",
    a: "Yes. Single-file conversion is free with no account. Pro adds batch and P2P transfer. Core conversion stays 100% local for everyone.",
  },
  {
    q: "Can I convert multiple AVIF files at once?",
    a: "Free users: one file at a time. Pro users: unlimited batch. All processing remains in your browser, completely local.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Load FFmpeg",
    text: "Click 'Load FFmpeg' to load the converter in your browser (one-time, ~31 MB, cached).",
  },
  {
    name: "Add files",
    text: "Drag and drop AVIF files or click to select. Free: 1 file; Pro: unlimited batch.",
  },
  {
    name: "Convert",
    text: "Conversion runs locally in the browser. Progress is shown. No upload.",
  },
  {
    name: "Download",
    text: "Download each PNG from the results. Files never leave your device.",
  },
];

export default async function AvifToPngPage() {
  const seoContent = getConvertSeoContent(TOOL_SLUG);
  return (
    <ConvertPageLayout
      tool={TOOL}
      converter={<AvifToPngConverter toolSlug={TOOL_SLUG} />}
      faq={AVIF_FAQ}
      faqTitle={`${TOOL_NAME} FAQ`}
      howToSteps={HOWTO_STEPS}
      seoContent={seoContent ?? undefined}
    />
  );
}
