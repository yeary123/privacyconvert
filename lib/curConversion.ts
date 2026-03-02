/**
 * Convert image (PNG/JPEG/WebP) to Windows CUR format in the browser.
 * CUR = ICO-type container with type 2 and hotspot in directory; image payload is PNG.
 */

/**
 * Build CUR file from image file: decode to canvas, export as PNG, wrap in CUR container.
 * Hotspot defaults to (0, 0). Use center for centered cursor: (width/2, height/2).
 */
export function convertImageToCur(
  sourceFile: File,
  options?: { hotspotX?: number; hotspotY?: number }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(sourceFile);
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function () {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const hotspotX = options?.hotspotX ?? 0;
      const hotspotY = options?.hotspotY ?? 0;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas context failed"));
        return;
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (pngBlob) => {
          URL.revokeObjectURL(url);
          if (!pngBlob) {
            reject(new Error("PNG export failed"));
            return;
          }
          pngBlob.arrayBuffer().then((pngBuf) => {
            const cur = buildCurFile(pngBuf, w, h, hotspotX, hotspotY);
            resolve(new Blob([cur], { type: "image/vnd.microsoft.cur" }));
          });
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

/** CUR: 6-byte header (type 2) + 16-byte directory + PNG payload. */
function buildCurFile(pngBuffer: ArrayBuffer, width: number, height: number, hotspotX: number, hotspotY: number): ArrayBuffer {
  const size = pngBuffer.byteLength;
  const offset = 6 + 16; // header + one directory entry
  const buf = new ArrayBuffer(offset + size);
  const view = new DataView(buf);
  let i = 0;

  // Header: reserved 0,0 | type 2 (CUR) | count 1
  view.setUint16(i, 0, true); i += 2;
  view.setUint16(i, 2, true); i += 2;   // type 2 = cursor
  view.setUint16(i, 1, true); i += 2;   // one image

  // Directory: width(1), height(1), colorCount(1), reserved(1), hotspotX(2), hotspotY(2), size(4), offset(4)
  view.setUint8(i++, width >= 256 ? 0 : width);
  view.setUint8(i++, height >= 256 ? 0 : height);
  view.setUint8(i++, 0);   // color count 0 = 256+
  view.setUint8(i++, 0);   // reserved
  view.setUint16(i, Math.max(0, Math.min(65535, hotspotX)), true); i += 2;
  view.setUint16(i, Math.max(0, Math.min(65535, hotspotY)), true); i += 2;
  view.setUint32(i, size, true); i += 4;
  view.setUint32(i, offset, true);

  // Append PNG after the buffer we just wrote
  const u8 = new Uint8Array(buf);
  u8.set(new Uint8Array(pngBuffer), offset);
  return buf;
}
