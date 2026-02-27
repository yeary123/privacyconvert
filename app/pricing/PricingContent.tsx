"use client";

import { useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PayPalBuyNowButton } from "@/components/PayPalBuyNowButton";
import { useAuthStore } from "@/store/useAuthStore";
import { useProStore } from "@/store/useProStore";

export function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchUser } = useAuthStore();
  const hydrate = useProStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "1") {
      fetchUser();
      startTransition(() => router.replace("/pricing"));
    }
  }, [searchParams, fetchUser, router]);

  const [, startTransition] = useTransition();

  return (
    <div className="space-y-12">
      {/* Pro features */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[240px]">Feature</TableHead>
              <TableHead className="bg-primary/10 text-center font-semibold">Pro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Batch conversion</TableCell>
              <TableCell className="bg-primary/5 text-center">Unlimited</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>File size limit</TableCell>
              <TableCell className="bg-primary/5 text-center">Larger files</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Video conversion speed</TableCell>
              <TableCell className="bg-primary/5 text-center">Accelerated (when available)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Conversion history</TableCell>
              <TableCell className="bg-primary/5 text-center">
                <Check className="mx-auto h-4 w-4" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Advanced features</TableCell>
              <TableCell className="bg-primary/5 text-center">
                <Check className="mx-auto h-4 w-4" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Lifetime Pro */}
      <div className="mx-auto max-w-md">
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Lifetime Pro</CardTitle>
            <p className="text-2xl font-bold">$9.9</p>
            <p className="text-sm text-muted-foreground">One-time payment, forever Pro. Unlimited batch and history.</p>
          </CardHeader>
          <CardContent className="space-y-2">
            <PayPalBuyNowButton />
            <p className="text-xs text-muted-foreground">PayPal Buy Now. After payment, Pro activates for your account.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
