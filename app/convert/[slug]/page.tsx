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
import { TOOLS } from "@/lib/tools";

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

Convert WAV audio to MP3 in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg (WebAssembly). Your files are never uploaded.

Why convert WAV to MP3 locally?

WAV is uncompressed and large; MP3 is compressed and widely supported. Converting WAV to MP3 saves space and keeps compatibility with players and devices. Doing it locally means your recordings and audio never leave your computer — no cloud, no account, no privacy concerns.

How it works

Load FFmpeg once in your browser, then drag and drop WAV files. The tool converts them to high-quality MP3 (VBR, ~190 kbps) and lets you download the results. All processing happens in the tab; we don't receive or store your audio.

Free vs Pro

Free: one file at a time. Pro: unlimited batch. Same local conversion for everyone; Pro only lifts limits and adds features like history and P2P.
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
  return (
    <p className="text-muted-foreground">
      This tool is coming soon. <Link href="/tools" className="underline">Browse all tools</Link>.
    </p>
  );
}

function ConverterArea({ slug }: { slug: string }) {
  return <ConversionUI slug={slug} />;
}

export default async function ConvertPage({ params }: Props) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();

  const faqSchema =
    slug === "avif-to-png"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: AVIF_FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : slug === "wav-to-mp3"
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: WAV_FAQ.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }
        : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
            <ConverterArea slug={slug} />
          </div>
        </div>
      </div>
    </>
  );
}
