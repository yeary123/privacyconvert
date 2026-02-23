import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog - No Upload File Conversion & Privacy | PrivacyConvert 2026",
  description: "Tips and updates about local file conversion, no upload, and privacy. 2026.",
  keywords: ["no upload", "local convert", "privacy", "file converter", "2026"],
};

const POSTS = [
  {
    slug: "why-local-conversion",
    title: "Why Convert Files Locally?",
    excerpt: "Privacy and speed: why we run conversion in your browser. No upload, zero risk.",
    date: "2026-01-15",
  },
  {
    slug: "avif-vs-png",
    title: "AVIF vs PNG: When to Convert",
    excerpt: "When to use AVIF, when to use PNG, and how to convert without uploading. 2026.",
    date: "2026-01-10",
  },
  {
    slug: "wav-to-mp3-guide",
    title: "WAV to MP3: Quality and Size",
    excerpt: "Quick guide to converting WAV to MP3 locally with good quality. No upload.",
    date: "2026-01-05",
  },
  {
    slug: "no-upload-2026",
    title: "No Upload Converters in 2026",
    excerpt: "Why no-upload, client-side conversion matters for privacy and how to choose tools.",
    date: "2026-01-01",
  },
  {
    slug: "webp-to-png-privacy",
    title: "WebP to PNG: Keep It Local",
    excerpt: "Convert WebP to PNG in your browser. No upload, no server. 2026.",
    date: "2025-12-28",
  },
];

export default function BlogPage() {
  return (
    <div className="container py-12">
      <h1 className="mb-2 text-3xl font-bold">Blog</h1>
      <p className="mb-10 text-muted-foreground">
        Tips and updates about local conversion and privacy.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <Card key={post.slug} className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <p className="text-xs text-muted-foreground">{post.date}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        More articles coming soon. Placeholder content for 2026.
      </p>
    </div>
  );
}
