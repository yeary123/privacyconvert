/** Client-safe blog helpers (no Node.js fs). */

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  description?: string;
  readingTime?: string;
};

/** Stable cover image URL for list cards (placeholder only; no people). */
export function getPostCoverUrl(_slug: string): string {
  return "https://placehold.co/800x450/1a1a2e/94a3b8?text=PrivacyConvert";
}
