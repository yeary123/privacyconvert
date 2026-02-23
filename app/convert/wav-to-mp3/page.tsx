import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WavToMp3Converter } from "@/components/WavToMp3Converter";
import { ProUnlockBanner } from "@/components/ProUnlockBanner";
import {
  buildFAQSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/schema";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "wav-to-mp3";
const TOOL_NAME = "WAV to MP3";
const DESCRIPTION =
  "Convert WAV to MP3 in your browser. No upload 2026, privacy first file converter. 100% client-side, completely local.";

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
    q: "Is WAV to MP3 conversion done locally?",
    a: "Yes. Encoding runs in a Web Worker in your browser (LAME-based encoder). Your audio never leaves your device. No upload, zero privacy risk. 2026.",
  },
  {
    q: "What MP3 quality is used?",
    a: "We use 128 kbps CBR for broad compatibility and fast encoding. You can re-convert with other tools if you need different bitrates.",
  },
  {
    q: "Can I convert multiple WAV files at once?",
    a: "Free users can convert one file at a time. Pro users get batch conversion (multiple files).",
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
    a: "Yes. Single-file conversion is free. Pro adds batch and P2P; core conversion stays 100% local for everyone.",
  },
];

const HOWTO_STEPS = [
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

const TUTORIAL_CONTENT = `
WAV to MP3 Converter — No Upload, 100% Local Browser Converter 2026

Convert WAV audio to MP3 in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using a Web Worker and a LAME-based encoder. Your audio files are never uploaded to any server. This no upload 2026, privacy first file converter approach keeps your recordings on your device. Unlike Convertio and similar cloud converters that upload your WAV to their servers, we run the encoder in the browser — client side and completely local. The same idea is used by VERT.sh and localconvert: everything stays in your browser, browser local and completely local.

Why use a local WAV to MP3 converter?

WAV is uncompressed and produces large files; MP3 is compressed and widely supported by phones, cars, and players. Converting WAV to MP3 saves storage and keeps compatibility everywhere. Doing it locally means your recordings never leave your computer — no cloud upload, no account, no privacy concerns. Many users choose a privacy first file converter after comparing options: vs Convertio, Convertio requires upload and often an account for batch; we require neither. Vs VERT.sh and vs localconvert, we offer the same no-upload guarantee with a clearer Free vs Pro model and more tools in one place for 2026. All processing is client side and browser local.

How does local WAV to MP3 conversion work?

When you use PrivacyConvert's WAV to MP3 tool, you select or drop WAV files and click Convert. The encoding runs in a Web Worker (code-split, no large upfront download). Your WAV stays on your device. The resulting MP3 is generated in memory and offered for download. No data is sent to our servers. We use 128 kbps MP3 for compatibility and speed. This is the same "no upload" approach used by other privacy-focused converters. Your WAV and MP3 never leave your machine. Completely local, no upload 2026.

Privacy and security

We don't collect, store, or analyze your audio. Your WAV and MP3 files exist only in your browser session. If you want to support development and get perks like batch conversion, you can upgrade to Pro — but the core conversion remains local and private for everyone. Comparison: vs Convertio — Convertio stores files temporarily on their servers; vs VERT.sh and vs localconvert — they run client side like us, browser local.

Limits: Free vs Pro

Free users can convert one WAV file at a time. Pro users get batch conversion. All processing still happens in your browser; Pro only relaxes limits and unlocks extra features like P2P transfer. Supported browsers: modern Chrome, Firefox, Edge, and Safari. No upload 2026: the entire pipeline is client side and completely local.

How to use this tool

Drag and drop WAV files or click to select, then click Convert to MP3. The encoder runs in a Web Worker. Download each MP3 when done. No account required for free conversion. Everything runs browser local. Privacy first file converter, no upload 2026: we never see your WAV or MP3.

Technical note

This tool uses a LAME-based JavaScript encoder running in a Web Worker. The worker is created from inline code (Blob) so there are no separate worker file path issues. Encoding is compute-intensive and runs off the main thread. All of it is completely local and browser local.

Summary

PrivacyConvert's WAV to MP3 converter is free, runs 100% in your browser, and never uploads your files. Use it for quick, private conversions with no sign-up. No upload 2026, privacy first file converter, client side and completely local. For batch and more formats, consider Pro.
`.trim();

const TUTORIAL_FULL = getConvertSeoContent("wav-to-mp3") || TUTORIAL_CONTENT;

export default async function WavToMp3Page() {
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
    url: `${baseUrl}/convert/wav-to-mp3`,
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
            <WavToMp3Converter toolSlug={TOOL_SLUG} />
          </div>
          <aside className="min-w-0 lg:col-span-7">
            <div className="space-y-6 whitespace-pre-wrap text-sm text-muted-foreground">
              {TUTORIAL_FULL}
            </div>
            <div className="mt-8">
              <h3 className="mb-4 font-semibold">WAV to MP3 FAQ</h3>
              <Accordion type="single" collapsible>
                {FAQ.map((item, i) => (
                  <AccordionItem key={i} value={`faq-wav-${i}`}>
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
