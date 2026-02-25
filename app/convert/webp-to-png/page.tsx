import type { Metadata } from "next";
import { WebpToPngConverter } from "@/components/WebpToPngConverter";
import { ConvertPageLayout } from "@/components/ConvertPageLayout";
import { getConvertMetadata } from "@/lib/convertMetadata";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "webp-to-png";
const TOOL_NAME = "WebP to PNG";
const DESCRIPTION =
  "Convert WebP to PNG in your browser. No upload 2026, privacy first file converter. 100% client-side, completely local.";

const TOOL = { name: TOOL_NAME, description: DESCRIPTION, slug: TOOL_SLUG };

const meta = getConvertMetadata(TOOL_NAME);
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: meta.openGraph,
};

const WEBP_FAQ = [
  {
    q: "Is WebP to PNG conversion done locally?",
    a: "Yes. FFmpeg runs in your browser via WebAssembly. Your WebP files never leave your device. No upload, zero privacy risk. 2026.",
  },
  {
    q: "Why convert WebP to PNG?",
    a: "WebP is great for web use; PNG is lossless and has broader support in older apps, editors, and print. Converting locally keeps your images private.",
  },
  {
    q: "Free vs Pro limits?",
    a: "Free: one file at a time. Pro: unlimited batch conversion. All conversion remains 100% in your browser.",
  },
  {
    q: "Do you store my images?",
    a: "No. We have no access to your files. Conversion is entirely client-side; nothing is sent to our servers.",
  },
  {
    q: "How does this compare to cloud tools like Convertio?",
    a: "Cloud converters upload your WebP to their servers. PrivacyConvert keeps everything browser local — same no-upload approach as VERT.sh and localconvert. 2026.",
  },
  {
    q: "What file sizes work best?",
    a: "Device memory limits apply. We recommend images under 50MB for smooth in-browser conversion.",
  },
  {
    q: "What browsers are supported?",
    a: "Modern Chrome, Firefox, Edge, Safari with WebAssembly. FFmpeg loads once and is cached.",
  },
  {
    q: "Is conversion free?",
    a: "Yes. Single-file conversion is free. Pro adds batch; core conversion stays local for everyone.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Load FFmpeg",
    text: "Click 'Load FFmpeg' to load the converter in your browser (one-time, ~31 MB, cached).",
  },
  {
    name: "Add WebP files",
    text: "Drag and drop WebP files or click to select. Free: 1 file; Pro: unlimited batch.",
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

export default async function WebpToPngPage() {
  const seoContent = getConvertSeoContent(TOOL_SLUG);
  return (
    <ConvertPageLayout
      tool={TOOL}
      converter={<WebpToPngConverter toolSlug={TOOL_SLUG} />}
      faq={WEBP_FAQ}
      faqTitle={`${TOOL_NAME} FAQ`}
      howToSteps={HOWTO_STEPS}
      seoContent={seoContent ?? undefined}
    />
  );
}
