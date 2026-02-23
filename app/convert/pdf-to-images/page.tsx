import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PdfToImagesConverter } from "@/components/PdfToImagesConverter";
import { ProUnlockBanner } from "@/components/ProUnlockBanner";
import {
  buildFAQSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/schema";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "pdf-to-images";
const TOOL_NAME = "PDF to Images";
const DESCRIPTION =
  "Extract PDF pages as images in your browser. No upload 2026, privacy first file converter. 100% client-side, completely local (Pro).";

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

const TUTORIAL_CONTENT = `
PDF to Images — No Upload, 100% Local Browser Converter 2026 (Pro)

Extract PDF pages as images in your browser with zero privacy risk. PrivacyConvert runs extraction entirely on your device — no upload, no server. This no upload 2026, privacy first file converter approach keeps your documents on your device. Unlike Convertio and similar cloud PDF tools that upload your file to their servers, we keep everything in the browser — client side and completely local. The same idea is used by VERT.sh and localconvert: everything stays in your browser, browser local and completely local. PDF to Images is a Pro feature; when you use it, your PDF never leaves your computer.

Why use a local PDF to Images converter?

Useful for thumbnails, slides, or editing in image editors. Doing it locally keeps confidential documents private — no cloud upload, no account required for Pro users. Many users choose a privacy first file converter after comparing options: vs Convertio, Convertio and many PDF tools upload your file to their servers; we require no upload. Vs VERT.sh and vs localconvert, we offer the same no-upload guarantee with a clearer Pro tier and more tools in one place for 2026. All processing is client side and browser local.

How does local PDF to Images work?

When you use PrivacyConvert's PDF to Images tool (Pro), the converter loads in your browser. Your PDF file stays on your device. Pages are extracted as images (e.g. PNG or JPEG) in the tab. The resulting images are generated in memory and offered for download. No data is sent to our servers. This is the same "no upload" approach used by other privacy-focused converters like VERT.sh and localconvert.com. Your PDF and extracted images never leave your machine. Completely local, no upload 2026.

Privacy and security

We don't collect, store, or analyze your documents. We don't use tracking pixels or third-party scripts on the conversion page for the conversion itself. Your PDF and images exist only in your browser session. PDF to Images is a Pro feature; other converters (AVIF, WAV, WebP, MP4, PNG, OGG, GIF) offer free single-file conversion. Comparison: vs Convertio — Convertio and many PDF tools store files on their servers; vs VERT.sh and vs localconvert — they run client side like us, browser local. We differentiate with a transparent Pro model so you know exactly what you get in 2026.

Limits: Pro only

PDF to Images is available for Pro users. Pro also unlocks batch conversion and P2P transfer for other tools. All processing still happens in your browser; we never receive your files. Supported browsers: modern Chrome, Firefox, Edge, and Safari with WebAssembly. No upload 2026: the entire pipeline is client side and completely local.

How to use this tool

Visit the Pricing page to upgrade to Pro. When PDF to Images is available, load the converter once in your browser, then select your PDF. Pages are extracted as images in the tab. Download each page. No account beyond Pro; everything runs browser local. Comparison with other tools: PrivacyConvert vs Convertio — Convertio uploads your PDF; PrivacyConvert, like VERT.sh and localconvert, keeps everything client side. Privacy first file converter, no upload 2026: we never see your PDF or images. We differentiate with a transparent Pro tier for 2026.

Technical note

When the tool ships, it will use in-browser PDF rendering and image encoding. The work runs entirely on your device. All of it is completely local and browser local.

Summary

PrivacyConvert's PDF to Images converter (Pro) runs 100% in your browser and never uploads your files. No upload 2026, privacy first file converter, client side and completely local. Vs Convertio, vs VERT.sh, vs localconvert: we share the same no-upload philosophy while offering a clear Pro product and more tools in one place in 2026.
`.trim();

const TUTORIAL_FULL = getConvertSeoContent("pdf-to-images") || TUTORIAL_CONTENT;

export default async function PdfToImagesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://privacyconvert.com";
  const faqSchema = buildFAQSchema(FAQ);
  const howToSchema = buildHowToSchema({
    name: `${TOOL_NAME} - No Upload, 100% Local`,
    description: DESCRIPTION,
    steps: HOWTO_STEPS,
  });
  const appSchema = buildSoftwareApplicationSchema({
    name: `${TOOL_NAME} - No Upload 2026`,
    description: `${DESCRIPTION}. 100% local browser converter. No upload, privacy first.`,
    url: `${baseUrl}/convert/pdf-to-images`,
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
            <PdfToImagesConverter toolSlug={TOOL_SLUG} />
          </div>
          <aside className="min-w-0 lg:col-span-7">
            <div className="space-y-6 whitespace-pre-wrap text-sm text-muted-foreground">
              {TUTORIAL_FULL}
            </div>
            <div className="mt-8">
              <h3 className="mb-4 font-semibold">PDF to Images FAQ</h3>
              <Accordion type="single" collapsible>
                {FAQ.map((item, i) => (
                  <AccordionItem key={i} value={`faq-pdf-${i}`}>
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
