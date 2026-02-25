/**
 * PDF conversion via dynamic import of pdfjs-dist and jspdf (loaded only when user uses PDF tools).
 */

export type PdfToImagesResult = { name: string; blob: Blob }[];

/**
 * Extract each PDF page as a PNG image. Loads pdfjs-dist on first use.
 */
export async function convertPdfToImages(file: File): Promise<PdfToImagesResult> {
  const pdfjsLib = await import("pdfjs-dist");
  if (typeof window !== "undefined" && pdfjsLib.GlobalWorkerOptions.workerSrc === "") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
  const data = new Uint8Array(await file.arrayBuffer());
  const loading = pdfjsLib.getDocument({ data }).promise;
  const pdf = await loading;
  const numPages = pdf.numPages;
  const baseName = file.name.replace(/\.pdf$/i, "");
  const results: PdfToImagesResult = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2d not available");
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png", 1);
    });
    if (!blob) throw new Error("Page render failed");
    const name = numPages > 1 ? `${baseName}-${i}.png` : `${baseName}.png`;
    results.push({ name, blob });
  }
  pdf.destroy();
  return results;
}

/**
 * Combine image files into one PDF. Loads jspdf on first use.
 */
export async function convertImagesToPdf(files: File[]): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxW = pageW - 2 * margin;
  const maxH = pageH - 2 * margin;

  for (let i = 0; i < files.length; i++) {
    if (i > 0) doc.addPage();
    const file = files[i];
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
    const img = await loadImage(dataUrl);
    let w = img.width;
    let h = img.height;
    if (w > maxW || h > maxH) {
      const r = Math.min(maxW / w, maxH / h);
      w *= r;
      h *= r;
    }
    const x = margin + (maxW - w) / 2;
    const y = margin + (maxH - h) / 2;
    const format = file.type === "image/png" ? "PNG" : "JPEG";
    doc.addImage(dataUrl, format, x, y, w, h, undefined, "FAST");
  }

  return doc.output("blob");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
}
