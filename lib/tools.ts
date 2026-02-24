export const TOOLS = [
  // Image
  { slug: "avif-to-png", name: "AVIF to PNG", description: "Convert AVIF images to PNG in browser", category: "image", proOnly: false },
  { slug: "heif-to-jpg", name: "HEIF/HEIC to JPG", description: "Convert HEIF/HEIC images to JPG in browser", category: "image", proOnly: false },
  { slug: "webp-to-png", name: "WebP to PNG", description: "Convert WebP to PNG without upload", category: "image", proOnly: false },
  { slug: "png-to-jpeg", name: "PNG to JPEG", description: "Convert PNG to JPEG locally", category: "image", proOnly: false },
  { slug: "jpeg-to-png", name: "JPEG to PNG", description: "Convert JPEG images to PNG in browser", category: "image", proOnly: false },
  { slug: "png-to-webp", name: "PNG to WebP", description: "Convert PNG to WebP in browser", category: "image", proOnly: false },
  { slug: "webp-to-jpeg", name: "WebP to JPEG", description: "Convert WebP to JPEG locally", category: "image", proOnly: false },
  { slug: "jpeg-to-webp", name: "JPEG to WebP", description: "Convert JPEG to WebP in browser", category: "image", proOnly: false },
  { slug: "bmp-to-png", name: "BMP to PNG", description: "Convert BMP images to PNG in browser", category: "image", proOnly: false },
  // Audio
  { slug: "wav-to-mp3", name: "WAV to MP3", description: "Convert WAV audio to MP3 locally", category: "audio", proOnly: false },
  { slug: "ogg-to-mp3", name: "OGG to MP3", description: "Convert OGG audio to MP3", category: "audio", proOnly: false },
  { slug: "mp3-to-wav", name: "MP3 to WAV", description: "Convert MP3 to WAV audio in browser", category: "audio", proOnly: false },
  { slug: "flac-to-mp3", name: "FLAC to MP3", description: "Convert FLAC to MP3 in browser", category: "audio", proOnly: false },
  { slug: "m4a-to-mp3", name: "M4A to MP3", description: "Convert M4A to MP3 in browser", category: "audio", proOnly: false },
  { slug: "wav-to-ogg", name: "WAV to OGG", description: "Convert WAV to OGG in browser", category: "audio", proOnly: false },
  { slug: "aac-to-mp3", name: "AAC to MP3", description: "Convert AAC to MP3 in browser", category: "audio", proOnly: false },
  { slug: "ogg-to-wav", name: "OGG to WAV", description: "Convert OGG to WAV in browser", category: "audio", proOnly: false },
  { slug: "mp3-to-ogg", name: "MP3 to OGG", description: "Convert MP3 to OGG in browser", category: "audio", proOnly: false },
  // Video
  { slug: "mp4-to-webm", name: "MP4 to WebM", description: "Convert MP4 video to WebM in browser", category: "video", proOnly: false },
  { slug: "gif-to-mp4", name: "GIF to MP4", description: "Convert GIF to MP4 video", category: "video", proOnly: false },
  { slug: "webm-to-mp4", name: "WebM to MP4", description: "Convert WebM to MP4 in browser", category: "video", proOnly: false },
  { slug: "mov-to-mp4", name: "MOV to MP4", description: "Convert MOV to MP4 in browser", category: "video", proOnly: false },
  { slug: "mkv-to-mp4", name: "MKV to MP4", description: "Convert MKV to MP4 in browser", category: "video", proOnly: false },
  { slug: "avi-to-mp4", name: "AVI to MP4", description: "Convert AVI to MP4 in browser", category: "video", proOnly: false },
  { slug: "gif-to-webm", name: "GIF to WebM", description: "Convert GIF to WebM in browser", category: "video", proOnly: false },
  { slug: "mp4-to-gif", name: "MP4 to GIF", description: "Convert MP4 to GIF in browser", category: "video", proOnly: false },
  // Document
  { slug: "pdf-to-images", name: "PDF to Images", description: "Extract PDF pages as images (Pro)", category: "document", proOnly: true },
  { slug: "images-to-pdf", name: "Images to PDF", description: "Combine images into one PDF (Pro)", category: "document", proOnly: true },
] as const;

export type ToolSlug = (typeof TOOLS)[number]["slug"];
