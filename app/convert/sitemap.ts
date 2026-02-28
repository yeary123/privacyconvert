import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.privacyconvert.online";

/**
 * Sitemap for all /convert/[slug] tool pages.
 * Submit this to GSC after the root sitemap is indexed, to avoid flooding crawl budget on a new domain.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return TOOLS.map((t) => ({
    url: `${BASE}/convert/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}
