/**
 * MOBI to EPUB: parse MOBI in browser, build EPUB (ZIP). 100% local.
 * Uses @lingo-reader/mobi-parser for MOBI/KF8 (AZW3) parsing.
 */

export async function convertMobiToEpub(file: File): Promise<{ blob: Blob; suggestedName: string }> {
  const { initMobiFile, initKf8File } = await import("@lingo-reader/mobi-parser");
  const buf = new Uint8Array(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  const isKf8 = name.endsWith(".azw3") || name.endsWith(".kf8");
  const mobi = isKf8 ? await initKf8File(buf) : await initMobiFile(buf);
  try {
    const spine = mobi.getSpine();
    const metadata = mobi.getMetadata();
    const title = metadata?.title?.trim() || file.name.replace(/\.(mobi|azw3|kf8)$/i, "") || "MOBI to EPUB";
    const author = Array.isArray(metadata?.author) ? metadata.author.join(", ") : metadata?.author || "";
    const lang = metadata?.language?.trim() || "en";

    const chapterHtmls: string[] = [];
    if (spine.length > 0) {
      for (let i = 0; i < spine.length; i++) {
        const ch = mobi.loadChapter(spine[i].id);
        let html = ch?.html ?? "";
        html = stripBlobUrls(html);
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1].trim() : html;
        chapterHtmls.push(bodyContent || " ");
      }
    }
    if (chapterHtmls.length === 0) chapterHtmls.push("<p>No chapters found.</p>");

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
    zip.file(
      "META-INF/container.xml",
      `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`
    );

    const itemRefs = chapterHtmls.map((_, i) => `    <itemref idref="ch${i + 1}"/>`).join("\n");
    const manifestItems = [
      '    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
      ...chapterHtmls.map((_, i) => `    <item id="ch${i + 1}" href="ch${i + 1}.xhtml" media-type="application/xhtml+xml"/>`),
    ].join("\n");

    const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">mobi2epub-${Date.now()}</dc:identifier>
    <dc:title>${escapeXml(title)}</dc:title>
    ${author ? `<dc:creator>${escapeXml(author)}</dc:creator>` : ""}
    <dc:language>${escapeXml(lang)}</dc:language>
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
      `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc"><ol>${chapterHtmls.map((_, i) => `<li><a href="ch${i + 1}.xhtml">Chapter ${i + 1}</a></li>`).join("")}</ol></nav></body></html>`
    );

    chapterHtmls.forEach((bodyContent, i) => {
      zip.file(
        `OEBPS/ch${i + 1}.xhtml`,
        `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Chapter ${i + 1}</title></head><body>${bodyContent || " "}</body></html>`
      );
    });

    const blob = await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
    const baseName = file.name.replace(/\.(mobi|azw3|kf8)$/i, "");
    return { blob, suggestedName: `${baseName}.epub` };
  } finally {
    if (typeof mobi.destroy === "function") mobi.destroy();
  }
}

function stripBlobUrls(html: string): string {
  return html.replace(/href=["']blob:[^"']+["']/gi, 'href="#"');
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
