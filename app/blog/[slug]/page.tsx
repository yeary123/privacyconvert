import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

const POSTS: Record<string, { title: string; date: string; content: string }> = {
  "why-local-conversion": {
    title: "Why Convert Files Locally?",
    date: "2026-01-15",
    content: "Privacy and speed: why we run conversion in your browser. No upload, zero risk. (Full article placeholder — MDX coming soon.)",
  },
  "avif-vs-png": {
    title: "AVIF vs PNG: When to Convert",
    date: "2026-01-10",
    content: "When to use AVIF, when to use PNG, and how to convert without uploading. 2026. (Full article placeholder.)",
  },
  "wav-to-mp3-guide": {
    title: "WAV to MP3: Quality and Size",
    date: "2026-01-05",
    content: "Quick guide to converting WAV to MP3 locally with good quality. No upload. (Full article placeholder.)",
  },
  "no-upload-2026": {
    title: "No Upload Converters in 2026",
    date: "2026-01-01",
    content: "Why no-upload, client-side conversion matters for privacy and how to choose tools. 2026. (Full article placeholder.)",
  },
  "webp-to-png-privacy": {
    title: "WebP to PNG: Keep It Local",
    date: "2025-12-28",
    content: "Convert WebP to PNG in your browser. No upload, no server. 2026. (Full article placeholder.)",
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Blog | PrivacyConvert 2026`,
    description: `${post.title}. No upload, local conversion. PrivacyConvert blog 2026.`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();
  return (
    <div className="container py-12">
      <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
        ← Blog
      </Link>
      <article className="mx-auto max-w-2xl pt-6">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{post.date}</p>
        <div className="mt-8 text-muted-foreground">{post.content}</div>
      </article>
    </div>
  );
}
