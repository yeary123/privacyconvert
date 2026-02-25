import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConversionUI } from "@/components/ConversionUI";
import { ConvertPageLayout } from "@/components/ConvertPageLayout";
import { TOOLS } from "@/lib/tools";
import { getConvertMetadata } from "@/lib/convertMetadata";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

type Props = { params: Promise<{ slug: string }> };

// Static converter pages (app/convert/avif-to-png/page.tsx etc.) own these routes.
// [slug] only handles unknown slugs (e.g. 404). Do not pre-generate the 8 static paths here.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return { title: "Tool Not Found" };
  const meta = getConvertMetadata(tool.name);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: meta.openGraph,
  };
}

const WAV_FAQ = [
  {
    q: "Is WAV to MP3 conversion done locally?",
    a: "Yes. Encoding runs in a Web Worker in your browser (LAME-based encoder). Your audio never leaves your device. No upload, zero privacy risk. 2026.",
  },
  {
    q: "What MP3 quality or bitrate can I choose?",
    a: "You can choose 96, 128, 192, 256, or 320 kbps (CBR). 128 kbps is default for compatibility; 192–320 kbps for higher quality or music. Other formats (e.g. OGG to MP3) use FFmpeg with VBR.",
  },
  {
    q: "What bitrate should I choose for WAV to MP3?",
    a: "Use 128 kbps for speech or small files; 192 kbps for a good balance; 256 or 320 kbps for music or archival. Higher bitrate means larger MP3 files.",
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
  {
    q: "Privacy comparison with cloud converters?",
    a: "Cloud converters upload your WAV to their servers. PrivacyConvert keeps everything in the browser — no upload, no account. 2026.",
  },
  {
    q: "What browsers work?",
    a: "Modern Chrome, Firefox, Edge, Safari with WebAssembly. FFmpeg loads once and is cached.",
  },
  {
    q: "Is it free?",
    a: "Yes. Single-file conversion is free. Pro adds batch; core conversion stays 100% local for everyone.",
  },
];

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
    q: "How does this compare to cloud converters?",
    a: "Cloud tools upload your AVIF to their servers. PrivacyConvert keeps everything local — same no-upload approach as VERT.sh and localconvert.com. 2026.",
  },
  {
    q: "What browsers are supported?",
    a: "Modern Chrome, Firefox, Edge, and Safari with WebAssembly. FFmpeg loads once (~31 MB) and is cached for future use.",
  },
  {
    q: "Is conversion really free?",
    a: "Yes. Single-file conversion is free with no account. Pro adds batch. Core conversion stays 100% local for everyone.",
  },
  {
    q: "Can I convert multiple AVIF files at once?",
    a: "Free users: one file at a time. Pro users: unlimited batch. All processing remains in your browser.",
  },
];

const WEBP_FAQ = [
  {
    q: "Is WebP to PNG conversion done locally?",
    a: "Yes. FFmpeg runs in your browser via WebAssembly. Your WebP files never leave your device. No upload, zero privacy risk. 2026.",
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
  {
    q: "How does this compare to cloud tools?",
    a: "Cloud converters upload your WebP. PrivacyConvert keeps everything client-side — no upload, same approach as our other tools. 2026.",
  },
  {
    q: "What file sizes work best?",
    a: "Device memory limits apply. We recommend images under 50MB for smooth in-browser conversion.",
  },
  {
    q: "What browsers are supported?",
    a: "Modern Chrome, Firefox, Edge, Safari with WebAssembly. FFmpeg loads once and is cached.",
  },
  {
    q: "Is conversion free?",
    a: "Yes. Single-file conversion is free. Pro adds batch; core conversion stays local for everyone.",
  },
];

const MP4_FAQ = [
  {
    q: "Is MP4 to WebM conversion done in my browser?",
    a: "Yes. PrivacyConvert uses FFmpeg.wasm. Your video is processed locally; nothing is uploaded to our servers. No upload 2026.",
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
  {
    q: "Do you store or upload my video?",
    a: "No. All conversion happens in your browser. We do not store, upload, or have access to your files. Privacy-first 2026.",
  },
  {
    q: "How does this compare to cloud converters?",
    a: "Cloud tools upload your MP4 to their servers. PrivacyConvert keeps everything local — same no-upload privacy as other client-side converters.",
  },
  {
    q: "What browsers are supported?",
    a: "Modern Chrome, Firefox, Edge, and Safari with WebAssembly support. FFmpeg loads once and is cached for future use.",
  },
  {
    q: "Is this really free?",
    a: "Yes. Single-file conversion is free with no account. Pro adds batch. Core conversion stays 100% local for everyone.",
  },
];

const PNG_FAQ = [
  { q: "Is PNG to JPEG conversion done locally?", a: "Yes. FFmpeg runs in your browser via WebAssembly. Your images never leave your device. No upload, zero privacy risk. 2026." },
  { q: "Why convert PNG to JPEG?", a: "PNG is lossless and often large; JPEG is smaller and universal for photos. Converting locally keeps sensitive images private." },
  { q: "What JPEG quality is used?", a: "We use high quality (q:v 2 in FFmpeg). Output is suitable for web and sharing while staying smaller than PNG." },
  { q: "Free vs Pro limits?", a: "Free: one file at a time. Pro: unlimited batch. All conversion remains 100% in your browser." },
  { q: "Do you store my images?", a: "No. We have no access to your files. Conversion is entirely client-side; nothing is sent to our servers." },
  { q: "Privacy comparison with other tools?", a: "Many online converters upload PNG/JPEG to the cloud. PrivacyConvert keeps everything local — no upload, no account required." },
  { q: "What file sizes work best?", a: "Device memory limits apply. We recommend images under 50MB for smooth in-browser conversion." },
  { q: "Can I convert multiple PNGs at once?", a: "Free users: one file. Pro users: unlimited batch. Same local conversion for everyone." },
];

const OGG_FAQ = [
  { q: "Is OGG to MP3 conversion done locally?", a: "Yes. Conversion runs in your browser with FFmpeg.wasm. Your audio never leaves your device. No upload, zero privacy risk. 2026." },
  { q: "What MP3 quality is used?", a: "We use libmp3lame quality 2 (~190 kbps VBR) for high-quality output. Same as our WAV to MP3 tool." },
  { q: "Why convert OGG to MP3?", a: "OGG is open and efficient; MP3 is universally supported. Converting locally lets you use audio on any device without cloud upload." },
  { q: "Free vs Pro?", a: "Free: one file at a time. Pro: unlimited batch. All conversion stays 100% in your browser." },
  { q: "Do you store or upload my files?", a: "No. All processing happens in your browser. We do not store, log, or transmit your audio." },
  { q: "Privacy vs cloud converters?", a: "Cloud tools upload OGG to their servers. PrivacyConvert keeps everything client-side — no upload, no account." },
  { q: "What OGG formats are supported?", a: "Standard .ogg and .oga files. FFmpeg decodes Ogg Vorbis and outputs MP3 in your browser." },
  { q: "Is it really free?", a: "Yes. Single-file conversion is free. Pro adds batch and extra features; core conversion remains local for everyone." },
];

const GIF_FAQ = [
  { q: "Is GIF to MP4 conversion done in my browser?", a: "Yes. PrivacyConvert uses FFmpeg.wasm. Your GIF is processed locally; nothing is uploaded. No upload 2026." },
  { q: "Why convert GIF to MP4?", a: "MP4 is much smaller than GIF for the same quality and plays everywhere. Converting locally keeps your clips private." },
  { q: "What video codec is used?", a: "We use H.264 with faststart and yuv420p for broad compatibility. Conversion runs entirely in your browser." },
  { q: "Batch and file size?", a: "Free: one file. Pro: unlimited batch. Large GIFs are limited by device memory; we recommend under 50MB for smooth conversion." },
  { q: "Do you store my video?", a: "No. We do not have access to your files. Conversion happens in your browser only." },
  { q: "Privacy comparison?", a: "Cloud converters upload your GIF. PrivacyConvert keeps everything client-side — same no-upload approach as our other tools." },
  { q: "What browsers work?", a: "Modern Chrome, Firefox, Edge, Safari with WebAssembly. FFmpeg loads once and is cached." },
  { q: "Free or paid?", a: "Single-file conversion is free. Pro adds batch; core conversion stays local for everyone." },
];

const HEIF_FAQ = [
  { q: "Is HEIF/HEIC to JPG conversion done locally?", a: "Yes. The conversion runs in your browser using a lightweight library loaded on demand. Your HEIC/HEIF files never leave your device. No upload, zero privacy risk. 2026." },
  { q: "Why convert HEIC to JPG?", a: "HEIC is used by Apple devices and offers good compression; JPG is universally supported. Converting to JPG helps compatibility with Windows, Android, and older software. Doing it locally keeps your photos private." },
  { q: "Do I need to load FFmpeg or anything first?", a: "No. The HEIC converter loads its library only when you click Convert, so the page stays fast. No large upfront download." },
  { q: "Do you store or upload my images?", a: "No. We have no access to your files. Conversion is entirely client-side; nothing is sent to our servers." },
  { q: "What if my HEIC has multiple images?", a: "Some HEIC files contain multiple images (e.g. Live Photo). The tool converts all and lets you download each as a separate JPG." },
  { q: "How does this compare to cloud converters?", a: "Cloud tools upload your HEIC to their servers. PrivacyConvert keeps everything in your browser — same no-upload approach as VERT.sh and localconvert. 2026." },
  { q: "What browsers are supported?", a: "Modern Chrome, Firefox, Edge, and Safari. The converter uses standard browser APIs and a small WASM decoder loaded on demand." },
  { q: "Is conversion free?", a: "Yes. HEIF/HEIC to JPG conversion is free. No account required. All processing stays local." },
];

const PDF_FAQ = [
  { q: "Is PDF to Images conversion local?", a: "PDF to Images (extract pages as images) is a Pro feature. When available, conversion will run 100% in your browser — no upload. 2026." },
  { q: "Why extract PDF pages as images?", a: "Useful for thumbnails, slides, or editing in image tools. Doing it locally keeps confidential documents private." },
  { q: "When will it be available?", a: "We are building it for Pro users first. All processing will run in-browser; no files sent to servers." },
  { q: "Free vs Pro?", a: "PDF to Images is Pro-only. Other tools (AVIF, WAV, WebP, MP4, PNG, OGG, GIF) have free single-file conversion." },
  { q: "Do you store PDFs?", a: "No. We never receive your files. When the tool ships, conversion will be entirely client-side." },
  { q: "Privacy vs cloud PDF tools?", a: "Many PDF tools upload your file. PrivacyConvert will keep everything local — no upload, same as our other converters." },
  { q: "What image format will be used?", a: "Planned: PNG or JPEG per page. Details will be announced when the feature launches." },
  { q: "How do I get Pro?", a: "Visit the Pricing page. Pro unlocks batch conversion and PDF to Images when available." },
];

const AVIF_SEO_CONTENT = `
AVIF to PNG Converter — No Upload, 100% Local (2026)

Convert AVIF images to PNG in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg compiled to WebAssembly. Your files are never uploaded to any server. This no upload 2026, privacy-first approach keeps your images on your device. Unlike Convertio and similar cloud converters that upload your AVIF to their servers, we run FFmpeg in the browser — the same idea as VERT.sh and local client-side tools.

Why use a local AVIF to PNG converter?

AVIF (AV1 Image File Format) provides excellent compression and quality, but not every app or website supports it yet. PNG remains the go-to format for lossless images and broad compatibility. Converting AVIF to PNG lets you keep a single image in a format that works everywhere — and doing it locally means you don’t have to send sensitive or large files to a third party.

How does local conversion work?

When you use PrivacyConvert’s AVIF to PNG tool, the site loads FFmpeg (a well-known open-source media toolkit) as WebAssembly in your browser. Your AVIF file stays on your device. The conversion runs in a sandbox in the tab. The resulting PNG is generated in memory and offered for download. No data is sent to our servers because the conversion doesn’t use our servers at all. This is the same “no upload” approach used by other privacy-focused converters like VERT.sh and localconvert.com, with a focus on clarity, SEO, and a sustainable Freemium model in 2026.

Privacy and security

We don’t collect, store, or analyze your images. We don’t use tracking pixels or third-party scripts on the conversion page for the conversion itself. Your AVIF and PNG files exist only in your browser session. If you want to support development and get perks like unlimited batch conversion and larger file support, you can upgrade to Pro via PayPal or Buy Me a Coffee — but the core conversion remains local and private for everyone.

Limits: Free vs Pro

Free users can convert one AVIF file at a time. Pro users get unlimited batch conversion, so you can process many files in one go. All processing still happens in your browser; Pro only relaxes limits and unlocks extra features like history.

How to use this tool

Load FFmpeg once (about 31 MB, cached by the browser). Then drag and drop one or more AVIF files (or click to select). The tool converts them to PNG and lets you download each result. No account required for free conversion.

Comparison with other tools: PrivacyConvert vs Convertio vs VERT.sh

Convertio and similar cloud converters upload your files to their servers. PrivacyConvert, like VERT.sh and localconvert.com, keeps everything client-side. Privacy first, no upload 2026: we never see your AVIF or PNG. We differentiate with clearer SEO, a modern stack, and a transparent Free vs Pro model so you know exactly what you get in 2026.

Technical note

This tool uses FFmpeg.wasm (version 0.12+) to decode AVIF and encode PNG. The work runs on the main thread (or worker when available). For very large images, conversion may take a few seconds. Your browser may ask for more memory; that’s normal for in-browser processing.

Summary

PrivacyConvert’s AVIF to PNG converter is free, runs 100% in your browser, and never uploads your files. Use it for quick, private conversions with no sign-up. For unlimited batch and more formats, consider Pro. 2026.
`.trim();

const WAV_SEO_CONTENT = `
WAV to MP3 Converter — No Upload, 100% Local (2026)

Convert WAV audio to MP3 in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg compiled to WebAssembly. Your audio files are never uploaded to any server. This no upload 2026, privacy-first approach ensures complete privacy for your recordings, podcasts, and music. Unlike Convertio and other cloud converters that upload your files to their servers, we keep everything in the browser — the same philosophy as VERT.sh and local client-side tools.

Why convert WAV to MP3 locally?

WAV is uncompressed and produces large files; MP3 is compressed and widely supported by phones, cars, and players. Converting WAV to MP3 saves storage and keeps compatibility everywhere. Doing it locally means your recordings never leave your computer — no cloud upload, no account, no privacy concerns. Many online converters require you to upload files to their servers; PrivacyConvert keeps everything in the browser. Privacy first: your audio is never sent to us or any third party.

How does local WAV to MP3 conversion work?

When you use this tool, the site loads FFmpeg (open-source media toolkit) as WebAssembly in your browser. Your WAV file stays on your device. The conversion runs in a sandbox in the tab. The resulting MP3 is generated in memory and offered for download. No data is sent to our servers. We use high-quality MP3 encoding (libmp3lame, quality 2, ~190 kbps VBR) so the output sounds great while staying smaller than WAV. No upload 2026: the entire pipeline is client-side.

Privacy and limits

We do not collect, store, or analyze your audio. Free users can convert one file at a time; Pro users get unlimited batch conversion. Same 100% local conversion for everyone — Pro only relaxes limits and adds features like history. To support development, you can upgrade via Buy Me a Coffee or PayPal. Comparison with Convertio and VERT.sh: Convertio uploads your WAV to their servers; VERT.sh and PrivacyConvert both run conversion in the browser. We offer a clear Free vs Pro model and more tools in one place for 2026.

How to use

Load FFmpeg once (about 31 MB, cached by the browser). Then drag and drop one or more WAV files (or click to select). The tool converts them to MP3 and lets you download each result. No account required for free conversion. No upload, privacy first, 2026.
`.trim();

const WEBP_SEO_CONTENT = `
WebP to PNG Converter — No Upload, 100% Local (2026)

Convert WebP images to PNG in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg (WebAssembly). Your files are never uploaded to any server. This no upload 2026, privacy-first approach keeps your images on your device. WebP is widely used on the web for smaller file sizes; PNG remains the standard for lossless images and broad compatibility. Converting WebP to PNG locally lets you use images in older software, editors, and print workflows without sending files to the cloud. Unlike Convertio and similar services that upload your WebP to their servers, we run FFmpeg in your browser — same idea as VERT.sh and other client-side converters.

Why use a local WebP to PNG converter?

WebP offers good compression and quality; PNG is lossless and has universal support. Converting to PNG helps when you need a format that works in every app. Doing it locally means sensitive or confidential images never leave your computer. Many cloud converters upload your files; PrivacyConvert keeps everything client-side. Privacy first: we never see your WebP or PNG data. Comparison vs Convertio and VERT.sh: Convertio uploads files to the cloud; VERT.sh and we keep conversion in the browser. We add a clear Free vs Pro model and more formats in one place for 2026.

How it works

Load FFmpeg once in your browser, then drag and drop WebP files. The tool converts them to PNG and lets you download the results. All processing happens in the tab; we do not receive or store your images. Free users can convert one file at a time; Pro users get unlimited batch. Same local conversion for everyone — no upload, no privacy risk. No upload 2026 guarantee.

Technical note

FFmpeg.wasm decodes WebP and encodes PNG entirely in memory. For large images, conversion may take a few seconds. Your files never leave your device. Privacy first, no server, no upload.
`.trim();

const MP4_SEO_CONTENT = `
MP4 to WebM Converter — No Upload, 100% Local (2026)

Convert MP4 video to WebM in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg (WebAssembly). Your video files are never uploaded. This no upload 2026, privacy-first approach keeps your footage on your device. WebM (VP9 video, Opus audio) is royalty-free and well-supported in modern browsers. Converting MP4 to WebM locally helps with web embedding and compatibility without sending video to third-party servers. Unlike Convertio and other cloud video converters that upload your MP4 to their servers, we run conversion in the browser — same philosophy as VERT.sh and client-side tools.

Why convert MP4 to WebM locally?

MP4 (H.264) is ubiquitous; WebM (VP9) is open and often smaller at similar quality. Converting to WebM is useful for web players and HTML5 video. Doing it locally means your footage never leaves your device — no cloud, no account, no privacy concerns. We use VP9 with CRF 30 and Opus audio for a good balance of size and quality. Privacy first: your video is never sent to us or any third party. Comparison vs Convertio and VERT.sh: Convertio uploads your MP4; VERT.sh and PrivacyConvert keep everything client-side. We offer a clear Free vs Pro model for 2026.

How it works

Load FFmpeg once in your browser, then drag and drop MP4 files. The tool converts them to WebM and lets you download the results. All processing happens in the tab; we do not receive or store your video. Free: one file at a time. Pro: unlimited batch. Same 100% local conversion for everyone. No upload 2026 guarantee. For large files, conversion may take a minute; progress is shown and everything stays in your browser. Privacy first, no server, no upload.
`.trim();

const PNG_SEO_CONTENT = `
PNG to JPEG Converter — No Upload, 100% Local (2026)

Convert PNG images to JPEG in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg compiled to WebAssembly. Your files are never uploaded to any server. This no upload 2026, privacy-first approach ensures complete privacy for screenshots, diagrams, and photos. Unlike Convertio and other cloud image converters that upload your PNG to their servers, we run FFmpeg in your browser — the same no-upload approach as VERT.sh and local client-side tools.

Why convert PNG to JPEG locally?

PNG is lossless and often large; JPEG is compressed and universally supported. Converting PNG to JPEG saves space and keeps compatibility with social media, email, and older apps. Doing it locally means your images never leave your computer — no cloud upload, no account, no privacy concerns. Many online converters require you to upload files to their servers; PrivacyConvert keeps everything in the browser. Privacy first: we never see your PNG or JPEG. Comparison vs Convertio and VERT.sh: Convertio uploads your files; VERT.sh and we keep conversion in the browser. We offer more tools and a clear Free vs Pro model for 2026.

How does local PNG to JPEG conversion work?

When you use this tool, the site loads FFmpeg (open-source media toolkit) as WebAssembly in your browser. Your PNG file stays on your device. The conversion runs in a sandbox in the tab. The resulting JPEG is generated in memory and offered for download. No data is sent to our servers. We use high quality (q:v 2) so the output looks great while staying smaller than PNG. No upload 2026: the entire pipeline is client-side.

Privacy and limits

We do not collect, store, or analyze your images. Free users can convert one file at a time; Pro users get unlimited batch conversion. Same 100% local conversion for everyone — Pro only relaxes limits and adds features like history. No upload guarantee. How to use: load FFmpeg once (about 31 MB, cached), then drag and drop PNG files or click to select. Download each JPEG with one click. No account required. Privacy first, 2026.
`.trim();

const OGG_SEO_CONTENT = `
OGG to MP3 Converter — No Upload, 100% Local (2026)

Convert OGG audio to MP3 in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg compiled to WebAssembly. Your audio files are never uploaded to any server. This no upload 2026, privacy-first approach ensures complete privacy for your music and recordings. Unlike Convertio and other cloud audio converters that upload your OGG to their servers, we keep everything in the browser — the same philosophy as VERT.sh and client-side converters.

Why convert OGG to MP3 locally?

OGG (Ogg Vorbis) is open and efficient; MP3 is the most widely supported format for players, phones, and cars. Converting OGG to MP3 lets you play files everywhere. Doing it locally means your audio never leaves your computer — no cloud upload, no account. Privacy first: we never see your OGG or MP3 data. Many online converters upload your OGG to their servers; PrivacyConvert keeps everything in the browser. Comparison vs Convertio and VERT.sh: Convertio uploads files to the cloud; VERT.sh and we run conversion in the browser. We offer a clear Free vs Pro model and more tools for 2026.

How does local OGG to MP3 conversion work?

When you use this tool, the site loads FFmpeg as WebAssembly in your browser. Your OGG file stays on your device. The conversion runs in the tab. The resulting MP3 is generated in memory and offered for download. We use libmp3lame quality 2 (~190 kbps VBR) for high-quality output. No data is sent to our servers. No upload 2026: the entire pipeline is client-side.

Privacy and limits

We do not collect, store, or analyze your audio. Free users can convert one file at a time; Pro users get unlimited batch. Same 100% local conversion for everyone. Upgrade via Pricing for batch and history. How to use: load FFmpeg once, then drag and drop OGG or OGA files (or click to select). Download each MP3 with one click. No account required. Privacy first, no upload, 2026.
`.trim();

const GIF_SEO_CONTENT = `
GIF to MP4 Converter — No Upload, 100% Local (2026)

Convert GIF animations to MP4 video in your browser with zero privacy risk. PrivacyConvert runs the conversion entirely on your device using FFmpeg (WebAssembly). Your GIF files are never uploaded. This no upload 2026, privacy-first approach keeps your clips on your device. MP4 is much smaller than GIF at similar quality and plays everywhere — converting locally keeps your clips private. Unlike Convertio and other cloud video converters that upload your GIF to their servers, we run conversion in the browser — same idea as VERT.sh and client-side tools.

Why convert GIF to MP4 locally?

GIF is large and limited to 256 colors; MP4 (H.264) is efficient and universal. Converting GIF to MP4 reduces file size and improves quality. Doing it locally means your animation never leaves your device — no cloud, no account. Privacy first: we never see your GIF or MP4. Cloud converters upload your GIF; PrivacyConvert keeps everything client-side. Comparison vs Convertio and VERT.sh: Convertio uploads files to the cloud; VERT.sh and PrivacyConvert keep conversion in the browser. We offer a clear Free vs Pro model for 2026.

How does local GIF to MP4 conversion work?

When you use this tool, the site loads FFmpeg as WebAssembly in your browser. Your GIF stays on your device. The conversion runs in the tab. We use H.264 with faststart and yuv420p for broad compatibility. The resulting MP4 is generated in memory and offered for download. No data is sent to our servers. No upload 2026: the entire pipeline is client-side.

Privacy and limits

We do not collect, store, or analyze your video. Free: one file at a time. Pro: unlimited batch. Same 100% local conversion for everyone. How to use: load FFmpeg once, then drag and drop GIF files (or click to select). The tool converts them to MP4 and lets you download each result. No account required. Privacy first, no upload, 2026.
`.trim();

const PDF_SEO_CONTENT = `
PDF to Images — No Upload, 100% Local (Pro, 2026)

Extract PDF pages as images in your browser with zero privacy risk. PrivacyConvert will run extraction entirely on your device — no upload, no server. This no upload 2026, privacy-first tool is available for Pro users; when you use it, your PDF never leaves your computer. Unlike most PDF tools (and cloud services like Convertio) that upload your file to their servers, we keep everything client-side. Same philosophy as VERT.sh and local-first converters: your documents stay on your device. Privacy first: we never see your PDF or extracted images.

Why extract PDF pages as images locally?

Useful for thumbnails, slides, or editing in image editors. Doing it locally keeps confidential documents private. No cloud upload, no account required for Pro users. Comparison vs Convertio and VERT.sh: Convertio and many PDF tools upload your file; VERT.sh and PrivacyConvert keep processing in the browser. We offer a clear Pro tier for PDF to Images and other advanced features in 2026.

How it will work

Load the converter once in your browser, then select your PDF. Pages are extracted as images (e.g. PNG or JPEG) in the tab. All processing happens on your device; we do not receive or store your PDF. Pro only; Free users can use our other image/audio/video tools with single-file conversion. No upload 2026 guarantee for all tools.

Privacy and Pro

We do not collect, store, or analyze your documents. PDF to Images is a Pro feature; other converters (AVIF, WAV, WebP, MP4, PNG, OGG, GIF) offer free single-file conversion. Same no-upload, privacy-first guarantee across all tools. 2026.
`.trim();

const PDF_DOCX_FAQ = [
  { q: "Is PDF to DOCX done locally?", a: "Yes. Text is extracted and the DOCX is built 100% in your browser. No upload, no server. 2026." },
  { q: "Do you store my PDF?", a: "No. We never receive your file. Conversion runs entirely in your browser. Privacy first." },
  { q: "How does it compare to Convertio?", a: "Cloud tools upload your PDF. We keep everything local — no upload, same as 200+ format tools on PrivacyConvert." },
  { q: "What about layout and images?", a: "This tool extracts text and builds a simple DOCX. Complex layout or images may need desktop software for best results." },
  { q: "Is it free?", a: "Yes. No account required. 100% local, no upload 2026." },
  { q: "What browsers work?", a: "Modern Chrome, Firefox, Edge, Safari. Uses pdfjs-dist and docx in the browser." },
  { q: "Can I convert multiple PDFs?", a: "One file at a time. Pro unlocks batch on other tools. This converter stays local for everyone." },
  { q: "Why privacy first?", a: "Your documents never leave your device. No upload 2026, part of 200+ format tools. Vs Convertio we never see your files." },
];
const PDF_EPUB_FAQ = [
  { q: "Is PDF to EPUB done locally?", a: "Yes. Text is extracted and EPUB is built 100% in your browser. No upload, no server. 2026." },
  { q: "Do you store my PDF?", a: "No. We never receive your file. Conversion runs entirely in your browser." },
  { q: "What quality is the EPUB?", a: "We extract text per page and build a valid EPUB. For complex PDFs, layout is simplified. 100% local." },
  { q: "How does it compare to cloud converters?", a: "Cloud tools upload your PDF. We keep everything local — no upload, privacy first. 200+ formats." },
  { q: "Is it free?", a: "Yes. No account required. 100% local, no upload 2026." },
  { q: "What browsers work?", a: "Modern Chrome, Firefox, Edge, Safari. Uses pdfjs-dist and JSZip in the browser." },
  { q: "Can I convert multiple PDFs?", a: "One file at a time. All processing stays in your browser." },
  { q: "Why use this vs Convertio?", a: "Convertio uploads your PDF. We run in the browser — no upload, privacy first. Part of 200+ format tools." },
];
const LENGTH_FAQ = [
  { q: "Is the length converter local?", a: "Yes. All conversions run 100% in your browser. No upload, no server. No upload 2026." },
  { q: "What units are supported?", a: "Meter, kilometer, centimeter, millimeter, foot, inch, mile, yard, nautical mile. All update in real time." },
  { q: "Do you store my input?", a: "No. Nothing is sent to any server. Privacy first converter, 100% local browser. 2026." },
  { q: "How does this compare to Convertio?", a: "We are a privacy first converter; unit tools run entirely in the browser. Part of 200+ format tools. Vs Convertio: no upload." },
  { q: "Can I copy or download results?", a: "Yes. Use Copy to clipboard or Download as text. All data stays on your device." },
  { q: "Is it free?", a: "Yes. No account. 100% local, no upload 2026." },
  { q: "What browsers work?", a: "Any modern browser. No special plugins. 100% local browser." },
  { q: "Why 200+ formats?", a: "PrivacyConvert offers 200+ format tools including document, image, audio, video, and units. All privacy first, no upload." },
];
const WEIGHT_FAQ = [
  { q: "Is the weight converter local?", a: "Yes. All conversions run 100% in your browser. No upload, no server. No upload 2026." },
  { q: "What units are supported?", a: "Kilogram, gram, pound, ounce, 市斤 (jin), milligram, metric ton, stone. Real-time conversion." },
  { q: "Do you store my input?", a: "No. Nothing is sent to any server. Privacy first, 100% local browser." },
  { q: "How does this compare to Convertio?", a: "Privacy first converter; unit tools run in the browser. Part of 200+ format tools. Vs Convertio: no upload." },
  { q: "Can I copy or download results?", a: "Yes. Copy or download as text. All data stays on your device." },
  { q: "Is it free?", a: "Yes. No account. 100% local, no upload 2026." },
  { q: "What browsers work?", a: "Any modern browser. 100% local browser." },
  { q: "Why use PrivacyConvert?", a: "No upload 2026, privacy first converter, 200+ formats. Your data never leaves your device." },
];
const TEMP_FAQ = [
  { q: "Is the temperature converter local?", a: "Yes. Celsius, Fahrenheit, and Kelvin convert 100% in your browser. No upload, no server. 2026." },
  { q: "What units are supported?", a: "Celsius (°C), Fahrenheit (°F), and Kelvin (K). Real-time bidirectional conversion." },
  { q: "Do you store my input?", a: "No. Nothing is sent to any server. Privacy first, 100% local browser." },
  { q: "How does this compare to Convertio?", a: "We are a privacy first converter; unit tools run in the browser. Part of 200+ formats. Vs Convertio: no upload." },
  { q: "Can I copy or download results?", a: "Yes. Copy or download as text. All data stays on your device." },
  { q: "Is it free?", a: "Yes. No account. 100% local, no upload 2026." },
  { q: "What browsers work?", a: "Any modern browser. 100% local." },
  { q: "Why 100% local?", a: "No upload 2026, privacy first. Your conversions never leave your device. 200+ format tools." },
];
const CURRENCY_FAQ = [
  { q: "Is the currency converter local?", a: "Rates are fetched from a free public API (Frankfurter); conversion math runs in your browser. We do not upload your amounts." },
  { q: "What currencies are supported?", a: "USD, EUR, GBP, CNY, JPY, CHF, CAD, AUD, INR, KRW. More can be added." },
  { q: "Do you store my amount?", a: "We do not send your amount to our servers. Only the browser fetches public exchange rates; conversion is local." },
  { q: "How does this compare to Convertio?", a: "We focus on privacy; rates come from a public API, conversion is local. Part of 200+ format tools. No upload of your data." },
  { q: "Are rates real-time?", a: "Rates are fetched when you change the base currency. Frankfurter provides daily rates. 100% local conversion after fetch." },
  { q: "Is it free?", a: "Yes. No account. Free API for rates; conversion in browser. 2026." },
  { q: "What browsers work?", a: "Any modern browser. Requires network for rate fetch; conversion itself is local." },
  { q: "Why privacy first?", a: "We don't receive your amounts. Rates are public; math is in your browser. No upload 2026." },
];
const DATA_STORAGE_FAQ = [
  { q: "Is the data storage converter local?", a: "Yes. Bytes, KB, MB, GB, TB, bits — all 100% in your browser. No upload, no server. 2026." },
  { q: "What units are supported?", a: "Byte, bit, kilobyte, megabyte, gigabyte, terabyte, petabyte, KiB, MiB, GiB. Real-time conversion." },
  { q: "Do you store my input?", a: "No. Nothing is sent to any server. Privacy first, 100% local browser." },
  { q: "How does this compare to Convertio?", a: "Privacy first converter; unit tools run in the browser. Part of 200+ format tools. Vs Convertio: no upload." },
  { q: "Can I copy or download results?", a: "Yes. Copy or download as text. All data stays on your device." },
  { q: "Is it free?", a: "Yes. No account. 100% local, no upload 2026." },
  { q: "What browsers work?", a: "Any modern browser. 100% local." },
  { q: "Why use this?", a: "No upload 2026, privacy first. 200+ formats. Your data never leaves your device." },
];
const TIME_FAQ = [
  { q: "Is the time converter local?", a: "Yes. Unix timestamp, seconds, minutes, hours, days, weeks, and ISO date — 100% in your browser. No upload. 2026." },
  { q: "What can I convert?", a: "Enter seconds or Unix timestamp; get equivalent in minutes, hours, days, weeks and ISO 8601 date. Real-time." },
  { q: "Do you store my input?", a: "No. Nothing is sent to any server. Privacy first, 100% local browser." },
  { q: "How does this compare to Convertio?", a: "We are a privacy first converter; unit tools run in the browser. Part of 200+ formats. Vs Convertio: no upload." },
  { q: "Can I copy or download results?", a: "Yes. Copy or download as text. All data stays on your device." },
  { q: "Is it free?", a: "Yes. No account. 100% local, no upload 2026." },
  { q: "What browsers work?", a: "Any modern browser. 100% local." },
  { q: "Why 100% local?", a: "No upload 2026, privacy first. 200+ format tools. Your data never leaves your device." },
];
const COOKING_FAQ = [
  { q: "Is the cooking units converter local?", a: "Yes. Cups, ml, tsp, tbsp, fl oz, grams — 100% in your browser. No upload, no server. 2026." },
  { q: "What units are supported?", a: "Milliliter, liter, US cup, tablespoon, teaspoon, fluid ounce, gram (water/sugar), ounce. Real-time conversion." },
  { q: "Do you store my input?", a: "No. Nothing is sent to any server. Privacy first, 100% local browser." },
  { q: "How does this compare to Convertio?", a: "Privacy first converter; unit tools run in the browser. Part of 200+ format tools. Vs Convertio: no upload." },
  { q: "Can I copy or download results?", a: "Yes. Copy or download as text. All data stays on your device." },
  { q: "Is it free?", a: "Yes. No account. 100% local, no upload 2026." },
  { q: "What browsers work?", a: "Any modern browser. 100% local." },
  { q: "Why use PrivacyConvert?", a: "No upload 2026, privacy first. 200+ formats. Your data never leaves your device." },
];

const FAQ_MAP: Record<string, { q: string; a: string }[]> = {
  "avif-to-png": AVIF_FAQ,
  "wav-to-mp3": WAV_FAQ,
  "webp-to-png": WEBP_FAQ,
  "mp4-to-webm": MP4_FAQ,
  "png-to-jpeg": PNG_FAQ,
  "ogg-to-mp3": OGG_FAQ,
  "gif-to-mp4": GIF_FAQ,
  "heif-to-jpg": HEIF_FAQ,
  "pdf-to-images": PDF_FAQ,
  "pdf-to-docx": PDF_DOCX_FAQ,
  "pdf-to-epub": PDF_EPUB_FAQ,
  "length-converter": LENGTH_FAQ,
  "weight-converter": WEIGHT_FAQ,
  "temperature-converter": TEMP_FAQ,
  "currency-converter": CURRENCY_FAQ,
  "data-storage-converter": DATA_STORAGE_FAQ,
  "time-converter": TIME_FAQ,
  "cooking-units-converter": COOKING_FAQ,
};

const HOWTO_STEPS = {
  "avif-to-png": [
    { name: "Load FFmpeg", text: "Click 'Load FFmpeg' to load the converter in your browser (one-time, ~31 MB, cached)." },
    { name: "Add files", text: "Drag and drop AVIF files or click to select. Free: 1 file; Pro: unlimited batch." },
    { name: "Convert", text: "Conversion runs locally. Progress is shown. No upload." },
    { name: "Download", text: "Download each PNG from the results. Files never leave your device." },
  ],
  "wav-to-mp3": [
    { name: "Choose MP3 bitrate", text: "Select 96, 128, 192, 256, or 320 kbps. Default 128 kbps; use 192–320 for higher quality." },
    { name: "Add WAV files", text: "Drag and drop WAV files or click to select. Free: 1 file; Pro: unlimited batch." },
    { name: "Convert", text: "Encoding runs in a Web Worker (LAME). No FFmpeg load; conversion is local. No upload." },
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
  "png-to-jpeg": [
    { name: "Load FFmpeg", text: "Click 'Load FFmpeg' to load the converter in your browser (one-time, ~31 MB, cached)." },
    { name: "Add PNG files", text: "Drag and drop PNG files or click to select. Free: 1 file; Pro: unlimited batch." },
    { name: "Convert", text: "Conversion runs locally. Progress is shown. No upload." },
    { name: "Download", text: "Download each JPEG. Files never leave your device." },
  ],
  "ogg-to-mp3": [
    { name: "Load FFmpeg", text: "Click 'Load FFmpeg' to load the converter in your browser." },
    { name: "Add OGG files", text: "Drag and drop OGG files or click to select. Free: 1 file; Pro: batch." },
    { name: "Convert and download", text: "Conversion runs locally. Download MP3. No upload." },
  ],
  "gif-to-mp4": [
    { name: "Load FFmpeg", text: "Click 'Load FFmpeg' to load the converter in your browser." },
    { name: "Add GIF files", text: "Drag and drop GIF files or click to select. Free: 1 file; Pro: batch." },
    { name: "Convert and download", text: "Conversion runs locally (H.264). Download MP4. No upload." },
  ],
  "heif-to-jpg": [
    { name: "Select or drop file", text: "Drag and drop a HEIC/HEIF file or click to select. Only one file at a time; the converter validates the format." },
    { name: "Click Convert to JPG", text: "The conversion library loads on demand (no upfront download). Conversion runs entirely in your browser." },
    { name: "Preview and download", text: "Preview the result and download JPG(s). Multi-image HEIC files produce multiple JPGs. Files never leave your device." },
  ],
  "pdf-to-images": [
    { name: "Pro feature", text: "PDF to Images is available for Pro users. Upgrade on the Pricing page." },
    { name: "Load converter", text: "When available, load the converter once in your browser." },
    { name: "Select PDF", text: "Select your PDF file. Pages will be extracted as images locally." },
    { name: "Download", text: "Download each page as image. No upload. 2026." },
  ],
  "pdf-to-docx": [
    { name: "Select PDF", text: "Drag and drop your PDF or click to select. File stays on your device." },
    { name: "Convert", text: "Text is extracted and DOCX is built 100% in your browser. No upload." },
    { name: "Download", text: "Download the DOCX file. Your PDF never left your device. 2026." },
  ],
  "pdf-to-epub": [
    { name: "Select PDF", text: "Drag and drop your PDF or click to select. File stays on your device." },
    { name: "Convert", text: "Text is extracted and EPUB is built 100% in your browser. No upload." },
    { name: "Download", text: "Download the EPUB file. Your PDF never left your device. 2026." },
  ],
  "length-converter": [
    { name: "Enter value", text: "Enter a number and select the unit (meter, foot, mile, etc.)." },
    { name: "View results", text: "All equivalent lengths update in real time. 100% local, no upload." },
    { name: "Copy or download", text: "Copy results to clipboard or download as text. No upload 2026." },
  ],
  "weight-converter": [
    { name: "Enter value", text: "Enter a number and select the unit (kg, lb, oz, 市斤, etc.)." },
    { name: "View results", text: "All equivalent weights update in real time. 100% local, no upload." },
    { name: "Copy or download", text: "Copy or download results. No upload 2026." },
  ],
  "temperature-converter": [
    { name: "Enter value", text: "Enter a number and select Celsius, Fahrenheit, or Kelvin." },
    { name: "View results", text: "All three units update in real time. 100% local, no upload." },
    { name: "Copy or download", text: "Copy or download results. No upload 2026." },
  ],
  "currency-converter": [
    { name: "Enter amount", text: "Enter amount and select from/to currencies. Rates fetched from free API." },
    { name: "View result", text: "Conversion uses rates then computed locally. We do not send your amount." },
    { name: "Copy or download", text: "Copy or download result. Privacy first, 2026." },
  ],
  "data-storage-converter": [
    { name: "Enter value", text: "Enter a number and select unit (byte, KB, MB, GB, bit, etc.)." },
    { name: "View results", text: "All equivalent storage sizes update in real time. 100% local, no upload." },
    { name: "Copy or download", text: "Copy or download results. No upload 2026." },
  ],
  "time-converter": [
    { name: "Enter value", text: "Enter seconds or Unix timestamp. Select input type." },
    { name: "View results", text: "Get seconds, minutes, hours, days, weeks and ISO date. 100% local, no upload." },
    { name: "Copy or download", text: "Copy or download results. No upload 2026." },
  ],
  "cooking-units-converter": [
    { name: "Enter value", text: "Enter a number and select unit (cup, ml, tsp, tbsp, etc.)." },
    { name: "View results", text: "All equivalent cooking units update in real time. 100% local, no upload." },
    { name: "Copy or download", text: "Copy or download results. No upload 2026." },
  ],
} as const;

export default async function ConvertPage({ params }: Props) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();

  const faqItems = FAQ_MAP[slug] ?? null;
  const steps = HOWTO_STEPS[slug as keyof typeof HOWTO_STEPS];
  const seoContent = getConvertSeoContent(slug);

  return (
    <ConvertPageLayout
      tool={{ name: tool.name, description: tool.description, slug: tool.slug }}
      converter={<ConversionUI slug={slug} />}
      faq={faqItems ?? undefined}
      howToSteps={steps ? steps.map((s) => ({ name: s.name, text: s.text })) : undefined}
      seoContent={seoContent ?? undefined}
    />
  );
}
