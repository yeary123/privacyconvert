import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

const POSTS: Record<string, { title: string; date: string; content: string }> = {
  "why-local-conversion": {
    title: "Why Convert Files Locally?",
    date: "2026-01-15",
    content: "Privacy and speed: why we run conversion in your browser. (Full article placeholder.)",
  },
  "avif-vs-png": {
    title: "AVIF vs PNG: When to Convert",
    date: "2026-01-10",
    content: "When to use AVIF, when to use PNG, and how to convert without uploading. (Full article placeholder.)",
  },
  "wav-to-mp3-guide": {
    title: "WAV to MP3: Quality and Size",
    date: "2026-01-05",
    content: "Quick guide to converting WAV to MP3 locally with good quality. (Full article placeholder.)",
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
  return { title: `${post.title} | Blog | PrivacyConvert` };
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
