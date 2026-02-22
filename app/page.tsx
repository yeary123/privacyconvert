import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Cpu, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolCard } from "@/components/ToolCard";
import { DonationButton } from "@/components/DonationButton";
import { TOOLS } from "@/lib/tools";
import { buildSoftwareApplicationSchema } from "@/lib/schema";

const SOFTWARE_SCHEMA = buildSoftwareApplicationSchema({
  name: "PrivacyConvert",
  description: "100% local file converter. No upload, zero privacy risk. Convert images, audio, video in your browser. 2026.",
  url: "https://privacyconvert.com",
  applicationCategory: "UtilitiesApplication",
});

export const metadata: Metadata = {
  title: "PrivacyConvert - 100% Local File Converter | No Upload, Zero Privacy Risk | 2026",
  description:
    "Convert images, audio, video in your browser. No upload, no server, zero privacy risk. Free & Pro. 2026.",
  openGraph: {
    title: "PrivacyConvert - Local File Converter, No Upload | 2026",
    description: "100% browser-side conversion. Zero privacy risk.",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Is my file uploaded to your server?",
    a: "No. All conversion happens entirely in your browser using WebAssembly (FFmpeg.wasm). Your files never leave your device. We have no server that receives or stores your data.",
  },
  {
    q: "What file formats do you support?",
    a: "We support image (AVIF, WebP, PNG, JPEG), audio (WAV, MP3, OGG), and video (MP4, WebM, GIF). More formats are added regularly. Pro users get access to additional formats and batch processing.",
  },
  {
    q: "How is PrivacyConvert different from Convertio or VERT.sh?",
    a: "Convertio uploads files to their servers. VERT.sh and localconvert.com are similar to us but we offer more tools, better SEO, and a clear Freemium model with Pro features like unlimited batch and P2P transfer. We focus on 100% client-side with no upload.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is required for free conversion. You can use all free tools immediately. Pro features (unlimited batch, larger files, history) can be unlocked with a one-time or subscription payment via Stripe or Buy Me a Coffee.",
  },
  {
    q: "Is there a file size limit?",
    a: "Free users have a per-file limit suitable for most use cases. Pro users get higher limits and can process larger files. All processing still happens in your browser.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_SCHEMA) }}
      />
      <div className="flex flex-col">
        {/* Hero */}
        <section className="border-b border-border bg-muted/30 py-16 md:py-24">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Privacy-First File Converter
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              100% in your browser. No upload. No server. Zero privacy risk. Convert images, audio, and video locally — 2026.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/tools">
                <Button size="lg">
                  Browse Tools <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">See Pricing</Button>
              </Link>
            </div>
            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> No Upload
              </span>
              <span className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" /> Client-Side Only
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> 2026
              </span>
            </div>
          </div>
        </section>

        {/* Tool cards grid - 8 tools */}
        <section className="container py-16">
          <h2 className="mb-8 text-2xl font-bold">Popular Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                name={tool.name}
                description={tool.description}
                category={tool.category}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/tools">
              <Button variant="outline">View All Tools</Button>
            </Link>
          </div>
        </section>

        {/* Competitor comparison */}
        <section className="border-t border-border bg-muted/20 py-16">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold">Compare with Others</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Convertio</TableHead>
                    <TableHead>VERT.sh</TableHead>
                    <TableHead>localconvert.com</TableHead>
                    <TableHead className="bg-primary/10 font-semibold">PrivacyConvert</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>No upload / client-side</TableCell>
                    <TableCell>No</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell className="bg-primary/5">Yes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Zero privacy risk</TableCell>
                    <TableCell>No</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell className="bg-primary/5">Yes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Batch conversion</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Limited</TableCell>
                    <TableCell>Limited</TableCell>
                    <TableCell className="bg-primary/5">Free 1 / Pro unlimited</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>P2P / advanced</TableCell>
                    <TableCell>No</TableCell>
                    <TableCell>No</TableCell>
                    <TableCell>No</TableCell>
                    <TableCell className="bg-primary/5">Pro</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SEO & discoverability</TableCell>
                    <TableCell>Good</TableCell>
                    <TableCell>Basic</TableCell>
                    <TableCell>Basic</TableCell>
                    <TableCell className="bg-primary/5">Optimized 2026</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Why choose us - 4 cards */}
        <section className="container py-16">
          <h2 className="mb-8 text-2xl font-bold">Why Choose Us</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">No Upload</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                Files stay on your device. Conversion runs in the browser with FFmpeg.wasm.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Open & Transparent</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                No hidden tracking. We don&apos;t store or analyze your files.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Free + Pro</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                Free tier for daily use. Pro for unlimited batch, larger files, and P2P.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2026 Ready</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                Modern stack, fast UX, and SEO built for discoverability.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="border-t border-border bg-muted/20 py-16">
          <div className="container max-w-3xl">
            <h2 className="mb-8 text-2xl font-bold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA + Donation */}
        <section className="container py-16">
          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 text-center shadow">
            <h2 className="text-2xl font-bold">Support PrivacyConvert</h2>
            <p className="mt-2 text-muted-foreground">
              Donate or go Pro to unlock unlimited batch, larger files, and P2P. 100% optional.
            </p>
            <div className="mt-6 flex justify-center">
              <DonationButton />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
