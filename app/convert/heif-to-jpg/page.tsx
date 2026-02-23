import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HeifToJpgConverter } from "@/components/HeifToJpgConverter";
import { ProUnlockBanner } from "@/components/ProUnlockBanner";
import {
  buildFAQSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/schema";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "heif-to-jpg";
const TOOL_NAME = "HEIF/HEIC to JPG";
const DESCRIPTION =
  "Convert HEIF/HEIC to JPG in your browser. No upload 2026, privacy first. 100% client-side, completely local.";

export const metadata: Metadata = {
  title: `${TOOL_NAME} No Upload – 100% Local Browser Converter 2026`,
  description: `${DESCRIPTION}. No upload, browser local conversion. Zero privacy risk.`,
  openGraph: {
    title: `${TOOL_NAME} – No Upload 2026 | PrivacyConvert`,
    description: DESCRIPTION,
  },
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
    a: "Cloud tools upload your HEIC to their servers. PrivacyConvert keeps everything in your browser — same no-upload approach as other local converters. 2026.",
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

const TUTORIAL_CONTENT = `
HEIF/HEIC to JPG Converter — No Upload, 100% Local Browser Converter 2026

Convert HEIF and HEIC images to JPG in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device. Your files are never uploaded to any server. This no upload 2026, privacy first approach keeps your photos on your device. Unlike cloud converters that upload your HEIC to their servers, we run the conversion in the browser — client side and completely local.

Why use a local HEIC to JPG converter?

HEIC (High Efficiency Image Format) is used by Apple devices and offers good compression. JPG is supported everywhere — Windows, Android, older apps, and the web. Converting HEIC to JPG locally means your photos never leave your computer. Many users choose a privacy-first converter after comparing options: cloud tools require upload and often an account; we require neither. All processing is client side and browser local.

How does local conversion work?

When you use PrivacyConvert's HEIF/HEIC to JPG tool, you select or drop a file and click Convert. The conversion library is loaded on demand (code splitting), so the page stays fast. Your HEIC file stays on your device. The resulting JPG(s) are generated in memory and offered for download. No data is sent to our servers. Completely local, no upload 2026.

Privacy and security

We don't collect, store, or analyze your images. Conversion happens only in your browser session. Your HEIC and JPG files exist only on your machine. Supported browsers: modern Chrome, Firefox, Edge, and Safari. Conversion is free; no account required.
`.trim();

const TUTORIAL_FULL = getConvertSeoContent("heif-to-jpg") || TUTORIAL_CONTENT;

export default async function HeifToJpgPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.privacyconvert.online";
  const faqSchema = buildFAQSchema(FAQ);
  const howToSchema = buildHowToSchema({
    name: `${TOOL_NAME} - No Upload, 100% Local`,
    description: DESCRIPTION,
    steps: HOWTO_STEPS,
  });
  const appSchema = buildSoftwareApplicationSchema({
    name: `${TOOL_NAME} - No Upload 2026`,
    description: `${DESCRIPTION}. 100% local browser converter. No upload, privacy first.`,
    url: `${baseUrl}/convert/heif-to-jpg`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <div className="container py-8">
        <div className="mb-6">
          <Link href="/tools" className="text-sm text-muted-foreground hover:underline">
            ← All tools
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{TOOL_NAME}</h1>
          <p className="text-muted-foreground">{DESCRIPTION}</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <ProUnlockBanner />
            <HeifToJpgConverter toolSlug={TOOL_SLUG} />
          </div>
          <aside className="min-w-0 lg:col-span-7">
            <div className="space-y-6 whitespace-pre-wrap text-sm text-muted-foreground">
              {TUTORIAL_FULL}
            </div>
            <div className="mt-8">
              <h3 className="mb-4 font-semibold">HEIF/HEIC to JPG FAQ</h3>
              <Accordion type="single" collapsible>
                {FAQ.map((item, i) => (
                  <AccordionItem key={i} value={`faq-heif-${i}`}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
