/**
 * Document conversion helpers (HTML→PDF, PDF merge/split, DOCX→HTML, DOCX generation).
 * All libraries are loaded via dynamic import so they only run when the user uses these tools.
 */

export type DocxToHtmlResult = { html: string; messages: Array<{ type: string; message: string }> };

export type SplitPdfResult = { name: string; blob: Blob }[];

/**
 * Render an HTML element to a single-page PDF. Loads html2canvas + jspdf on first use.
 * Best for one-page content; for long content consider splitting or using multiple pages.
 */
export async function convertHtmlToPdf(
  element: HTMLElement,
  options?: { filename?: string; scale?: number }
): Promise<Blob> {
  const [html2canvas, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);
  const scale = options?.scale ?? 2;
  const canvas = await html2canvas.default(element, {
    scale,
    useCORS: true,
    logging: false,
    allowTaint: true,
  });
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const w = canvas.width;
  const h = canvas.height;
  const doc = new jsPDF({
    orientation: w > h ? "landscape" : "portrait",
    unit: "px",
    format: [w, h],
  });
  doc.addImage(imgData, "JPEG", 0, 0, w, h, undefined, "FAST");
  return doc.output("blob");
}

/**
 * Merge multiple PDF files into one. Loads pdf-lib on first use.
 */
export async function mergePdfs(files: File[]): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const src = await PDFDocument.load(bytes);
    const indices = src.getPageIndices();
    const copied = await merged.copyPages(src, indices);
    copied.forEach((page) => merged.addPage(page));
  }
  const bytes = await merged.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

/**
 * Split a PDF into one file per page. Loads pdf-lib on first use.
 */
export async function splitPdfToPdfs(file: File): Promise<SplitPdfResult> {
  const { PDFDocument } = await import("pdf-lib");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const src = await PDFDocument.load(bytes);
  const numPages = src.getPageCount();
  const baseName = file.name.replace(/\.pdf$/i, "");
  const results: SplitPdfResult = [];
  for (let i = 0; i < numPages; i++) {
    const doc = await PDFDocument.create();
    const [page] = await doc.copyPages(src, [i]);
    doc.addPage(page);
    const bytes = await doc.save();
    const name = numPages > 1 ? `${baseName}-page-${i + 1}.pdf` : `${baseName}.pdf`;
    results.push({
      name,
      blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    });
  }
  return results;
}

/**
 * Convert a DOCX file to HTML. Loads mammoth on first use.
 */
export async function convertDocxToHtml(file: File): Promise<DocxToHtmlResult> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.default.convertToHtml({ arrayBuffer });
  const messages = (result.messages ?? []).map((m) => ({
    type: m.type ?? "info",
    message: "message" in m ? String(m.message) : "",
  }));
  return { html: result.value, messages };
}

/**
 * Generate a simple .docx from a title and paragraph strings. Loads docx on first use.
 * For custom layout (tables, styles, etc.) use the docx package directly and Packer.toBlob(doc).
 */
export async function generateSimpleDocx(
  title: string,
  paragraphs: string[]
): Promise<Blob> {
  const docx = await import("docx");
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;
  const children = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
    }),
    ...paragraphs.flatMap((text) => [
      new Paragraph({
        children: [new TextRun({ text })],
        spacing: { after: 100 },
      }),
    ]),
  ];
  const doc = new Document({
    sections: [{ children }],
  });
  return Packer.toBlob(doc);
}
