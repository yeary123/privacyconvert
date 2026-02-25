/**
 * EPUB parsing and extraction (100% in browser).
 * Extracts book content as a single HTML file for use in Calibre to create MOBI/AZW3.
 */

export type EpubExtractResult = { blob: Blob; suggestedName: string; title?: string };

/**
 * Parse EPUB (ZIP), read OPF spine, and concatenate chapter XHTML into one HTML blob.
 * Output can be opened in Calibre and converted to MOBI or AZW3. 100% local.
 */
export async function extractEpubToHtml(file: File): Promise<EpubExtractResult> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const containerXml = await zip.file("META-INF/container.xml")?.async("string");
  if (!containerXml) throw new Error("Invalid EPUB: no container.xml");
  const opfPath = parseContainerForOpf(containerXml);
  if (!opfPath) throw new Error("Invalid EPUB: could not find OPF");
  const opfDir = opfPath.includes("/") ? opfPath.replace(/\/[^/]+$/, "/") : "";
  const opfContent = await zip.file(opfPath)?.async("string");
  if (!opfContent) throw new Error("Invalid EPUB: OPF not found");
  const { spineIds, title } = parseOpf(opfContent);
  const htmlParts: string[] = [];
  for (const id of spineIds) {
    const href = resolveHrefInOpf(opfContent, id);
    if (!href) continue;
    const fullPath = resolvePath(opfDir, href);
    const content = await zip.file(fullPath)?.async("string");
    if (content) {
      const bodyContent = extractBodyFromXhtml(content);
      if (bodyContent) htmlParts.push(`<div class="chapter">${bodyContent}</div>`);
    }
  }
  const fullHtml = `<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><meta charset="utf-8"/><title>${escapeHtml(title || "Extracted")}</title></head><body>${htmlParts.join("\n")}</body></html>`;
  const baseName = file.name.replace(/\.epub$/i, "");
  const suggestedName = `${baseName}-extracted.html`;
  return {
    blob: new Blob([fullHtml], { type: "text/html;charset=utf-8" }),
    suggestedName,
    title: title || undefined,
  };
}

function parseContainerForOpf(containerXml: string): string | null {
  const match = containerXml.match(/full-path=["']([^"']+\.opf)["']/i) ?? containerXml.match(/full-path=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function parseOpf(opfContent: string): { spineIds: string[]; title: string } {
  const spineIds: string[] = [];
  const itemRefs = opfContent.matchAll(/<itemref\s+idref=["']([^"']+)["']/gi);
  for (const m of itemRefs) spineIds.push(m[1]);
  const titleMatch = opfContent.match(/<dc:title[^>]*>([^<]+)</i) ?? opfContent.match(/<title[^>]*>([^<]+)</i);
  const title = titleMatch ? titleMatch[1].trim() : "";
  return { spineIds, title };
}

function resolveHrefInOpf(opfContent: string, id: string): string | null {
  const itemBlock = opfContent.match(new RegExp(`<item[^>]*id=["']${escapeRe(id)}["'][^>]*>`, "i"));
  if (!itemBlock) return null;
  const hrefMatch = itemBlock[0].match(/href=["']([^"']+)["']/i);
  return hrefMatch ? hrefMatch[1] : null;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolvePath(dir: string, href: string): string {
  const decoded = decodeURIComponent(href);
  if (decoded.startsWith("/")) return decoded.slice(1);
  if (!dir) return decoded;
  const parts = (dir + decoded).split("/").filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    if (p === "..") out.pop();
    else if (p !== ".") out.push(p);
  }
  return out.join("/");
}

function extractBodyFromXhtml(xhtml: string): string {
  const bodyMatch = xhtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();
  const bodyMatch2 = xhtml.match(/<body[^>]*>([\s\S]*)$/i);
  if (bodyMatch2) return bodyMatch2[1].trim();
  return xhtml;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
