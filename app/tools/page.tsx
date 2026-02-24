"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";
import { TOOLS_FAQ } from "@/lib/toolsFaq";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "image", label: "Image" },
  { id: "audio", label: "Audio" },
  { id: "video", label: "Video" },
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

  // All cards link to static /convert/xxx pages (avif-to-png, wav-to-mp3, etc.)
  const toolHref = (slug: string) => `/convert/${slug}`;

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
          <ToolCard
            key={tool.slug}
            href={toolHref(tool.slug)}
            slug={tool.slug}
            name={tool.name}
            description={tool.description}
            category={tool.category}
            proOnly={tool.proOnly}
          />
        ))}
        <ToolCard
          href="/transfer"
          slug="transfer"
          name="P2P Batch Transfer"
          description="Send files directly between browsers. No server. Pro."
          category="Pro"
          proOnly
        />
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
