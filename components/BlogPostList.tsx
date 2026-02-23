"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PostMeta } from "@/lib/blog-utils";
import { getPostCoverUrl } from "@/lib/blog-utils";

const PER_PAGE = 9;

export function BlogPostList({ posts }: { posts: PostMeta[] }) {
  const [shown, setShown] = useState(PER_PAGE);
  const visible = posts.slice(0, shown);
  const hasMore = shown < posts.length;

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((post) => (
          <li key={post.slug}>
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-[16/10] w-full bg-muted">
                  <Image
                    src={getPostCoverUrl(post.slug)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
                <CardHeader className="space-y-1 pb-2">
                  <h2 className="line-clamp-2 text-lg font-semibold leading-tight">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <time dateTime={post.date}>{post.date}</time>
                    {post.readingTime && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{post.readingTime}</span>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {post.excerpt || post.description}
                  </p>
                </CardContent>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShown((n) => n + PER_PAGE)}
          >
            Load more
          </Button>
        </div>
      )}
    </>
  );
}
