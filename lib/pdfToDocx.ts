/**
 * PDF to DOCX: extract text from PDF in browser, build DOCX. 100% local.
 */

export async function convertPdfToDocx(file: File): Promise<{ blob: Blob; suggestedName: string }> {
  const pdfjsLib = await import("pdfjs-dist");
  if (typeof window !== "undefined" && (pdfjsLib.GlobalWorkerOptions as { workerSrc?: string }).workerSrc === "") {
    (pdfjsLib.GlobalWorkerOptions as { workerSrc: string }).workerSrc = `https://unpkg.com/pdfjs-dist@${(pdfjsLib as { version?: string }).version || "3"}/build/pdf.worker.min.mjs`;
  }
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const numPages = pdf.numPages;
  const paragraphs: string[] = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const lines = new Map<number, string[]>();
    for (const item of textContent.items) {
      if (!("str" in item)) continue;
      const y = "transform" in item && Array.isArray(item.transform) ? item.transform[5] : 0;
      const key = Math.round(Number(y));
      if (!lines.has(key)) lines.set(key, []);
      lines.get(key)!.push(item.str);
    }
    const lineKeys = Array.from(lines.keys()).sort((a, b) => b - a);
    for (const k of lineKeys) {
      const parts = lines.get(k) || [];
      paragraphs.push(parts.join(" ").trim());
    }
    if (paragraphs.length > 0 && paragraphs[paragraphs.length - 1] !== "") {
      paragraphs.push("");
    }
  }
  const trimmed = paragraphs.filter((p) => p.length > 0);
  const title = trimmed[0]?.slice(0, 200) || "PDF Export";
  const body = trimmed.length > 1 ? trimmed.slice(1) : trimmed;
  const { generateSimpleDocx } = await import("./documentConversion");
  const blob = await generateSimpleDocx(title, body);
  const baseName = file.name.replace(/\.pdf$/i, "");
  return {
    blob,
    suggestedName: `${baseName}.docx`,
  };
}
