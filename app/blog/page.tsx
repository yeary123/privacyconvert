import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/blog";
import { NewsletterForm } from "@/components/NewsletterForm";
import { BlogPostList } from "@/components/BlogPostList";

export const metadata: Metadata = {
  title: "PrivacyConvert Blog – No Upload 2026 本地文件转换指南",
  description:
    "No upload 2026 本地文件转换指南：client side、browser local、completely local 转换技巧，privacy first file converter 对比（vs Convertio、VERT.sh、localconvert）。",
  keywords: [
    "no upload 2026",
    "privacy first file converter",
    "client side",
    "browser local",
    "completely local",
    "local convert",
    "file converter",
    "blog",
  ],
};

const SIDEBAR_POPULAR_COUNT = 5;

export default function BlogPage() {
  const posts = getPosts();
  const popular = posts.slice(0, SIDEBAR_POPULAR_COUNT);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
            PrivacyConvert Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            No Upload 2026 本地文件转换指南 — client side、browser local、privacy first file converter 技巧与对比
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <div>
            {posts.length > 0 ? (
              <BlogPostList posts={posts} />
            ) : (
              <p className="py-12 text-center text-muted-foreground">
                No posts yet.
              </p>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 font-semibold">热门文章</h3>
              <ul className="space-y-2">
                {popular.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 font-semibold">订阅更新</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                No upload 2026、privacy first 转换技巧与产品更新，直接发到你的邮箱。
              </p>
              <NewsletterForm />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
