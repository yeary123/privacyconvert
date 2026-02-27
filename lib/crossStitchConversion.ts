/**
 * Convert image to cross-stitch style: reduce to grid + limited color palette.
 * Browser-only, Canvas API; no upload.
 */

const DEFAULT_GRID_SIZE = 80;
const PIXELS_PER_STITCH = 8;

/** Simple 16-color palette (RGB) for cross stitch. */
const PALETTE_16: [number, number, number][] = [
  [255, 255, 255], [0, 0, 0], [255, 0, 0], [0, 128, 0], [0, 0, 255],
  [255, 255, 0], [255, 128, 0], [128, 0, 128], [255, 192, 203], [165, 42, 42],
  [0, 255, 255], [128, 128, 128], [192, 192, 192], [255, 215, 0], [0, 255, 0],
  [128, 0, 0],
];

function dist2(a: [number, number, number], b: [number, number, number]): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

function nearestPaletteColor(r: number, g: number, b: number, palette: [number, number, number][]): [number, number, number] {
  let best = palette[0];
  let bestD = dist2([r, g, b], best);
  for (let i = 1; i < palette.length; i++) {
    const d = dist2([r, g, b], palette[i]);
    if (d < bestD) {
      bestD = d;
      best = palette[i];
    }
  }
  return best;
}

/**
 * Converts an image file to a cross-stitch pattern PNG: grid of limited colors.
 */
export function convertImageToCrossStitch(sourceFile: File, gridSize = DEFAULT_GRID_SIZE): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(sourceFile);
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function () {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const canvas = document.createElement("canvas");
      const outW = gridSize * PIXELS_PER_STITCH;
      const outH = gridSize * PIXELS_PER_STITCH;
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas context failed"));
        return;
      }
      const scaleW = w / gridSize;
      const scaleH = h / gridSize;
      const dataCanvas = document.createElement("canvas");
      dataCanvas.width = gridSize;
      dataCanvas.height = gridSize;
      const dataCtx = dataCanvas.getContext("2d");
      if (!dataCtx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas context failed"));
        return;
      }
      dataCtx.drawImage(img, 0, 0, w, h, 0, 0, gridSize, gridSize);
      const imageData = dataCtx.getImageData(0, 0, gridSize, gridSize);
      const data = imageData.data;
      for (let sy = 0; sy < gridSize; sy++) {
        for (let sx = 0; sx < gridSize; sx++) {
          const i = (sy * gridSize + sx) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const [nr, ng, nb] = nearestPaletteColor(r, g, b, PALETTE_16);
          ctx.fillStyle = `rgb(${nr},${ng},${nb})`;
          ctx.fillRect(sx * PIXELS_PER_STITCH, sy * PIXELS_PER_STITCH, PIXELS_PER_STITCH, PIXELS_PER_STITCH);
        }
      }
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
