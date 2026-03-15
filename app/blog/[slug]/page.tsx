import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getBlogSlugs, getPostBySlug, getPrevNextSlugs } from "@/lib/blog";
import { getPostCoverUrl } from "@/lib/blog-utils";
import { CopyInvisibleChar } from "@/components/CopyInvisibleChar";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.privacyconvert.online";

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
    `${title}.`;
  const coverUrl = (post.frontmatter.cover as string) || getPostCoverUrl(slug);
  return {
    title: `${title} | Blog | PrivacyConvert`,
    description,
    openGraph: {
      title: `${title} | PrivacyConvert Blog`,
      description,
      images: [{ url: coverUrl, width: 800, height: 450, alt: title }],
    },
    alternates: { canonical: `/blog/${slug}` },
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
    author: {
      "@type": "Organization",
      name: "PrivacyConvert",
      url: BASE_URL,
    },
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
  const proCta = (post.frontmatter.proCta as boolean) ?? false;

  const { prev, next } = getPrevNextSlugs(slug);

  return (
    <>
      <BlogPostingJsonLd
        title={title}
        date={date}
        description={description}
        slug={slug}
      />
      <div className="container py-10 sm:py-12">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Blog
        </Link>
        <article className="mx-auto max-w-prose pt-8">
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {date && <time dateTime={date}>{date}</time>}
              {readingTime && (
                <>
                  <span aria-hidden>·</span>
                  <span>{readingTime}</span>
                </>
              )}
            </div>
          </header>
          <div
            className={[
              "prose prose-neutral dark:prose-invert",
              "prose-lg max-w-none",
              "prose-headings:font-semibold prose-headings:tracking-tight",
              "prose-h1:hidden",
              "prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:text-xl sm:prose-h2:text-2xl",
              "prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-lg",
              "prose-p:my-5 prose-p:leading-relaxed",
              "[&>p:first-of-type]:text-lg [&>p:first-of-type]:text-muted-foreground [&>p:first-of-type]:leading-relaxed",
              "prose-ul:my-5 prose-li:my-1.5 prose-li:leading-relaxed",
              "prose-img:my-8 prose-img:rounded-xl prose-img:shadow-md",
              "prose-table:my-8 prose-th:py-3 prose-td:py-2",
            ].join(" ")}
          >
            <MDXRemote
              source={post.content}
              options={{
                parseFrontmatter: true,
                mdxOptions: { remarkPlugins: [remarkGfm] },
              }}
              components={{
                CopyInvisibleChar,
              }}
            />
          </div>
          <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-10">
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
            {proCta ? (
              <Link
                href="/pricing"
                className="text-sm font-medium text-primary hover:underline"
              >
                Upgrade to Pro
              </Link>
            ) : (
              <Link
                href="/tools"
                className="text-sm font-medium text-primary hover:underline"
              >
                Explore tools
              </Link>
            )}
          </footer>
        </article>
      </div>
    </>
  );
}
