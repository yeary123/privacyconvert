"use client";

import { useEffect, useTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Clock } from "lucide-react";
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
import {
  isLifetimeProPeriod,
  getDaysLeftForLifetimePro,
  SUB_PLANS,
  LIFETIME_PRO_DAYS,
} from "@/lib/pricing";

export function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchUser } = useAuthStore();
  const hydrate = useProStore((s) => s.hydrate);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const inLifetimePeriod = isLifetimeProPeriod();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (inLifetimePeriod) {
      setDaysLeft(getDaysLeftForLifetimePro());
      const t = setInterval(() => setDaysLeft(getDaysLeftForLifetimePro()), 60_000);
      return () => clearInterval(t);
    }
  }, [inLifetimePeriod]);

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

      {inLifetimePeriod ? (
        /* 永久 Pro 倒计时期内：一次性买断 */
        <div className="mx-auto max-w-md">
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Lifetime Pro</CardTitle>
                {daysLeft !== null && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <Clock className="h-3.5 w-3.5" />
                    Offer ends in {daysLeft} days
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold">$9.9</p>
              <p className="text-sm text-muted-foreground">
                One-time payment, forever Pro. Unlimited batch and history. Offer ends in {daysLeft ?? LIFETIME_PRO_DAYS} days; after that Pro becomes subscription-only.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <PayPalBuyNowButton />
              <p className="text-xs text-muted-foreground">PayPal Buy Now. After payment, Pro activates for your account.</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* 100 天后：订阅制 */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUB_PLANS.map((plan) => (
            <Card key={plan.id} className={plan.id === "annual" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{plan.label}</CardTitle>
                <p className="text-2xl font-bold">${plan.price.toFixed(2)}</p>
                {plan.discount < 1 && (
                  <p className="text-xs text-muted-foreground">
                    {Math.round((1 - plan.discount) * 100)}% off · ${(plan.price / plan.months).toFixed(2)}/mo
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Pro: unlimited batch, history, larger files. Subscription; cancel anytime.
                </p>
                <p className="text-xs text-muted-foreground">Subscription checkout coming soon.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
