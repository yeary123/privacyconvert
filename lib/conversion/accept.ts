import type { ToolSlug } from "@/lib/tools";

/** Dropzone accept per tool: MIME -> extensions. */
export const CONVERT_ACCEPT: Partial<Record<ToolSlug, Record<string, string[]>>> = {
  "avif-to-png": { "image/avif": [".avif"] },
  "webp-to-png": { "image/webp": [".webp"] },
  "png-to-jpeg": { "image/png": [".png"] },
  "jpeg-to-png": { "image/jpeg": [".jpg", ".jpeg", ".jfif"] },
  "png-to-webp": { "image/png": [".png"] },
  "webp-to-jpeg": { "image/webp": [".webp"] },
  "jpeg-to-webp": { "image/jpeg": [".jpg", ".jpeg", ".jfif"] },
  "bmp-to-png": { "image/bmp": [".bmp"] },
  "wav-to-mp3": { "audio/wav": [".wav"], "audio/wave": [".wav"] },
  "ogg-to-mp3": { "audio/ogg": [".ogg", ".oga"] },
  "mp3-to-wav": { "audio/mpeg": [".mp3"] },
  "flac-to-mp3": { "audio/flac": [".flac"] },
  "m4a-to-mp3": { "audio/mp4": [".m4a"], "audio/x-m4a": [".m4a"] },
  "wav-to-ogg": { "audio/wav": [".wav"], "audio/wave": [".wav"] },
  "aac-to-mp3": { "audio/aac": [".aac"], "audio/mp4": [".aac"] },
  "ogg-to-wav": { "audio/ogg": [".ogg", ".oga"] },
  "mp3-to-ogg": { "audio/mpeg": [".mp3"] },
  "mp4-to-webm": { "video/mp4": [".mp4"] },
  "gif-to-mp4": { "image/gif": [".gif"] },
  "webm-to-mp4": { "video/webm": [".webm"] },
  "mov-to-mp4": { "video/quicktime": [".mov"], "video/mp4": [".mov"] },
  "mkv-to-mp4": { "video/x-matroska": [".mkv"] },
  "avi-to-mp4": { "video/x-msvideo": [".avi"], "video/avi": [".avi"] },
  "gif-to-webm": { "image/gif": [".gif"] },
  "mp4-to-gif": { "video/mp4": [".mp4"] },
};

export function getAccept(slug: ToolSlug): Record<string, string[]> | undefined {
  return CONVERT_ACCEPT[slug];
}
