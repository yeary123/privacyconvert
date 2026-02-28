import type { MetadataRoute } from "next";
import { getImageTools, toolToSitemapEntry } from "@/lib/sitemapTools";

/**
 * Sitemap B: all image conversion tools. Submit after Sitemap A is indexed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return getImageTools().map((t) => toolToSitemapEntry(t.slug));
}
