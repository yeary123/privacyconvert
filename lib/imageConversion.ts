/**
 * Browser-only image conversion via Canvas API.
 * No FFmpeg; no upload. Used for AVIF→PNG, WebP→PNG, PNG→JPEG.
 */

export type ImageOutputMime = "image/png" | "image/jpeg";

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
      const qualityOption = mime === "image/jpeg" ? quality : undefined;

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
