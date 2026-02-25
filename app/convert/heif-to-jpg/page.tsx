import type { Metadata } from "next";
import { HeifToJpgConverter } from "@/components/HeifToJpgConverter";
import { ConvertPageLayout } from "@/components/ConvertPageLayout";
import { getConvertMetadata } from "@/lib/convertMetadata";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "heif-to-jpg";
const TOOL_NAME = "HEIF/HEIC to JPG";
const DESCRIPTION =
  "Convert HEIF/HEIC to JPG in your browser. No upload 2026, privacy first. 100% client-side, completely local.";

const TOOL = { name: TOOL_NAME, description: DESCRIPTION, slug: TOOL_SLUG };

const meta = getConvertMetadata(TOOL_NAME);
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: meta.openGraph,
};

const FAQ = [
  {
    q: "Is HEIF/HEIC to JPG conversion done locally?",
    a: "Yes. The conversion runs in your browser using a lightweight library loaded on demand. Your HEIC/HEIF files never leave your device. No upload, zero privacy risk. 2026.",
  },
  {
    q: "Why convert HEIC to JPG?",
    a: "HEIC is used by Apple devices and offers good compression; JPG is universally supported. Converting to JPG helps compatibility with Windows, Android, and older software. Doing it locally keeps your photos private.",
  },
  {
    q: "Do I need to load FFmpeg or anything first?",
    a: "No. The HEIC converter loads its library only when you click Convert, so the page stays fast. No large upfront download.",
  },
  {
    q: "Do you store or upload my images?",
    a: "No. We have no access to your files. Conversion is entirely client-side; nothing is sent to our servers.",
  },
  {
    q: "What if my HEIC has multiple images?",
    a: "Some HEIC files contain multiple images (e.g. Live Photo). The tool converts all and lets you download each as a separate JPG.",
  },
  {
    q: "How does this compare to cloud converters?",
    a: "Cloud tools upload your HEIC to their servers. PrivacyConvert keeps everything in your browser — same no-upload approach as VERT.sh and localconvert. 2026.",
  },
  {
    q: "What browsers are supported?",
    a: "Modern Chrome, Firefox, Edge, and Safari. The converter uses standard browser APIs and a small WASM decoder loaded on demand.",
  },
  {
    q: "Is conversion free?",
    a: "Yes. HEIF/HEIC to JPG conversion is free. No account required. All processing stays local.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Select or drop file",
    text: "Drag and drop a HEIC/HEIF file or click to select. Only one file at a time; the converter validates the format.",
  },
  {
    name: "Click Convert to JPG",
    text: "The conversion library loads on demand (no upfront download). Conversion runs entirely in your browser.",
  },
  {
    name: "Preview and download",
    text: "Preview the result and download JPG(s). Multi-image HEIC files produce multiple JPGs. Files never leave your device.",
  },
];

export default async function HeifToJpgPage() {
  const seoContent = getConvertSeoContent(TOOL_SLUG);
  return (
    <ConvertPageLayout
      tool={TOOL}
      converter={<HeifToJpgConverter toolSlug={TOOL_SLUG} />}
      faq={FAQ}
      faqTitle={`${TOOL_NAME} FAQ`}
      howToSteps={HOWTO_STEPS}
      seoContent={seoContent ?? undefined}
    />
  );
}
