import type { MetadataRoute } from "next";
import { getMediaTools, toolToSitemapEntry } from "@/lib/sitemapTools";

/**
 * Sitemap C: all audio and video conversion tools. Submit after B.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return getMediaTools().map((t) => toolToSitemapEntry(t.slug));
}
