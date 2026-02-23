import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ConversionUI } from "@/components/ConversionUI";
import { ProUnlockBanner } from "@/components/ProUnlockBanner";
import { TOOLS } from "@/lib/tools";
import { buildFAQSchema, buildHowToSchema } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return { title: "Tool Not Found" };
  return {
    title: `${tool.name} - No Upload, 100% Local | PrivacyConvert 2026`,
    description: `${tool.description}. Convert in browser, zero privacy risk. No upload. 2026.`,
  };
}

const WAV_FAQ = [
  {
    q: "Is WAV to MP3 conversion done locally?",
    a: "Yes. Conversion runs in your browser with FFmpeg.wasm. Your audio never leaves your device. No upload, zero privacy risk.",
  },
  {
    q: "What MP3 quality is used?",
    a: "We use FFmpeg's libmp3lame with quality 2 (high quality, ~190 kbps VBR). You can re-convert with other tools if you need different bitrates.",
  },
  {
    q: "Can I convert multiple WAV files at once?",
    a: "Free users can convert one file at a time. Pro users get unlimited batch conversion.",
  },
  {
    q: "Do you store or upload my WAV files?",
    a: "No. All conversion happens in your browser. We do not store, upload, or have access to your files.",
  },
  {
    q: "Why convert WAV to MP3?",
    a: "WAV is uncompressed and large; MP3 is compressed and widely supported. Converting saves space and keeps compatibility with players, phones, and car stereos.",
  },
];

const AVIF_FAQ = [
  {
    q: "Is AVIF to PNG conversion done on my device?",
    a: "Yes. PrivacyConvert runs FFmpeg entirely in your browser (WebAssembly). Your AVIF files never leave your computer. No upload, no server, zero privacy risk.",
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
];

const WEBP_FAQ = [
  {
    q: "Is WebP to PNG conversion done locally?",
    a: "Yes. FFmpeg runs in your browser via WebAssembly. Your WebP files never leave your device. No upload, zero privacy risk.",
  },
  {
    q: "Why convert WebP to PNG?",
    a: "WebP is great for web use; PNG is lossless and has broader support in older apps, editors, and print. Converting locally keeps your images private.",
  },
  {
    q: "Free vs Pro limits?",
    a: "Free: one file at a time. Pro: unlimited batch conversion. All conversion remains 100% in your browser.",
  },
  {
    q: "Do you store my images?",
    a: "No. We have no access to your files. Conversion is entirely client-side.",
  },
];

const MP4_FAQ = [
  {
    q: "Is MP4 to WebM conversion done in my browser?",
    a: "Yes. PrivacyConvert uses FFmpeg.wasm. Your video is processed locally; nothing is uploaded to our servers.",
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
];

const AVIF_SEO_CONTENT = `
AVIF to PNG Converter — No Upload, 100% Local (2026)

Convert AVIF images to PNG in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg compiled to WebAssembly. Your files are never uploaded to any server.

Why use a local AVIF to PNG converter?

AVIF (AV1 Image File Format) provides excellent compression and quality, but not every app or website supports it yet. PNG remains the go-to format for lossless images and broad compatibility. Converting AVIF to PNG lets you keep a single image in a format that works everywhere — and doing it locally means you don’t have to send sensitive or large files to a third party.

How does local conversion work?

When you use PrivacyConvert’s AVIF to PNG tool, the site loads FFmpeg (a well-known open-source media toolkit) as WebAssembly in your browser. Your AVIF file stays on your device. The conversion runs in a sandbox in the tab. The resulting PNG is generated in memory and offered for download. No data is sent to our servers because the conversion doesn’t use our servers at all. This is the same “no upload” approach used by other privacy-focused converters like VERT.sh and localconvert.com, with a focus on clarity, SEO, and a sustainable Freemium model in 2026.

Privacy and security

We don’t collect, store, or analyze your images. We don’t use tracking pixels or third-party scripts on the conversion page for the conversion itself. Your AVIF and PNG files exist only in your browser session. If you want to support development and get perks like unlimited batch conversion and larger file support, you can upgrade to Pro via Stripe or Buy Me a Coffee — but the core conversion remains local and private for everyone.

Limits: Free vs Pro

Free users can convert one AVIF file at a time. Pro users get unlimited batch conversion, so you can process many files in one go. All processing still happens in your browser; Pro only relaxes limits and unlocks extra features like P2P transfer.

How to use this tool

Load FFmpeg once (about 31 MB, cached by the browser). Then drag and drop one or more AVIF files (or click to select). The tool converts them to PNG and lets you download each result. No account required for free conversion.

Comparison with other tools

Convertio and similar cloud converters upload your files to their servers. PrivacyConvert, like VERT.sh and localconvert.com, keeps everything client-side. We differentiate with clearer SEO, a modern stack, and a transparent Free vs Pro model so you know exactly what you get in 2026.

Technical note

This tool uses FFmpeg.wasm (version 0.12+) to decode AVIF and encode PNG. The work runs on the main thread (or worker when available). For very large images, conversion may take a few seconds. Your browser may ask for more memory; that’s normal for in-browser processing.

Summary

PrivacyConvert’s AVIF to PNG converter is free, runs 100% in your browser, and never uploads your files. Use it for quick, private conversions with no sign-up. For unlimited batch and more formats, consider Pro. 2026.
`.trim();

const WAV_SEO_CONTENT = `
WAV to MP3 Converter — No Upload, 100% Local (2026)

Convert WAV audio to MP3 in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg compiled to WebAssembly. Your audio files are never uploaded to any server. This no-upload, local-first approach ensures complete privacy for your recordings, podcasts, and music.

Why convert WAV to MP3 locally?

WAV is uncompressed and produces large files; MP3 is compressed and widely supported by phones, cars, and players. Converting WAV to MP3 saves storage and keeps compatibility everywhere. Doing it locally means your recordings never leave your computer — no cloud upload, no account, no privacy concerns. Many online converters require you to upload files to their servers; PrivacyConvert keeps everything in the browser.

How does local WAV to MP3 conversion work?

When you use this tool, the site loads FFmpeg (open-source media toolkit) as WebAssembly in your browser. Your WAV file stays on your device. The conversion runs in a sandbox in the tab. The resulting MP3 is generated in memory and offered for download. No data is sent to our servers. We use high-quality MP3 encoding (libmp3lame, quality 2, ~190 kbps VBR) so the output sounds great while staying smaller than WAV.

Privacy and limits

We do not collect, store, or analyze your audio. Free users can convert one file at a time; Pro users get unlimited batch conversion. Same 100% local conversion for everyone — Pro only relaxes limits and adds features like history and P2P transfer. To support development, you can upgrade via Buy Me a Coffee or Stripe.

How to use

Load FFmpeg once (about 31 MB, cached by the browser). Then drag and drop one or more WAV files (or click to select). The tool converts them to MP3 and lets you download each result. No account required for free conversion. 2026.
`.trim();

const WEBP_SEO_CONTENT = `
WebP to PNG Converter — No Upload, 100% Local (2026)

Convert WebP images to PNG in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg (WebAssembly). Your files are never uploaded to any server. WebP is widely used on the web for smaller file sizes; PNG remains the standard for lossless images and broad compatibility. Converting WebP to PNG locally lets you use images in older software, editors, and print workflows without sending files to the cloud.

Why use a local WebP to PNG converter?

WebP offers good compression and quality; PNG is lossless and has universal support. Converting to PNG helps when you need a format that works in every app. Doing it locally means sensitive or confidential images never leave your computer. Many cloud converters upload your files; PrivacyConvert keeps everything client-side.

How it works

Load FFmpeg once in your browser, then drag and drop WebP files. The tool converts them to PNG and lets you download the results. All processing happens in the tab; we do not receive or store your images. Free users can convert one file at a time; Pro users get unlimited batch. Same local conversion for everyone — no upload, no privacy risk. 2026.
`.trim();

const MP4_SEO_CONTENT = `
MP4 to WebM Converter — No Upload, 100% Local (2026)

Convert MP4 video to WebM in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg (WebAssembly). Your video files are never uploaded. WebM (VP9 video, Opus audio) is royalty-free and well-supported in modern browsers. Converting MP4 to WebM locally helps with web embedding and compatibility without sending video to third-party servers.

Why convert MP4 to WebM locally?

MP4 (H.264) is ubiquitous; WebM (VP9) is open and often smaller at similar quality. Converting to WebM is useful for web players and HTML5 video. Doing it locally means your footage never leaves your device — no cloud, no account, no privacy concerns. We use VP9 with CRF 30 and Opus audio for a good balance of size and quality.

How it works

Load FFmpeg once in your browser, then drag and drop MP4 files. The tool converts them to WebM and lets you download the results. All processing happens in the tab; we do not receive or store your video. Free: one file at a time. Pro: unlimited batch. Same 100% local conversion for everyone. 2026.
`.trim();

function ToolContent({ slug }: { slug: string }) {
  if (slug === "avif-to-png") {
    return (
      <>
        <div className="space-y-6 whitespace-pre-wrap text-sm text-muted-foreground">
          {AVIF_SEO_CONTENT}
        </div>
        <div className="mt-8">
          <h3 className="mb-4 font-semibold">AVIF to PNG FAQ</h3>
          <Accordion type="single" collapsible>
            {AVIF_FAQ.map((item, i) => (
              <AccordionItem key={i} value={`avif-faq-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </>
    );
  }
  if (slug === "wav-to-mp3") {
    return (
      <>
        <div className="space-y-6 whitespace-pre-wrap text-sm text-muted-foreground">
          {WAV_SEO_CONTENT}
        </div>
        <div className="mt-8">
          <h3 className="mb-4 font-semibold">WAV to MP3 FAQ</h3>
          <Accordion type="single" collapsible>
            {WAV_FAQ.map((item, i) => (
              <AccordionItem key={i} value={`wav-faq-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </>
    );
  }
  if (slug === "webp-to-png") {
    return (
      <>
        <div className="space-y-6 whitespace-pre-wrap text-sm text-muted-foreground">
          {WEBP_SEO_CONTENT}
        </div>
        <div className="mt-8">
          <h3 className="mb-4 font-semibold">WebP to PNG FAQ</h3>
          <Accordion type="single" collapsible>
            {WEBP_FAQ.map((item, i) => (
              <AccordionItem key={i} value={`webp-faq-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </>
    );
  }
  if (slug === "mp4-to-webm") {
    return (
      <>
        <div className="space-y-6 whitespace-pre-wrap text-sm text-muted-foreground">
          {MP4_SEO_CONTENT}
        </div>
        <div className="mt-8">
          <h3 className="mb-4 font-semibold">MP4 to WebM FAQ</h3>
          <Accordion type="single" collapsible>
            {MP4_FAQ.map((item, i) => (
              <AccordionItem key={i} value={`mp4-faq-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </>
    );
  }
  return (
    <p className="text-muted-foreground">
      This tool is coming soon. <Link href="/tools" className="underline">Browse all tools</Link>.
    </p>
  );
}

function ConverterArea({ slug }: { slug: string }) {
  return <ConversionUI slug={slug} />;
}

const HOWTO_STEPS = {
  "avif-to-png": [
    { name: "Load FFmpeg", text: "Click 'Load FFmpeg' to load the converter in your browser (one-time, ~31 MB, cached)." },
    { name: "Add files", text: "Drag and drop AVIF files or click to select. Free: 1 file; Pro: unlimited batch." },
    { name: "Convert", text: "Conversion runs locally. Progress is shown. No upload." },
    { name: "Download", text: "Download each PNG from the results. Files never leave your device." },
  ],
  "wav-to-mp3": [
    { name: "Load FFmpeg", text: "Click 'Load FFmpeg' to load the converter in your browser (one-time, ~31 MB, cached)." },
    { name: "Add WAV files", text: "Drag and drop WAV files or click to select. Free: 1 file; Pro: unlimited batch." },
    { name: "Convert", text: "Conversion runs locally. High-quality MP3 (VBR) is produced. No upload." },
    { name: "Download", text: "Download each MP3. Your audio never leaves your device." },
  ],
  "webp-to-png": [
    { name: "Load FFmpeg", text: "Click 'Load FFmpeg' to load the converter in your browser." },
    { name: "Add WebP files", text: "Drag and drop WebP files or click to select. Free: 1 file; Pro: batch." },
    { name: "Convert and download", text: "Conversion runs locally. Download PNGs. No upload." },
  ],
  "mp4-to-webm": [
    { name: "Load FFmpeg", text: "Click 'Load FFmpeg' to load the converter in your browser." },
    { name: "Add MP4 files", text: "Drag and drop MP4 files or click to select. Free: 1 file; Pro: batch." },
    { name: "Convert and download", text: "Conversion runs locally (VP9/Opus). Download WebM. No upload." },
  ],
} as const;

export default async function ConvertPage({ params }: Props) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();

  const faqItems =
    slug === "avif-to-png" ? AVIF_FAQ
    : slug === "wav-to-mp3" ? WAV_FAQ
    : slug === "webp-to-png" ? WEBP_FAQ
    : slug === "mp4-to-webm" ? MP4_FAQ
    : null;
  const faqSchema = faqItems ? buildFAQSchema(faqItems) : null;
  const steps = HOWTO_STEPS[slug as keyof typeof HOWTO_STEPS];
  const howToSchema = steps
    ? buildHowToSchema({
        name: `${tool.name} - No Upload, 100% Local`,
        description: tool.description,
        steps: steps.map((s) => ({ name: s.name, text: s.text })),
      })
    : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      <div className="container py-8">
        <div className="mb-6">
          <Link href="/tools" className="text-sm text-muted-foreground hover:underline">
            ← All tools
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{tool.name}</h1>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          <aside className="min-w-0">
            <ToolContent slug={slug} />
          </aside>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProUnlockBanner />
            <ConverterArea slug={slug} />
          </div>
        </div>
      </div>
    </>
  );
}
