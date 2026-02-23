"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const REDEEM_CODE = "PRO2026";

export function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isPro, setDemoProOverride, fetchUser } = useAuthStore();
  const hydrate = useProStore((s) => s.hydrate);
  const [code, setCode] = useState("");
  const [redeemMessage, setRedeemMessage] = useState<"success" | "invalid" | null>(null);

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

  const handleRedeem = () => {
    if (code.trim().toUpperCase() === REDEEM_CODE) {
      setDemoProOverride(true);
      setRedeemMessage("success");
      setCode("");
      router.refresh();
    } else {
      setRedeemMessage("invalid");
    }
  };

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

      {/* Free + $9.9 Lifetime only */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <p className="text-2xl font-bold">$0</p>
            <p className="text-sm text-muted-foreground">1 file at a time, no upload. All conversions run in your browser.</p>
          </CardHeader>
        </Card>
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Lifetime Pro</CardTitle>
            <p className="text-2xl font-bold">$9.9</p>
            <p className="text-sm text-muted-foreground">One-time payment, forever Pro. Unlimited batch, history, P2P.</p>
          </CardHeader>
          <CardContent className="space-y-2">
            <PayPalBuyNowButton />
            <p className="text-xs text-muted-foreground">PayPal Buy Now. After payment, Pro activates (you may need to sign in with the same email).</p>
          </CardContent>
        </Card>
      </div>

      {/* Pro: redeem code + simulate */}
      <Card id="pro" className="border-dashed scroll-mt-24">
        <CardHeader>
          <CardTitle className="text-base">Activate Pro</CardTitle>
          <p className="text-sm text-muted-foreground">
            After donating via Buy Me a Coffee you may receive a redeem code. Or simulate Pro for testing (stored in this browser).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[160px]">
              <label className="mb-1 block text-xs text-muted-foreground">Redeem code</label>
              <Input
                placeholder="e.g. PRO2026"
                value={code}
                onChange={(e) => { setCode(e.target.value); setRedeemMessage(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
              />
            </div>
            <Button onClick={handleRedeem} type="button">Redeem</Button>
          </div>
          {redeemMessage === "success" && (
            <p className="text-sm text-green-600 dark:text-green-400">Pro activated in this browser.</p>
          )}
          {redeemMessage === "invalid" && (
            <p className="text-sm text-destructive">Invalid code.</p>
          )}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
            <Button
              onClick={() => {
                if (isPro) {
                  setDemoProOverride(false);
                  router.refresh();
                } else {
                  setDemoProOverride(true);
                  router.refresh();
                }
              }}
              variant={isPro ? "secondary" : "default"}
              type="button"
            >
              {isPro ? "Turn off Pro (demo)" : "Turn on Pro (demo)"}
            </Button>
            <span className="text-sm text-muted-foreground">
              {isPro ? "Pro is active — batch & more unlocked." : "Pro is off."}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
