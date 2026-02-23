export const TOOLS = [
  { slug: "avif-to-png", name: "AVIF to PNG", description: "Convert AVIF images to PNG in browser", category: "image", proOnly: false },
  { slug: "heif-to-jpg", name: "HEIF/HEIC to JPG", description: "Convert HEIF/HEIC images to JPG in browser", category: "image", proOnly: false },
  { slug: "wav-to-mp3", name: "WAV to MP3", description: "Convert WAV audio to MP3 locally", category: "audio", proOnly: false },
  { slug: "webp-to-png", name: "WebP to PNG", description: "Convert WebP to PNG without upload", category: "image", proOnly: false },
  { slug: "mp4-to-webm", name: "MP4 to WebM", description: "Convert MP4 video to WebM in browser", category: "video", proOnly: false },
  { slug: "png-to-jpeg", name: "PNG to JPEG", description: "Convert PNG to JPEG locally", category: "image", proOnly: false },
  { slug: "ogg-to-mp3", name: "OGG to MP3", description: "Convert OGG audio to MP3", category: "audio", proOnly: false },
  { slug: "gif-to-mp4", name: "GIF to MP4", description: "Convert GIF to MP4 video", category: "video", proOnly: false },
  { slug: "pdf-to-images", name: "PDF to Images", description: "Extract PDF pages as images (Pro)", category: "document", proOnly: true },
] as const;

export type ToolSlug = (typeof TOOLS)[number]["slug"];
