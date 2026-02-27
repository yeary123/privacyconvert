import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { PostMeta } from "./blog-utils";

export type { PostMeta } from "./blog-utils";
export { getPostCoverUrl } from "./blog-utils";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

export function getBlogSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPosts(): PostMeta[] {
  const slugs = getBlogSlugs();
  const posts: PostMeta[] = [];
  for (const slug of slugs) {
    const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(raw);
    posts.push({
      slug,
      title: (data.title as string) ?? slug,
      date: (data.date as string) ?? "",
      excerpt: (data.excerpt as string) ?? (data.description as string) ?? "",
      description: data.description as string | undefined,
      readingTime: data.readingTime as string | undefined,
      cover: data.cover as string | undefined,
      proCta: data.proCta as boolean | undefined,
    });
  }
  posts.sort((a, b) => (b.date > a.date ? 1 : -1));
  return posts;
}

export function getPostBySlug(slug: string): { content: string; frontmatter: Record<string, unknown> } | null {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  return { content, frontmatter: data as Record<string, unknown> };
}

/** Get previous and next post slugs by date (newest first). */
export function getPrevNextSlugs(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? posts[i - 1] ?? null : null,
    next: i >= 0 && i < posts.length - 1 ? posts[i + 1] ?? null : null,
  };
}
