"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TOOLS } from "@/lib/tools";
import { TOOLS_FAQ } from "@/lib/toolsFaq";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "image", label: "Image" },
  { id: "audio", label: "Audio" },
  { id: "video", label: "Video" },
  { id: "document", label: "Document" },
] as const;

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    let list: readonly (typeof TOOLS)[number][] = TOOLS;
    if (category !== "all") {
      list = list.filter((t) => t.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }
    return list;
  }, [query, category]);

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold">All Tools</h1>
      <p className="mb-6 text-muted-foreground">
        Convert files locally in your browser. No upload, zero privacy risk.
      </p>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCategory(cat.id)}
              className={cn(category === cat.id && "shadow-sm")}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((tool) => (
          <Link key={tool.slug} href={`/convert/${tool.slug}`} className="block h-full">
            <Card
              className={cn(
                "h-full transition-colors hover:bg-muted/50",
                tool.proOnly && "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {tool.name}
                  <span className="flex items-center gap-1">
                    {tool.proOnly && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                        Pro
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </span>
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
                {tool.category && (
                  <span className="text-xs text-muted-foreground capitalize">{tool.category}</span>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
        <Link href="/transfer" className="block h-full">
          <Card className="h-full transition-colors hover:bg-muted/50 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                P2P Batch Transfer
                <span className="flex items-center gap-1">
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    Pro
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </span>
              </CardTitle>
              <CardDescription>
                Send files directly between browsers. No server. Pro.
              </CardDescription>
              <span className="text-xs text-primary font-medium">Pro</span>
            </CardHeader>
          </Card>
        </Link>
      </div>
      {filtered.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">No tools match your search.</p>
      )}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="mb-6 text-2xl font-bold">Tools FAQ</h2>
        <Accordion type="single" collapsible className="w-full max-w-2xl">
          {TOOLS_FAQ.map((item, i) => (
            <AccordionItem key={i} value={`tools-faq-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
