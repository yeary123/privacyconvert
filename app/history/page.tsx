"use client";

import { useEffect } from "react";
import Link from "next/link";
import { History, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { useProStore } from "@/store/useProStore";
import { TOOLS } from "@/lib/tools";

function formatDate(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
}

function toolName(slug: string) {
  return TOOLS.find((t) => t.slug === slug)?.name ?? slug;
}

export default function HistoryPage() {
  const isPro = useAuthStore((s) => s.isPro);
  const { history, hydrate } = useProStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isPro) {
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-md border-primary/30">
          <CardHeader>
            <Lock className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-center">Conversion History — Pro</CardTitle>
            <CardDescription className="text-center">
              View your conversion history with Pro. Unlock batch and history on the Pricing page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-3">
            <Link href="/pricing">
              <Button>Upgrade to Pro</Button>
            </Link>
            <Link href="/tools">
              <Button variant="outline">Browse Tools</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <History className="h-8 w-8" />
            Conversion History
          </h1>
          <p className="text-muted-foreground mt-1">Recent conversions in this browser. Pro only.</p>
        </div>
        <Link href="/tools">
          <Button variant="outline">
            Tools <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No conversions yet. Use any tool to convert files; your history will appear here.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-2">
          {history.map((item, i) => (
            <li key={`${item.tool}-${item.at}-${i}`}>
              <Card>
                <CardContent className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{toolName(item.tool)}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.count} file{item.count !== 1 ? "s" : ""} · {formatDate(item.at)}
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
