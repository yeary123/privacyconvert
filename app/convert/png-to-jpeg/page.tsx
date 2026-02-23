import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PngToJpegConverter } from "@/components/PngToJpegConverter";
import { ProUnlockBanner } from "@/components/ProUnlockBanner";
import {
  buildFAQSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/schema";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "png-to-jpeg";
const TOOL_NAME = "PNG to JPEG";
const DESCRIPTION =
  "Convert PNG to JPEG in your browser. No upload 2026, privacy first file converter. 100% client-side, completely local.";

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
    q: "Is PNG to JPEG conversion done locally?",
    a: "Yes. FFmpeg runs in your browser via WebAssembly. Your images never leave your device. No upload, zero privacy risk. 2026.",
  },
  {
    q: "Why convert PNG to JPEG?",
    a: "PNG is lossless and often large; JPEG is smaller and universal for photos. Converting locally keeps sensitive images private.",
  },
  {
    q: "What JPEG quality is used?",
    a: "We use high quality (q:v 2 in FFmpeg). Output is suitable for web and sharing while staying smaller than PNG.",
  },
  {
    q: "Free vs Pro limits?",
    a: "Free: one file at a time. Pro: unlimited batch. All conversion remains 100% in your browser.",
  },
  {
    q: "Do you store my images?",
    a: "No. We have no access to your files. Conversion is entirely client-side; nothing is sent to our servers.",
  },
  {
    q: "Privacy comparison with other tools like Convertio?",
    a: "Many online converters upload PNG/JPEG to the cloud. PrivacyConvert keeps everything browser local — same no-upload approach as VERT.sh and localconvert. 2026.",
  },
  {
    q: "What file sizes work best?",
    a: "Device memory limits apply. We recommend images under 50MB for smooth in-browser conversion.",
  },
  {
    q: "Can I convert multiple PNGs at once?",
    a: "Free users: one file. Pro users: unlimited batch. Same local conversion for everyone.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Load FFmpeg",
    text: "Click 'Load FFmpeg' to load the converter in your browser (one-time, ~31 MB, cached).",
  },
  {
    name: "Add PNG files",
    text: "Drag and drop PNG files or click to select. Free: 1 file; Pro: unlimited batch.",
  },
  {
    name: "Convert",
    text: "Conversion runs locally in the browser. Progress is shown. No upload.",
  },
  {
    name: "Download",
    text: "Download each JPEG from the results. Files never leave your device.",
  },
];

const TUTORIAL_CONTENT = `
PNG to JPEG Converter — No Upload, 100% Local Browser Converter 2026

Convert PNG images to JPEG in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg compiled to WebAssembly. Your files are never uploaded to any server. This no upload 2026, privacy first file converter approach keeps your images on your device. Unlike Convertio and similar cloud converters that upload your PNG to their servers, we run FFmpeg in the browser — client side and completely local. The same idea is used by VERT.sh and localconvert: everything stays in your browser, browser local and completely local.

Why use a local PNG to JPEG converter?

PNG is lossless and often large; JPEG is compressed and universally supported for photos, social media, and email. Converting PNG to JPEG saves space and keeps compatibility with older apps and services. Doing it locally means sensitive screenshots, diagrams, or photos never leave your computer. Many users choose a privacy first file converter after comparing options: vs Convertio, Convertio requires upload and often an account for batch; we require neither. Vs VERT.sh and vs localconvert, we offer the same no-upload guarantee with a clearer Free vs Pro model and more tools in one place for 2026. All processing is client side and browser local.

How does local conversion work?

When you use PrivacyConvert's PNG to JPEG tool, the site loads FFmpeg (open-source media toolkit) as WebAssembly in your browser. Your PNG file stays on your device. The conversion runs in a sandbox in the tab. We use high quality (q:v 2) so the output looks great while staying smaller than PNG. The resulting JPEG is generated in memory and offered for download. No data is sent to our servers. This is the same "no upload" approach used by other privacy-focused converters like VERT.sh and localconvert.com. Your PNG and JPEG never leave your machine. Completely local, no upload 2026.

Privacy and security

We don't collect, store, or analyze your images. We don't use tracking pixels or third-party scripts on the conversion page for the conversion itself. Your PNG and JPEG files exist only in your browser session. If you want to support development and get perks like unlimited batch conversion, you can upgrade to Pro via PayPal or Buy Me a Coffee — but the core conversion remains local and private for everyone. Comparison: vs Convertio — Convertio stores files temporarily on their servers; vs VERT.sh and vs localconvert — they run client side like us, browser local. We differentiate with a transparent Free vs Pro model so you know exactly what you get in 2026.

Limits: Free vs Pro

Free users can convert one PNG file at a time. Pro users get unlimited batch conversion. All processing still happens in your browser; Pro only relaxes limits and unlocks extra features like P2P transfer. Supported browsers: modern Chrome, Firefox, Edge, and Safari with WebAssembly. FFmpeg loads once (~31 MB) and is cached. For very large images we recommend under 50 MB for smooth conversion. No upload 2026: the entire pipeline is client side and completely local.

How to use this tool

Load FFmpeg once (about 31 MB, cached by the browser). Then drag and drop one or more PNG files (or click to select). The tool converts them to JPEG and lets you download each result. No account required for free conversion. Everything runs browser local. Comparison with other tools: PrivacyConvert vs Convertio — Convertio uploads your files to their servers; PrivacyConvert, like VERT.sh and localconvert, keeps everything client side. Privacy first file converter, no upload 2026: we never see your PNG or JPEG. We differentiate with a transparent Free vs Pro model for 2026.

Technical note

This tool uses FFmpeg.wasm to decode PNG and encode JPEG. The work runs in your browser. For very large images, conversion may take a few seconds. All of it is completely local and browser local.

Summary

PrivacyConvert's PNG to JPEG converter is free, runs 100% in your browser, and never uploads your files. Use it for quick, private conversions with no sign-up. No upload 2026, privacy first file converter, client side and completely local. For unlimited batch and more formats, consider Pro. Vs Convertio, vs VERT.sh, vs localconvert: we share the same no-upload philosophy while offering a clear product and more tools in one place in 2026.
`.trim();

const TUTORIAL_FULL = getConvertSeoContent("png-to-jpeg") || TUTORIAL_CONTENT;

export default async function PngToJpegPage() {
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
    url: `${baseUrl}/convert/png-to-jpeg`,
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
            <PngToJpegConverter toolSlug={TOOL_SLUG} />
          </div>
          <aside className="min-w-0 lg:col-span-7">
            <div className="space-y-6 whitespace-pre-wrap text-sm text-muted-foreground">
              {TUTORIAL_FULL}
            </div>
            <div className="mt-8">
              <h3 className="mb-4 font-semibold">PNG to JPEG FAQ</h3>
              <Accordion type="single" collapsible>
                {FAQ.map((item, i) => (
                  <AccordionItem key={i} value={`faq-png-${i}`}>
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
