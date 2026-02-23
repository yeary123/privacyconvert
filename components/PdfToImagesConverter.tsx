"use client";

import Link from "next/link";
import { FileText, Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useProStore } from "@/store/useProStore";

type Props = { toolSlug?: string };

/**
 * PDF to Images is a Pro-only feature. Shows upgrade CTA for free users.
 */
export function PdfToImagesConverter({ toolSlug = "pdf-to-images" }: Props) {
  const isPro = useProStore((s) => s.isPro);

  if (isPro) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          PDF to Images (batch extract pages) is in development. As a Pro user you will get access first.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Check back soon or use other image/audio/video tools below.
        </p>
        <Link href="/tools" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4 inline-block" })}>
          Browse all tools
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center">
      <Lock className="mx-auto h-10 w-10 text-primary" />
      <p className="mt-2 font-medium">PDF to Images — Pro only</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Unlock batch PDF page extraction and more with Pro. All conversion stays 100% in your browser.
      </p>
      <Link href="/pricing" className={buttonVariants({ className: "mt-4 inline-block" })}>
        Upgrade to Pro
      </Link>
    </div>
  );
}
