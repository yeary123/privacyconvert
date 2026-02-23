"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";
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
          <ToolCard
            key={tool.slug}
            slug={tool.slug}
            name={tool.name}
            description={tool.description}
            category={tool.category}
            proOnly={tool.proOnly}
          />
        ))}
        <Link href="/transfer">
          <Card className="h-full transition-colors hover:bg-muted/50 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                P2P Batch Transfer
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
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
    </div>
  );
}
