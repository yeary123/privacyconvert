"use client";

import { useCallback } from "react";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

function PayPalBuyNowInner() {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const onApprove = useCallback(async () => {
    toast.success("You're now a Lifetime Pro user. Thank you!");
    await fetchUser();
    router.push("/pricing?success=1");
  }, [fetchUser, router]);

  if (!user) {
    return (
      <div className="space-y-3 rounded-md border border-dashed border-border bg-muted/30 p-4 text-center text-sm">
        <p className="text-muted-foreground">Sign in first to purchase Pro.</p>
        <Link href="/login?redirect=/pricing">
          <Button size="sm" className="w-full">Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{ layout: "vertical", shape: "rect" }}
      createOrder={async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) {
          toast.error("Session expired. Please sign in again to pay.");
          throw new Error("Not authenticated");
        }
        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Please sign in first to pay.");
            router.push("/login?redirect=/pricing");
          } else {
            toast.error(data.error ?? "Failed to create order");
          }
          throw new Error(data.error ?? "Failed to create order");
        }
        if (!data.orderId) throw new Error(data.error ?? "Failed to create order");
        return data.orderId;
      }}
      onApprove={async () => {
        onApprove();
      }}
    />
  );
}

export function PayPalBuyNowButton() {
  if (!CLIENT_ID) {
    return (
      <p className="text-sm text-muted-foreground">
        Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to .env.local to enable PayPal.
      </p>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: CLIENT_ID,
        intent: "capture",
        currency: "USD",
        locale: "en_US",
      }}
    >
      <PayPalBuyNowInner />
    </PayPalScriptProvider>
  );
}
