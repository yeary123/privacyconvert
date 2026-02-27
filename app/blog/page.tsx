import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/blog";
import { NewsletterForm } from "@/components/NewsletterForm";
import { BlogPostList } from "@/components/BlogPostList";

export const metadata: Metadata = {
  title: "PrivacyConvert Blog – Local File Conversion Tips & Guides",
  description:
    "Guides and tips for local, privacy-first file conversion. Client-side conversion, format comparisons, and how to get the most from your converter.",
  keywords: ["privacy-first file converter", "local conversion", "file converter", "blog"],
};

const SIDEBAR_LATEST_COUNT = 6;

export default function BlogPage() {
  const posts = getPosts();
  const latest = posts.slice(0, SIDEBAR_LATEST_COUNT);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
            PrivacyConvert Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Tips, guides, and comparisons for local, privacy-first file conversion.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            {posts.length > 0 ? (
              <BlogPostList posts={posts} />
            ) : (
              <p className="py-12 text-center text-muted-foreground">
                No posts yet.
              </p>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Subscribe
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Privacy-first conversion tips and product updates, delivered to your inbox.
              </p>
              <NewsletterForm />
            </div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 font-semibold">Latest</h3>
              <ul className="space-y-3">
                {latest.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="block text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                      {p.title}
                    </Link>
                    {p.readingTime && (
                      <span className="mt-0.5 block text-xs text-muted-foreground/80">
                        {p.readingTime}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
