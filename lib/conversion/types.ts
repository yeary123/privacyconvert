import type { ToolSlug } from "@/lib/tools";

/** Options passed to the conversion service. */
export interface ConversionOptions {
  /** Progress callback (0–100). Used by FFmpeg-based and other tools that report progress. */
  onProgress?: (percent: number) => void;
  /** MP3 bitrate in kbps for WAV→MP3 (lamejs). Allowed: 96, 128, 192, 256, 320. Default 128. */
  mp3Kbps?: number;
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
  "ogg-to-mp3", "flac-to-mp3", "m4a-to-mp3", "wav-to-ogg", "aac-to-mp3", "mp3-to-ogg",
  "wav-to-flac", "wav-to-m4a", "wav-to-aac", "wav-to-opus", "wav-to-wma", "wav-to-aiff",
  "mp3-to-flac", "mp3-to-m4a", "mp3-to-aac", "mp3-to-opus", "mp3-to-wma", "mp3-to-aiff",
  "ogg-to-flac", "ogg-to-m4a", "ogg-to-aac", "ogg-to-opus", "ogg-to-wma", "ogg-to-aiff",
  "flac-to-wav", "flac-to-ogg", "flac-to-m4a", "flac-to-aac", "flac-to-opus", "flac-to-wma", "flac-to-aiff",
  "m4a-to-ogg", "m4a-to-flac", "m4a-to-aac", "m4a-to-opus", "m4a-to-wma", "m4a-to-aiff",
  "aac-to-ogg", "aac-to-flac", "aac-to-m4a", "aac-to-opus", "aac-to-wma", "aac-to-aiff",
  "opus-to-wav", "opus-to-mp3", "opus-to-ogg", "opus-to-flac", "opus-to-m4a", "opus-to-aac", "opus-to-wma", "opus-to-aiff",
  "wma-to-wav", "wma-to-mp3", "wma-to-ogg", "wma-to-flac", "wma-to-m4a", "wma-to-aac", "wma-to-opus", "wma-to-aiff",
  "aiff-to-wav", "aiff-to-mp3", "aiff-to-ogg", "aiff-to-flac", "aiff-to-m4a", "aiff-to-aac", "aiff-to-opus", "aiff-to-wma",
  "mp4-to-webm", "mp4-to-mov", "mp4-to-mkv", "mp4-to-avi", "mp4-to-gif", "mp4-to-flv", "mp4-to-wmv", "mp4-to-m4v", "mp4-to-ogv", "mp4-to-3gp",
  "webm-to-mp4", "webm-to-mov", "webm-to-mkv", "webm-to-avi", "webm-to-gif", "webm-to-flv", "webm-to-wmv", "webm-to-m4v", "webm-to-ogv", "webm-to-3gp",
  "mov-to-mp4", "mov-to-webm", "mov-to-mkv", "mov-to-avi", "mov-to-gif", "mov-to-flv", "mov-to-wmv", "mov-to-m4v", "mov-to-ogv", "mov-to-3gp",
  "mkv-to-mp4", "mkv-to-webm", "mkv-to-mov", "mkv-to-avi", "mkv-to-gif", "mkv-to-flv", "mkv-to-wmv", "mkv-to-m4v", "mkv-to-ogv", "mkv-to-3gp",
  "avi-to-mp4", "avi-to-webm", "avi-to-mov", "avi-to-mkv", "avi-to-gif", "avi-to-flv", "avi-to-wmv", "avi-to-m4v", "avi-to-ogv", "avi-to-3gp",
  "gif-to-mp4", "gif-to-webm", "gif-to-mov", "gif-to-mkv", "gif-to-avi", "gif-to-flv", "gif-to-wmv", "gif-to-m4v", "gif-to-ogv", "gif-to-3gp",
  "flv-to-mp4", "flv-to-webm", "flv-to-mov", "flv-to-mkv", "flv-to-avi", "flv-to-gif", "flv-to-wmv", "flv-to-m4v", "flv-to-ogv", "flv-to-3gp",
  "wmv-to-mp4", "wmv-to-webm", "wmv-to-mov", "wmv-to-mkv", "wmv-to-avi", "wmv-to-gif", "wmv-to-flv", "wmv-to-m4v", "wmv-to-ogv", "wmv-to-3gp",
  "m4v-to-mp4", "m4v-to-webm", "m4v-to-mov", "m4v-to-mkv", "m4v-to-avi", "m4v-to-gif", "m4v-to-flv", "m4v-to-wmv", "m4v-to-ogv", "m4v-to-3gp",
  "ogv-to-mp4", "ogv-to-webm", "ogv-to-mov", "ogv-to-mkv", "ogv-to-avi", "ogv-to-gif", "ogv-to-flv", "ogv-to-wmv", "ogv-to-m4v", "ogv-to-3gp",
  "3gp-to-mp4", "3gp-to-webm", "3gp-to-mov", "3gp-to-mkv", "3gp-to-avi", "3gp-to-gif", "3gp-to-flv", "3gp-to-wmv", "3gp-to-m4v", "3gp-to-ogv",
];

export function needsFFmpeg(slug: ToolSlug): boolean {
  return FFMPEG_TOOL_SLUGS.includes(slug);
}
