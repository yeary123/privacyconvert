import type { Metadata } from "next";
import { Suspense } from "react";
import { PricingContent } from "./PricingContent";

const PRICING_TITLE = "Pricing – Free & Pro | No Upload Converter | PrivacyConvert 2026";
const PRICING_DESCRIPTION =
  "No upload, 100% local. Privacy-first. Free: 1 file; Pro: 200+ formats, unlimited batch. Your files never leave your device. 2026. Free & Pro.";

export const metadata: Metadata = {
  title: PRICING_TITLE,
  description: PRICING_DESCRIPTION,
  openGraph: {
    title: PRICING_TITLE,
    description: PRICING_DESCRIPTION,
  },
  keywords: ["pricing", "pro", "no upload", "file converter", "2026"],
  alternates: { canonical: "/pricing" },
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
