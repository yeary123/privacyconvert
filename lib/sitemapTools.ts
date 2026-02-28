import { TOOLS } from "@/lib/tools";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.privacyconvert.online";

/** Slugs that have FAQ and/or long-form SEO content. Submit these first (Sitemap A). */
export const PRIORITY_TOOL_SLUGS = [
  "avif-to-png",
  "wav-to-mp3",
  "webp-to-png",
  "mp4-to-webm",
  "png-to-jpeg",
  "ogg-to-mp3",
  "gif-to-mp4",
  "heif-to-jpg",
  "pdf-to-images",
  "pdf-to-docx",
  "pdf-to-epub",
  "length-converter",
  "weight-converter",
  "temperature-converter",
  "currency-converter",
  "data-storage-converter",
  "time-converter",
  "cooking-units-converter",
  "base-converter",
  "roman-numeral-converter",
  "binary-to-decimal",
  "decimal-to-binary",
  "binary-to-octal",
  "octal-to-binary",
  "binary-to-hex",
  "hex-to-binary",
  "decimal-to-octal",
  "octal-to-decimal",
  "decimal-to-hex",
  "hex-to-decimal",
  "octal-to-hex",
  "hex-to-octal",
  // Additional high-value tools to reach ~50
  "webp-to-jpeg",
  "jpeg-to-png",
  "flac-to-mp3",
  "m4a-to-mp3",
  "mp3-to-wav",
  "html-to-pdf",
  "merge-pdfs",
  "split-pdf",
  "area-converter",
  "volume-converter",
  "speed-converter",
  "image-to-1000x1000",
] as const;

const prioritySet = new Set(PRIORITY_TOOL_SLUGS);

export function getPriorityTools() {
  return TOOLS.filter((t) => prioritySet.has(t.slug as (typeof PRIORITY_TOOL_SLUGS)[number]));
}

export function getImageTools() {
  return TOOLS.filter((t) => t.category === "image");
}

export function getMediaTools() {
  return TOOLS.filter((t) => t.category === "audio" || t.category === "video");
}

export function getOtherTools() {
  return TOOLS.filter(
    (t) =>
      t.category === "document" ||
      t.category === "units" ||
      t.category === "data" ||
      t.category === "size" ||
      t.category === "number"
  );
}

export function toolToSitemapEntry(slug: string) {
  return {
    url: `${BASE}/convert/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  };
}
