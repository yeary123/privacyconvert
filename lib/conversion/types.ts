import type { ToolSlug } from "@/lib/tools";

/** Options passed to the conversion service. */
export interface ConversionOptions {
  /** Progress callback (0–100). Used by FFmpeg-based and other tools that report progress. */
  onProgress?: (percent: number) => void;
}

/** Result of converting a single file to a single blob (used by most tools). */
export interface ConversionResult {
  blob: Blob;
  /** Suggested output filename (e.g. input.mp4 → output.webm). */
  suggestedName: string;
}

/** Converts one file to one blob. Used by the service registry. */
export type ConversionHandler = (
  file: File,
  options: ConversionOptions
) => Promise<ConversionResult>;

/** Slugs that use FFmpeg; UI should show "Load FFmpeg" before enabling convert. */
export const FFMPEG_TOOL_SLUGS: ToolSlug[] = [
  "ogg-to-mp3",
  "mp4-to-webm",
  "gif-to-mp4",
];

export function needsFFmpeg(slug: ToolSlug): boolean {
  return FFMPEG_TOOL_SLUGS.includes(slug);
}
