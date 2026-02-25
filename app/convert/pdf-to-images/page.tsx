import type { Metadata } from "next";
import { PdfToImagesConverter } from "@/components/PdfToImagesConverter";
import { ConvertPageLayout } from "@/components/ConvertPageLayout";
import { getConvertMetadata } from "@/lib/convertMetadata";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "pdf-to-images";
const TOOL_NAME = "PDF to Images";
const DESCRIPTION =
  "Extract PDF pages as images in your browser. No upload 2026, privacy first file converter. 100% client-side, completely local (Pro).";

const TOOL = { name: TOOL_NAME, description: DESCRIPTION, slug: TOOL_SLUG };

const meta = getConvertMetadata(TOOL_NAME);
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: meta.openGraph,
};

const PDF_FAQ = [
  {
    q: "Is PDF to Images conversion local?",
    a: "PDF to Images (extract pages as images) runs 100% in your browser when you use it. No upload. 2026.",
  },
  {
    q: "Why extract PDF pages as images?",
    a: "Useful for thumbnails, slides, or editing in image tools. Doing it locally keeps confidential documents private.",
  },
  {
    q: "When will it be available?",
    a: "We are building it for Pro users. All processing will run in-browser; no files sent to servers.",
  },
  {
    q: "Free vs Pro?",
    a: "PDF to Images is Pro-only. Other tools (AVIF, WAV, WebP, MP4, PNG, OGG, GIF) have free single-file conversion.",
  },
  {
    q: "Do you store PDFs?",
    a: "No. We never receive your files. When the tool runs, conversion is entirely client-side.",
  },
  {
    q: "Privacy vs cloud PDF tools like Convertio?",
    a: "Many PDF tools upload your file. PrivacyConvert keeps everything browser local — same no-upload approach as VERT.sh and localconvert. 2026.",
  },
  {
    q: "What image format will be used?",
    a: "Planned: PNG or JPEG per page. Details will be announced when the feature launches.",
  },
  {
    q: "How do I get Pro?",
    a: "Visit the Pricing page. Pro unlocks batch conversion, P2P transfer, and PDF to Images when available.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Pro feature",
    text: "PDF to Images is available for Pro users. Upgrade on the Pricing page.",
  },
  {
    name: "Load converter",
    text: "When available, load the converter once in your browser.",
  },
  {
    name: "Select PDF",
    text: "Select your PDF file. Pages will be extracted as images locally.",
  },
  {
    name: "Download",
    text: "Download each page as image. No upload. 2026.",
  },
];

export default async function PdfToImagesPage() {
  const seoContent = getConvertSeoContent(TOOL_SLUG);
  return (
    <ConvertPageLayout
      tool={TOOL}
      converter={<PdfToImagesConverter toolSlug={TOOL_SLUG} />}
      faq={PDF_FAQ}
      faqTitle={`${TOOL_NAME} FAQ`}
      howToSteps={HOWTO_STEPS}
      seoContent={seoContent ?? undefined}
    />
  );
}
