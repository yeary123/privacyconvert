import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { getPriorityTools, toolToSitemapEntry } from "@/lib/sitemapTools";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.privacyconvert.online";

/**
 * Sitemap A: core pages + blog + ~50 priority tools (with FAQ/long content).
 * Submit this first to GSC. Then submit B/C/D from /sitemaps/image, /sitemaps/media, /sitemaps/other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/history`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  const posts = getPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const priorityTools = getPriorityTools().map((t) => toolToSitemapEntry(t.slug));

  return [...staticPages, ...blogPages, ...priorityTools];
}
