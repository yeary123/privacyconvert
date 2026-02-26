"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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

const GRID_COLUMNS = 4;
const ROW_HEIGHT_ESTIMATE = 160;

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "image", label: "Image" },
  { id: "audio", label: "Audio" },
  { id: "video", label: "Video" },
  { id: "document", label: "Document" },
  { id: "units", label: "Units" },
  { id: "data", label: "Data" },
  { id: "number", label: "Number" },
] as const;

const NEW_CONVERT_SLUGS = [
  "pdf-to-docx", "pdf-to-epub", "length-converter", "weight-converter",
  "temperature-converter", "currency-converter", "data-storage-converter", "time-converter", "cooking-units-converter",
  "area-converter", "volume-converter", "speed-converter",
];

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof console !== "undefined" && NEW_CONVERT_SLUGS.every((slug) => TOOLS.some((t) => t.slug === slug))) {
      console.log("所有新转换类型已实现");
    }
  }, []);

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

  const rowCount = Math.ceil(filtered.length / GRID_COLUMNS);
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT_ESTIMATE,
    overscan: 3,
  });
  const virtualRows = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();

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
      <div
        ref={scrollRef}
        className="overflow-auto rounded-lg border border-border"
        style={{ minHeight: 400, maxHeight: "70vh" }}
      >
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No tools match your search.</p>
        ) : (
          <div
            style={{
              height: totalHeight,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualRows.map((virtualRow) => {
              const start = virtualRow.index * GRID_COLUMNS;
              const rowTools = filtered.slice(start, start + GRID_COLUMNS);
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="grid gap-4 px-1 py-1 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {rowTools.map((tool) => (
                    <ToolCard
                      key={tool.slug}
                      href={`/convert/${tool.slug}`}
                      slug={tool.slug}
                      name={tool.name}
                      description={tool.description}
                      category={tool.category}
                      proOnly={tool.proOnly}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
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
