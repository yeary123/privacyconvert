"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

const REDEEM_CODE = "PRO2026";

export function ProUnlockBanner() {
  const isPro = useAuthStore((s) => s.isPro);

  if (isPro) {
    return (
      <div className="mb-4 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm">
        <span className="flex items-center gap-2 text-primary font-medium">
          <Crown className="h-4 w-4" />
          Pro active — batch & more unlocked
        </span>
      </div>
    );
  }

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
      <span className="text-muted-foreground">
        Free: 1 file at a time. Unlock batch, history & P2P with Pro.
      </span>
      <Link href="/pricing#pro">
        <Button size="sm">Unlock Pro</Button>
      </Link>
    </div>
  );
}
