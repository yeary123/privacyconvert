"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProStore } from "@/store/useProStore";

export function PricingContent() {
  const { isPro, setPro, hydrate } = useProStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="space-y-12">
      {/* Free vs Pro comparison */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[240px]">Feature</TableHead>
              <TableHead className="text-center">Free</TableHead>
              <TableHead className="bg-primary/10 text-center font-semibold">Pro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Batch conversion</TableCell>
              <TableCell className="text-center">1 file at a time</TableCell>
              <TableCell className="bg-primary/5 text-center">Unlimited</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>File size limit</TableCell>
              <TableCell className="text-center">Standard</TableCell>
              <TableCell className="bg-primary/5 text-center">Larger files</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Video conversion speed</TableCell>
              <TableCell className="text-center">Standard</TableCell>
              <TableCell className="bg-primary/5 text-center">Accelerated (when available)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Conversion history</TableCell>
              <TableCell className="text-center">—</TableCell>
              <TableCell className="bg-primary/5 text-center">
                <Check className="mx-auto h-4 w-4" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>P2P advanced features</TableCell>
              <TableCell className="text-center">—</TableCell>
              <TableCell className="bg-primary/5 text-center">
                <Check className="mx-auto h-4 w-4" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Pro plans */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Monthly</CardTitle>
            <p className="text-2xl font-bold">$4.9<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          </CardHeader>
          <CardContent>
            <a href="https://www.buymeacoffee.com/privacyconvert" target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full">Buy Me a Coffee / Stripe</Button>
            </a>
            <p className="mt-2 text-xs text-muted-foreground">Placeholder — connect Stripe or BuyMeACoffee</p>
          </CardContent>
        </Card>
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Yearly</CardTitle>
            <p className="text-2xl font-bold">$49<span className="text-sm font-normal text-muted-foreground">/yr</span></p>
            <p className="text-sm text-muted-foreground">Save ~17%</p>
          </CardHeader>
          <CardContent>
            <a href="#">
              <Button className="w-full" variant="default">Stripe (Pro)</Button>
            </a>
            <p className="mt-2 text-xs text-muted-foreground">Placeholder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lifetime</CardTitle>
            <p className="text-2xl font-bold">$99</p>
            <p className="text-sm text-muted-foreground">One-time</p>
          </CardHeader>
          <CardContent>
            <a href="#">
              <Button className="w-full" variant="outline">Stripe (Lifetime)</Button>
            </a>
            <p className="mt-2 text-xs text-muted-foreground">Placeholder</p>
          </CardContent>
        </Card>
      </div>

      {/* localStorage demo for Pro */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Demo: Simulate Pro</CardTitle>
          <p className="text-sm text-muted-foreground">
            For testing. Toggle Pro state in this browser (stored in localStorage). Tools will allow unlimited batch when Pro is on.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button onClick={() => setPro(!isPro)} variant={isPro ? "secondary" : "default"} type="button">
              {isPro ? "Turn off Pro (demo)" : "Turn on Pro (demo)"}
            </Button>
            <span className="text-sm text-muted-foreground">
              {isPro ? "Pro is active in this browser." : "Pro is off."}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
