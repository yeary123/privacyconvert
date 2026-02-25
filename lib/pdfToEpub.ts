/**
 * PDF to EPUB: extract text from PDF in browser, build EPUB (ZIP). 100% local.
 */

export async function convertPdfToEpub(file: File): Promise<{ blob: Blob; suggestedName: string }> {
  const pdfjsLib = await import("pdfjs-dist");
  if (typeof window !== "undefined" && (pdfjsLib.GlobalWorkerOptions as { workerSrc?: string }).workerSrc === "") {
    (pdfjsLib.GlobalWorkerOptions as { workerSrc: string }).workerSrc = `https://unpkg.com/pdfjs-dist@${(pdfjsLib as { version?: string }).version || "3"}/build/pdf.worker.min.mjs`;
  }
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const numPages = pdf.numPages;
  const pageTexts: string[] = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const parts = textContent.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    pageTexts.push(escapeXml(parts.trim()));
  }
  pdf.destroy();
  const title = pageTexts[0]?.slice(0, 100) || "PDF to EPUB";
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file(
    "META-INF/container.xml",
    `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`
  );
  const itemRefs = pageTexts.map((_, i) => `    <itemref idref="ch${i + 1}"/>`).join("\n");
  const manifestItems = [
    '    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
    ...pageTexts.map((_, i) => `    <item id="ch${i + 1}" href="ch${i + 1}.xhtml" media-type="application/xhtml+xml"/>`),
  ].join("\n");
  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">pdf2epub-${Date.now()}</dc:identifier>
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:language>en</dc:language>
  </metadata>
  <manifest>
${manifestItems}
  </manifest>
  <spine>
${itemRefs}
  </spine>
</package>`;
  zip.file("OEBPS/content.opf", opf);
  zip.file(
    "OEBPS/nav.xhtml",
    `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc"><ol>${pageTexts.map((_, i) => `<li><a href="ch${i + 1}.xhtml">Page ${i + 1}</a></li>`).join("")}</ol></nav></body></html>`
  );
  pageTexts.forEach((text, i) => {
    zip.file(
      `OEBPS/ch${i + 1}.xhtml`,
      `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Page ${i + 1}</title></head><body><p>${text || " "}</p></body></html>`
    );
  });
  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
  const baseName = file.name.replace(/\.pdf$/i, "");
  return { blob, suggestedName: `${baseName}.epub` };
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
