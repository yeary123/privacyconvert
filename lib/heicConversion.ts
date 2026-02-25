/**
 * HEIC/HEIF conversion via heic2any (dynamic import).
 * Blob → heic2any → Blob | Blob[]; we convert to Data URLs for preview/download.
 * Supports output: image/jpeg, image/png, image/gif.
 */

const HEIC_EXT = /\.(heic|heif)$/i;
const DEFAULT_JPG_QUALITY = 0.92;

export type HeicOutputType = "image/jpeg" | "image/png" | "image/gif";

export function isHeicFile(file: File): boolean {
  return HEIC_EXT.test(file.name) || file.type === "image/heic" || file.type === "image/heif";
}

export function heicToJpgFileName(fileName: string, index?: number): string {
  return heicOutputFileName(fileName, "image/jpeg", index);
}

/** Output file name for HEIC conversion (extension from toType). */
export function heicOutputFileName(
  fileName: string,
  toType: HeicOutputType,
  index?: number
): string {
  const base = fileName.replace(HEIC_EXT, "");
  const ext = toType === "image/jpeg" ? ".jpg" : toType === "image/png" ? ".png" : ".gif";
  return index !== undefined ? `${base}-${index + 1}${ext}` : `${base}${ext}`;
}

export const DEFAULT_QUALITY = DEFAULT_JPG_QUALITY;

/** Convert a Blob to Data URL. */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Run heic2any (must be dynamically imported in browser).
 * toType: "image/jpeg" | "image/png" | "image/gif". Quality only used for JPEG.
 * Returns array of { name, dataUrl } for Blob or Blob[].
 */
export async function convertHeicTo(
  blob: Blob,
  baseName: string,
  toType: HeicOutputType,
  quality: number = DEFAULT_JPG_QUALITY
): Promise<{ name: string; dataUrl: string }[]> {
  const heic2any = (await import("heic2any")).default as (opts: {
    blob: Blob;
    toType: string;
    quality?: number;
  }) => Promise<Blob | Blob[]>;

  const result = await heic2any({
    blob,
    toType,
    ...(toType === "image/jpeg" ? { quality } : {}),
  });

  const blobs = Array.isArray(result) ? result : [result];
  const items: { name: string; dataUrl: string }[] = [];

  for (let i = 0; i < blobs.length; i++) {
    const dataUrl = await blobToDataUrl(blobs[i]);
    items.push({
      name: heicOutputFileName(baseName, toType, blobs.length > 1 ? i : undefined),
      dataUrl,
    });
  }

  return items;
}

/** HEIC → JPEG (convenience wrapper). */
export async function convertHeicToJpeg(
  blob: Blob,
  baseName: string,
  quality: number = DEFAULT_JPG_QUALITY
): Promise<{ name: string; dataUrl: string }[]> {
  return convertHeicTo(blob, baseName, "image/jpeg", quality);
}
