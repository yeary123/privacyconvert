import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactEmail } from "@/components/ContactEmail";
import { HOW_IT_WORKS_HEADING, HOW_IT_WORKS_CONTENT } from "@/components/HowItWorksPrivacy";

export const metadata: Metadata = {
  title: "About - No Upload, Local Converter | PrivacyConvert 2026",
  description:
    "Why we built a 100% local file converter. No upload, zero privacy risk. Our story and thanks to Pro users. 2026.",
  keywords: ["about", "privacy", "no upload", "local converter", "2026"],
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-10 text-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold">About PrivacyConvert</h1>
          <p className="mb-10 text-muted-foreground">
            Privacy-first, local-only file conversion. No upload. 2026.
          </p>
        </div>
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
          <Accordion type="single" collapsible className="text-left">
            <AccordionItem value="how-it-works">
              <AccordionTrigger className="text-xl font-semibold">
                {HOW_IT_WORKS_HEADING}
              </AccordionTrigger>
              <AccordionContent>{HOW_IT_WORKS_CONTENT}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">How We Ensure Quality</h2>
          <p className="mb-4 text-muted-foreground">
            We’re not a bulk-generated directory. Every tool is added and verified with a clear process:
          </p>
          <ul className="list-inside list-disc space-y-2 text-left text-muted-foreground">
            <li>
              <strong className="text-foreground">Tool selection:</strong> We add converters based on real privacy-sensitive use cases (e.g. ID photos, internal documents, personal media) and only ship when the conversion works reliably in the browser.
            </li>
            <li>
              <strong className="text-foreground">Security verification:</strong> Before release, each tool is tested with browser DevTools: we confirm that during conversion no binary file data is sent to any server. Only the initial script/WASM load hits the network.
            </li>
            <li>
              <strong className="text-foreground">Core libraries:</strong> We build on long-standing open-source projects (e.g. FFmpeg, pdf.js) and use their WebAssembly builds. That way conversion quality and behaviour are backed by community-tested code, not opaque cloud APIs.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Team</h2>
          <p className="text-muted-foreground">
            PrivacyConvert is built by developers who care about privacy and open tooling. We
            don’t collect your files, we don’t track you for ads, and we don’t sell data. We offer
            optional Pro so we can maintain the site and add more formats and tools
            in 2026 and beyond.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            For support, feedback, or partnership inquiries, reach us at{" "}
            <ContactEmail className="text-muted-foreground hover:text-foreground underline underline-offset-2" />.
            We respond to legitimate requests and do not use your address for marketing.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thank you</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            To everyone who uses PrivacyConvert and everyone who goes Pro — thank you.
            We’ll keep improving the tools and keeping your files local.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
