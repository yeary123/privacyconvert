"use client";

import { useCallback } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProStore } from "@/store/useProStore";

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

function PayPalBuyNowInner() {
  const setPro = useProStore((s) => s.setPro);
  const router = useRouter();

  const onApprove = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("isPro", "true");
      } catch {
        // ignore
      }
    }
    setPro(true);
    toast.success("Payment successful! Pro is now active.");
    router.push("/");
  }, [setPro, router]);

  return (
    <PayPalButtons
      style={{ layout: "vertical", shape: "rect" }}
      createOrder={async () => {
        const res = await fetch("/api/paypal/create-order", { method: "POST" });
        const data = await res.json();
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
      }}
    >
      <PayPalBuyNowInner />
    </PayPalScriptProvider>
  );
}
