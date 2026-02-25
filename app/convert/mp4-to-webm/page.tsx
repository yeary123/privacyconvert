import type { Metadata } from "next";
import { Mp4ToWebmConverter } from "@/components/Mp4ToWebmConverter";
import { ConvertPageLayout } from "@/components/ConvertPageLayout";
import { getConvertMetadata } from "@/lib/convertMetadata";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "mp4-to-webm";
const TOOL_NAME = "MP4 to WebM";
const DESCRIPTION =
  "Convert MP4 to WebM in your browser. No upload 2026, privacy first file converter. 100% client-side, completely local.";

const TOOL = { name: TOOL_NAME, description: DESCRIPTION, slug: TOOL_SLUG };

const meta = getConvertMetadata(TOOL_NAME);
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: meta.openGraph,
};

const MP4_FAQ = [
  {
    q: "Is MP4 to WebM conversion done in my browser?",
    a: "Yes. PrivacyConvert uses FFmpeg.wasm. Your video is processed locally; nothing is uploaded to our servers. No upload 2026.",
  },
  {
    q: "Why convert MP4 to WebM?",
    a: "WebM (VP9/Opus) is royalty-free and well-supported in browsers. Converting to WebM helps with web embedding and compatibility without sending video to the cloud.",
  },
  {
    q: "What quality does the WebM output have?",
    a: "We use VP9 with CRF 30 and Opus audio for a good balance of size and quality. Conversion runs entirely in your browser.",
  },
  {
    q: "Batch conversion and file size?",
    a: "Free: one file at a time. Pro: unlimited batch. Large files are limited by device memory; we recommend under 100MB for smooth conversion.",
  },
  {
    q: "Do you store or upload my video?",
    a: "No. All conversion happens in your browser. We do not store, upload, or have access to your files. Privacy-first 2026.",
  },
  {
    q: "How does this compare to cloud converters like Convertio?",
    a: "Cloud tools upload your MP4 to their servers. PrivacyConvert keeps everything browser local — same no-upload approach as VERT.sh and localconvert. 2026.",
  },
  {
    q: "What browsers are supported?",
    a: "Modern Chrome, Firefox, Edge, and Safari with WebAssembly support. FFmpeg loads once and is cached for future use.",
  },
  {
    q: "Is this really free?",
    a: "Yes. Single-file conversion is free with no account. Pro adds batch and P2P transfer. Core conversion stays 100% local for everyone.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Load FFmpeg",
    text: "Click 'Load FFmpeg' to load the converter in your browser (one-time, ~31 MB, cached).",
  },
  {
    name: "Add MP4 files",
    text: "Drag and drop MP4 files or click to select. Free: 1 file; Pro: unlimited batch.",
  },
  {
    name: "Convert",
    text: "Conversion runs locally in the browser (VP9/Opus). Progress is shown. No upload.",
  },
  {
    name: "Download",
    text: "Download each WebM. Your video never leaves your device.",
  },
];

export default async function Mp4ToWebmPage() {
  const seoContent = getConvertSeoContent(TOOL_SLUG);
  return (
    <ConvertPageLayout
      tool={TOOL}
      converter={<Mp4ToWebmConverter toolSlug={TOOL_SLUG} />}
      faq={MP4_FAQ}
      faqTitle={`${TOOL_NAME} FAQ`}
      howToSteps={HOWTO_STEPS}
      seoContent={seoContent ?? undefined}
    />
  );
}
