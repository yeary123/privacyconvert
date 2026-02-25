import type { FAQItem } from "./schema";

export const TOOLS_FAQ: FAQItem[] = [
  {
    q: "Are these tools really free?",
    a: "Yes. Every tool (AVIF to PNG, WAV to MP3, WebP to PNG, MP4 to WebM, PNG to JPEG, OGG to MP3, GIF to MP4) offers free single-file conversion with no account. PDF to Images is Pro-only. Pro unlocks unlimited batch conversion.",
  },
  {
    q: "Do my files get uploaded to your server?",
    a: "No. All conversion runs in your browser using FFmpeg.wasm. Your files never leave your device. No upload, zero privacy risk. 2026.",
  },
  {
    q: "How is PrivacyConvert different from Convertio or VERT.sh?",
    a: "Convertio uploads files to their servers. VERT.sh and PrivacyConvert both run conversion in the browser. We offer more tools in one place, clear Free vs Pro limits, and a privacy-first, no upload 2026 approach.",
  },
  {
    q: "What file formats are supported?",
    a: "Image: AVIF, WebP, PNG, JPEG. Audio: WAV, MP3, OGG. Video: MP4, WebM, GIF. Document: PDF to Images (Pro). All conversion is client-side.",
  },
  {
    q: "Can I convert multiple files at once?",
    a: "Free users can convert one file at a time per tool. Pro users get unlimited batch conversion. All processing still happens in your browser.",
  },
  {
    q: "Do I need an account?",
    a: "No account is required for free conversion. Use any tool immediately. Pro features can be unlocked via Pricing (PayPal or Buy Me a Coffee).",
  },
  {
    q: "Which tools are Pro-only?",
    a: "PDF to Images is Pro-only. All other tools have free single-file conversion. Same no-upload, privacy-first guarantee for everyone. 2026.",
  },
];
