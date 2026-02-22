import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonationButton } from "@/components/DonationButton";

export const metadata: Metadata = {
  title: "About - PrivacyConvert | Our Story & Mission 2026",
  description:
    "Why we built a 100% local file converter. Privacy story, team, and thanks to donors.",
};

export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="mb-2 text-3xl font-bold">About PrivacyConvert</h1>
      <p className="mb-10 text-muted-foreground">
        Privacy-first, local-only file conversion. No upload. 2026.
      </p>

      <div className="mx-auto max-w-3xl space-y-10">
        <section>
          <h2 className="mb-4 text-xl font-semibold">Our Privacy Story</h2>
          <p className="text-muted-foreground">
            We built PrivacyConvert because we were tired of sending files to random websites. Most
            converters — including popular ones like Convertio — upload your files to their servers.
            You have no guarantee who sees them or how long they’re stored. We wanted a place where
            conversion happens entirely in your browser. No server receives your data. No account
            required for free use. That’s our promise: 100% client-side, no upload, zero privacy
            risk.
          </p>
          <p className="mt-4 text-muted-foreground">
            We use FFmpeg compiled to WebAssembly so your device does the work. Same idea as
            VERT.sh and localconvert.com, but we focus on clear SEO, a modern stack, and a
            sustainable Freemium model so we can keep the free tier strong and offer Pro features
            for power users.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Team</h2>
          <p className="text-muted-foreground">
            PrivacyConvert is built by a small team that cares about privacy and open tooling. We
            don’t collect your files, we don’t track you for ads, and we don’t sell data. We offer
            optional Pro and donations so we can maintain the site and add more formats and tools
            in 2026 and beyond.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Donation & Thanks</h2>
          <p className="text-muted-foreground">
            If PrivacyConvert helps you, consider supporting us via Buy Me a Coffee or Stripe (Pro).
            Donors and Pro users help us pay for hosting and development. We’re grateful to everyone
            who has supported the project.
          </p>
          <div className="mt-6">
            <DonationButton />
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thank you</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            To everyone who uses PrivacyConvert and everyone who donates or goes Pro — thank you.
            We’ll keep improving the tools and keeping your files local.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
