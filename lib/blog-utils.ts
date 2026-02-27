/** Client-safe blog helpers (no Node.js fs). */

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  description?: string;
  readingTime?: string;
  /** Optional cover image URL from frontmatter. */
  cover?: string;
  /** When true, post footer shows "Upgrade to Pro" instead of "Explore tools". */
  proCta?: boolean;
};

/** Cover image URL for list cards. Use frontmatter `cover` when set; otherwise a per-slug placeholder so cards don't all look the same. */
export function getPostCoverUrl(slug: string): string {
  const text = slug.replace(/-/g, " ").slice(0, 24);
  return `https://placehold.co/800x450/1a1a2e/94a3b8?text=${encodeURIComponent(text)}`;
}
