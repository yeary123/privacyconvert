import type { Metadata } from "next";
import { WavToMp3Converter } from "@/components/WavToMp3Converter";
import { ConvertPageLayout } from "@/components/ConvertPageLayout";
import { getConvertMetadata } from "@/lib/convertMetadata";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "wav-to-mp3";
const TOOL_NAME = "WAV to MP3";
const DESCRIPTION =
  "Convert WAV to MP3 in your browser. Choose bitrate 96–320 kbps. No upload 2026, privacy first file converter. 100% client-side, completely local.";

const TOOL = { name: TOOL_NAME, description: DESCRIPTION, slug: TOOL_SLUG };

const meta = getConvertMetadata(TOOL_NAME);
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: meta.openGraph,
};

const WAV_FAQ = [
  {
    q: "Is WAV to MP3 conversion done locally?",
    a: "Yes. Encoding runs in a Web Worker in your browser (LAME-based encoder). Your audio never leaves your device. No upload, zero privacy risk. 2026.",
  },
  {
    q: "What MP3 quality or bitrate can I choose?",
    a: "You can choose 96, 128, 192, 256, or 320 kbps (CBR). 128 kbps is the default for compatibility and smaller files; 192–320 kbps for higher quality or music. All encoding runs in your browser.",
  },
  {
    q: "What bitrate should I choose for WAV to MP3?",
    a: "Use 128 kbps for speech or small files; 192 kbps for a good balance; 256 or 320 kbps for music or archival. Higher bitrate means larger MP3 files.",
  },
  {
    q: "Can I convert multiple WAV files at once?",
    a: "Free users can convert one file at a time. Pro users get batch conversion (multiple files). All conversion remains 100% in your browser.",
  },
  {
    q: "Do you store or upload my WAV files?",
    a: "No. All conversion happens in your browser. We do not store, upload, or have access to your files.",
  },
  {
    q: "Why convert WAV to MP3?",
    a: "WAV is uncompressed and large; MP3 is compressed and widely supported. Converting saves space and keeps compatibility with players, phones, and car stereos.",
  },
  {
    q: "Privacy comparison with cloud converters?",
    a: "Cloud converters (e.g. Convertio) upload your WAV to their servers. PrivacyConvert keeps everything browser local — same no-upload approach as VERT.sh and localconvert. 2026.",
  },
  {
    q: "What browsers work?",
    a: "Modern Chrome, Firefox, Edge, and Safari. The encoder runs in a Web Worker; no large upfront download.",
  },
  {
    q: "Is it free?",
    a: "Yes. Single-file conversion is free. Pro adds batch; core conversion stays 100% local for everyone.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Choose MP3 bitrate (optional)",
    text: "Select 96, 128, 192, 256, or 320 kbps. Default is 128 kbps for compatibility; use 192–320 for higher quality.",
  },
  {
    name: "Select or drop WAV files",
    text: "Drag and drop WAV files or click the area to select. Free: 1 file; Pro: multiple files.",
  },
  {
    name: "Click Convert to MP3",
    text: "The encoder runs in a Web Worker in your browser. Progress is shown. No upload.",
  },
  {
    name: "Download",
    text: "Download each MP3. Your audio never leaves your device.",
  },
];

export default async function WavToMp3Page() {
  const seoContent = getConvertSeoContent(TOOL_SLUG);
  return (
    <ConvertPageLayout
      tool={TOOL}
      converter={<WavToMp3Converter toolSlug={TOOL_SLUG} />}
      faq={WAV_FAQ}
      faqTitle={`${TOOL_NAME} FAQ`}
      howToSteps={HOWTO_STEPS}
      seoContent={seoContent ?? undefined}
    />
  );
}
