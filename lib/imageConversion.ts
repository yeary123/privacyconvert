/**
 * Browser-only image conversion via Canvas API.
 * No FFmpeg; no upload. Used for AVIF→PNG, WebP→PNG, PNG→JPEG.
 */

export type ImageOutputMime = "image/png" | "image/jpeg" | "image/webp";

/**
 * Converts a single image file to the target format using Canvas.
 * Creates object URL for Image, draws to canvas, exports as blob, revokes URL.
 */
export function convertImageFile(
  sourceFile: File,
  targetMime: ImageOutputMime,
  quality = 1.0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(sourceFile);
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas context failed"));
        return;
      }
      ctx.drawImage(img, 0, 0);

      const mime = targetMime;
      const qualityOption = mime === "image/jpeg" || mime === "image/webp" ? quality : undefined;

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error("Blob creation failed"));
        },
        mime,
        qualityOption
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };

    img.src = url;
  });
}

/** Default JPEG quality (0–1). */
export const DEFAULT_JPEG_QUALITY = 0.92;

/**
 * Resizes an image to exactly size×size pixels using center crop (cover).
 * Preserves aspect ratio; crops excess to fill the square.
 */
export function resizeImageToSquare(sourceFile: File, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(sourceFile);
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas context failed"));
        return;
      }
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const scale = Math.max(size / w, size / h);
      const sw = w * scale;
      const sh = h * scale;
      const sx = (sw - size) / 2;
      const sy = (sh - size) / 2;
      ctx.drawImage(img, -sx, -sy, sw, sh);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error("Blob creation failed"));
        },
        "image/png"
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };
    img.src = url;
  });
}

export function resizeImageTo1000x1000(sourceFile: File): Promise<Blob> {
  return resizeImageToSquare(sourceFile, 1000);
}

export function resizeImageTo1400x1400(sourceFile: File): Promise<Blob> {
  return resizeImageToSquare(sourceFile, 1400);
}

export function resizeImageTo3000x3000(sourceFile: File): Promise<Blob> {
  return resizeImageToSquare(sourceFile, 3000);
}
