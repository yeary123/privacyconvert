import type { Metadata } from "next";
import { EpubToMobiConverter } from "@/components/EpubToMobiConverter";
import { ConvertPageLayout } from "@/components/ConvertPageLayout";
import { getConvertMetadata } from "@/lib/convertMetadata";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "epub-to-mobi";
const TOOL_NAME = "EPUB to MOBI / AZW3";
const DESCRIPTION =
  "Extract EPUB to HTML for Calibre (MOBI/AZW3). No upload 2026, 100% local browser. Privacy first converter. Part of 200+ format tools. Your files never leave your device.";

const TOOL = { name: TOOL_NAME, description: DESCRIPTION, slug: TOOL_SLUG };

export const metadata: Metadata = {
  title: `${TOOL_NAME} No Upload – 100% Local Converter 2026 | PrivacyConvert`,
  description:
    "EPUB to MOBI/AZW3: no upload, 100% local in browser. Privacy-first. Extract content; use Calibre for MOBI/AZW3. Part of 200+ formats. 2026.",
  openGraph: {
    title: `${TOOL_NAME} No Upload 2026 | PrivacyConvert`,
    description: DESCRIPTION,
  },
};

const FAQ = [
  {
    q: "Is EPUB to MOBI conversion done on my device?",
    a: "Yes. We extract your EPUB content 100% in your browser. Your file never leaves your computer. You then open the downloaded HTML in Calibre (free) to create MOBI or AZW3. No upload, no server, 2026.",
  },
  {
    q: "Why do I get HTML instead of MOBI/AZW3 directly?",
    a: "MOBI and AZW3 are Amazon Kindle formats that need specialized encoding. We extract the book content locally (no upload); for full MOBI/AZW3 output, Calibre on your computer is the recommended free tool. Your EPUB and HTML never leave your device.",
  },
  {
    q: "Do you store or upload my EPUB files?",
    a: "No. Extraction runs entirely in your browser. We do not store, log, or transmit your e-books. Privacy first converter, no upload 2026.",
  },
  {
    q: "How does this compare to Convertio or cloud e-book converters?",
    a: "Cloud tools upload your EPUB to their servers. PrivacyConvert keeps everything in the browser — same no-upload approach as our other 200+ format tools. Vs Convertio: we never see your file.",
  },
  {
    q: "What is Calibre and do I need it?",
    a: "Calibre is free desktop software for e-books. To get MOBI or AZW3 files, open our extracted HTML in Calibre and use Convert books → MOBI or AZW3. All of that runs on your machine.",
  },
  {
    q: "Can I convert multiple EPUBs at once?",
    a: "This tool processes one EPUB at a time. Batch conversion is available on other converters for Pro users. Extraction remains 100% local for everyone.",
  },
  {
    q: "What browsers are supported?",
    a: "Modern Chrome, Firefox, Edge, and Safari. The tool uses standard JavaScript and JSZip; no special plugins required. No upload 2026.",
  },
  {
    q: "Is it really free?",
    a: "Yes. EPUB extraction is free with no account. We never see your files. For more formats and batch on other tools, consider Pro.",
  },
  {
    q: "Why privacy first converter?",
    a: "We run conversion in your browser so your e-books never go to our servers. No upload 2026, 100% local, part of 200+ format tools. Compare vs Convertio and other cloud services.",
  },
  {
    q: "Will my DRM-protected EPUB work?",
    a: "This tool extracts structure and text from standard EPUBs. DRM-protected files may not open or extract correctly. Use only with content you have the right to convert.",
  },
];

const HOWTO_STEPS = [
  { name: "Select EPUB", text: "Drag and drop your EPUB file or click to select. File stays on your device." },
  { name: "Extract", text: "The tool parses the EPUB in your browser and builds one HTML with all chapters. No upload." },
  { name: "Download HTML", text: "Download the extracted HTML file. Copy or open in Calibre." },
  { name: "Convert in Calibre", text: "Open Calibre, add the HTML, then Convert books → MOBI or AZW3. Your files never left your device." },
];

export default async function EpubToMobiPage() {
  const seoContent = getConvertSeoContent(TOOL_SLUG);
  return (
    <ConvertPageLayout
      tool={TOOL}
      converter={<EpubToMobiConverter toolSlug={TOOL_SLUG} />}
      faq={FAQ}
      faqTitle={`${TOOL_NAME} FAQ`}
      howToSteps={HOWTO_STEPS}
      seoContent={seoContent ?? undefined}
    />
  );
}
