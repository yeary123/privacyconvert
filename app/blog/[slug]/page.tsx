import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlogSlugs, getPostBySlug, getPrevNextSlugs } from "@/lib/blog";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://privacyconvert.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  const title = (post.frontmatter.title as string) ?? slug;
  const description =
    (post.frontmatter.description as string) ??
    (post.frontmatter.excerpt as string) ??
    `${title}. No upload, local conversion. PrivacyConvert blog 2026.`;
  return {
    title: `${title} | Blog | PrivacyConvert 2026`,
    description,
  };
}

function BlogPostingJsonLd({
  title,
  date,
  description,
  slug,
}: {
  title: string;
  date: string;
  description: string;
  slug: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: date || undefined,
    description,
    url: `${BASE_URL}/blog/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "PrivacyConvert",
      url: BASE_URL,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const title = (post.frontmatter.title as string) ?? slug;
  const date = (post.frontmatter.date as string) ?? "";
  const description =
    (post.frontmatter.description as string) ??
    (post.frontmatter.excerpt as string) ??
    "";
  const readingTime = (post.frontmatter.readingTime as string) ?? "";

  const { prev, next } = getPrevNextSlugs(slug);

  return (
    <>
      <BlogPostingJsonLd
        title={title}
        date={date}
        description={description}
        slug={slug}
      />
      <div className="container py-10">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Blog
        </Link>
        <article className="mx-auto max-w-2xl pt-6">
          <header className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {date && <time dateTime={date}>{date}</time>}
            {readingTime && (
              <>
                <span aria-hidden>·</span>
                <span>{readingTime}</span>
              </>
            )}
          </header>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXRemote source={post.content} options={{ parseFrontmatter: true }} />
          </div>
          <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-8">
            <div className="flex gap-4">
              {prev && (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="text-sm font-medium text-muted-foreground hover:underline"
                >
                  ← {prev.title}
                </Link>
              )}
              {next && (
                <Link
                  href={`/blog/${next.slug}`}
                  className="text-sm font-medium text-muted-foreground hover:underline"
                >
                  {next.title} →
                </Link>
              )}
            </div>
            <Link
              href="/pricing"
              className="text-sm font-medium text-primary hover:underline"
            >
              Upgrade to Pro
            </Link>
          </footer>
        </article>
      </div>
    </>
  );
}
