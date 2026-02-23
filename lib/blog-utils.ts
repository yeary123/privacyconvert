/** Client-safe blog helpers (no Node.js fs). */

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  description?: string;
  readingTime?: string;
};

/** Stable cover image URL for list cards (derived from slug). */
export function getPostCoverUrl(slug: string): string {
  let n = 0;
  for (let i = 0; i < slug.length; i++) n = (n * 31 + slug.charCodeAt(i)) >>> 0;
  return `https://picsum.photos/800/450?random=${n % 100}`;
}
