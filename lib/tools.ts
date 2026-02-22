export const TOOLS = [
  { slug: "avif-to-png", name: "AVIF to PNG", description: "Convert AVIF images to PNG in browser", category: "image" },
  { slug: "wav-to-mp3", name: "WAV to MP3", description: "Convert WAV audio to MP3 locally", category: "audio" },
  { slug: "webp-to-png", name: "WebP to PNG", description: "Convert WebP to PNG without upload", category: "image" },
  { slug: "mp4-to-webm", name: "MP4 to WebM", description: "Convert MP4 video to WebM in browser", category: "video" },
  { slug: "png-to-jpeg", name: "PNG to JPEG", description: "Convert PNG to JPEG locally", category: "image" },
  { slug: "ogg-to-mp3", name: "OGG to MP3", description: "Convert OGG audio to MP3", category: "audio" },
  { slug: "gif-to-mp4", name: "GIF to MP4", description: "Convert GIF to MP4 video", category: "video" },
  { slug: "pdf-to-images", name: "PDF to Images", description: "Extract PDF pages as images (Pro)", category: "document" },
] as const;

export type ToolSlug = (typeof TOOLS)[number]["slug"];
