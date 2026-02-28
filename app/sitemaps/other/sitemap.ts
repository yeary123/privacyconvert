import type { MetadataRoute } from "next";
import { getOtherTools, toolToSitemapEntry } from "@/lib/sitemapTools";

/**
 * Sitemap D: document, units, data, size, number tools. Submit last.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return getOtherTools().map((t) => toolToSitemapEntry(t.slug));
}
