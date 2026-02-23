import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AvifToPngConverter } from "@/components/AvifToPngConverter";
import { ProUnlockBanner } from "@/components/ProUnlockBanner";
import {
  buildFAQSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/schema";

const TOOL_SLUG = "avif-to-png";
const TOOL_NAME = "AVIF to PNG";
const DESCRIPTION =
  "Convert AVIF to PNG in your browser. No upload 2026, privacy first file converter. 100% client-side, completely local.";

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

const TUTORIAL_CONTENT = `
AVIF to PNG Converter — No Upload, 100% Local Browser Converter 2026

Convert AVIF images to PNG in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg compiled to WebAssembly. Your files are never uploaded to any server. This no upload 2026, privacy first file converter approach keeps your images on your device. Unlike Convertio and similar cloud converters that upload your AVIF to their servers, we run FFmpeg in the browser — client side and completely local. The same idea is used by VERT.sh and localconvert: everything stays in your browser, browser local and completely local.

Why use a local AVIF to PNG converter?

AVIF (AV1 Image File Format) provides excellent compression and quality, but not every app or website supports it yet. PNG remains the go-to format for lossless images and broad compatibility. Converting AVIF to PNG lets you keep a single image in a format that works everywhere — and doing it locally means you don't have to send sensitive or large files to a third party. Many users choose a privacy first file converter after comparing options: vs Convertio, Convertio requires upload and often an account for batch; we require neither. Vs VERT.sh and vs localconvert, we offer the same no-upload guarantee with a clearer Free vs Pro model and more tools in one place for 2026. All processing is client side and browser local.

How does local conversion work?

When you use PrivacyConvert's AVIF to PNG tool, the site loads FFmpeg (a well-known open-source media toolkit) as WebAssembly in your browser. Your AVIF file stays on your device. The conversion runs in a sandbox in the tab. The resulting PNG is generated in memory and offered for download. No data is sent to our servers because the conversion doesn't use our servers at all. This is the same "no upload" approach used by other privacy-focused converters like VERT.sh and localconvert.com. Your AVIF and PNG never leave your machine. Completely local, no upload 2026.

Privacy and security

We don't collect, store, or analyze your images. We don't use tracking pixels or third-party scripts on the conversion page for the conversion itself. Your AVIF and PNG files exist only in your browser session. If you want to support development and get perks like unlimited batch conversion and larger file support, you can upgrade to Pro via Stripe or Buy Me a Coffee — but the core conversion remains local and private for everyone. Comparison: vs Convertio — Convertio stores files temporarily on their servers; vs VERT.sh and vs localconvert — they run client side like us, browser local. We differentiate with clearer SEO, a modern stack, and a transparent Free vs Pro model so you know exactly what you get in 2026.

Limits: Free vs Pro

Free users can convert one AVIF file at a time. Pro users get unlimited batch conversion. All processing still happens in your browser; Pro only relaxes limits and unlocks extra features like P2P transfer. Supported browsers: modern Chrome, Firefox, Edge, and Safari with WebAssembly. FFmpeg loads once (~31 MB) and is cached for future use. For very large images we recommend under 50 MB for smooth conversion. No upload 2026: the entire pipeline is client side and completely local.

How to use this tool

Load FFmpeg once (about 31 MB, cached by the browser). Then drag and drop one or more AVIF files (or click to select). The tool converts them to PNG and lets you download each result. No account required for free conversion. Everything runs browser local. Comparison with other tools: PrivacyConvert vs Convertio — Convertio uploads your files to their servers; PrivacyConvert, like VERT.sh and localconvert, keeps everything client side. Privacy first file converter, no upload 2026: we never see your AVIF or PNG. We differentiate with clearer SEO, a modern stack, and a transparent Free vs Pro model for 2026.

Technical note

This tool uses FFmpeg.wasm (version 0.12+) to decode AVIF and encode PNG. The work runs on the main thread (or worker when available). For very large images, conversion may take a few seconds. Your browser may ask for more memory; that's normal for in-browser processing. All of it is completely local and browser local.

Summary

PrivacyConvert's AVIF to PNG converter is free, runs 100% in your browser, and never uploads your files. Use it for quick, private conversions with no sign-up. No upload 2026, privacy first file converter, client side and completely local. For unlimited batch and more formats, consider Pro. Vs Convertio, vs VERT.sh, vs localconvert: we share the same no-upload philosophy while offering a clear product and more tools in one place in 2026.
`.trim();

export default async function AvifToPngPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://privacyconvert.com";
  const faqSchema = buildFAQSchema(AVIF_FAQ);
  const howToSchema = buildHowToSchema({
    name: `${TOOL_NAME} - No Upload, 100% Local`,
    description: DESCRIPTION,
    steps: HOWTO_STEPS,
  });
  const appSchema = buildSoftwareApplicationSchema({
    name: `${TOOL_NAME} - No Upload 2026`,
    description: `${DESCRIPTION}. 100% local browser converter. No upload, privacy first.`,
    url: `${baseUrl}/convert/avif-to-png`,
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
            <AvifToPngConverter toolSlug={TOOL_SLUG} />
          </div>
          <aside className="min-w-0 lg:col-span-7">
            <div className="space-y-6 whitespace-pre-wrap text-sm text-muted-foreground">
              {TUTORIAL_CONTENT}
            </div>
            <div className="mt-8">
              <h3 className="mb-4 font-semibold">AVIF to PNG FAQ</h3>
              <Accordion type="single" collapsible>
                {AVIF_FAQ.map((item, i) => (
                  <AccordionItem key={i} value={`faq-avif-${i}`}>
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
