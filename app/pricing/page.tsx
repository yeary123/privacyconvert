import type { Metadata } from "next";
import { Suspense } from "react";
import { PricingContent } from "./PricingContent";

export const metadata: Metadata = {
  title: "Pricing - Free & Pro | No Upload Converter | PrivacyConvert 2026",
  description:
    "Free: 1 file at a time, no upload. Pro: unlimited batch, larger files, history, P2P. Monthly $4.9, Yearly $49, Lifetime $99. 2026.",
  keywords: ["pricing", "pro", "no upload", "file converter", "2026"],
};

export default function PricingPage() {
  return (
    <div className="container py-12">
      <h1 className="mb-2 text-3xl font-bold">Pricing</h1>
      <p className="mb-10 text-muted-foreground">
        Free forever for single-file conversion. Upgrade to Pro for unlimited batch and more.
      </p>
      <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-muted" />}>
        <PricingContent />
      </Suspense>
    </div>
  );
}
