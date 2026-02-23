"use client";

import { useCallback } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useProStore } from "@/store/useProStore";
import { useRouter } from "next/navigation";

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
const PLAN_MONTHLY = process.env.NEXT_PUBLIC_PAYPAL_PLAN_MONTHLY ?? "";
const PLAN_YEARLY = process.env.NEXT_PUBLIC_PAYPAL_PLAN_YEARLY ?? "";

export type PayPalPlan = "monthly" | "yearly" | "lifetime";

interface PayPalButtonsWrapperProps {
  plan: PayPalPlan;
  className?: string;
  children?: React.ReactNode;
  onSuccess?: () => void;
}

function PayPalButtonsInner({ plan, onSuccess }: { plan: PayPalPlan; onSuccess?: () => void }) {
  const setPro = useProStore((s) => s.setPro);
  const router = useRouter();

  const handleApprove = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("isPro", "true");
      } catch {
        // ignore
      }
    }
    setPro(true);
    onSuccess?.();
    router.refresh();
  }, [setPro, onSuccess, router]);

  if (plan === "lifetime") {
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
          handleApprove();
        }}
      />
    );
  }

  const planId = plan === "monthly" ? PLAN_MONTHLY : PLAN_YEARLY;
  if (!planId) {
    return (
      <p className="text-sm text-muted-foreground">
        Set NEXT_PUBLIC_PAYPAL_PLAN_{plan === "monthly" ? "MONTHLY" : "YEARLY"} in .env for subscriptions.
      </p>
    );
  }

  return (
    <PayPalButtons
      style={{ layout: "vertical", shape: "rect" }}
      createSubscription={async () => planId}
      onApprove={async () => {
        handleApprove();
      }}
    />
  );
}

export function PayPalButtonsWrapper({ plan, onSuccess }: PayPalButtonsWrapperProps) {
  if (!CLIENT_ID) {
    return (
      <p className="text-sm text-muted-foreground">
        Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to .env.local to enable PayPal.
      </p>
    );
  }

  const isSubscription = plan === "monthly" || plan === "yearly";
  return (
    <PayPalScriptProvider
      options={{
        clientId: CLIENT_ID,
        vault: isSubscription,
        intent: isSubscription ? "subscription" : "capture",
        currency: "USD",
      }}
    >
      <PayPalButtonsInner plan={plan} onSuccess={onSuccess} />
    </PayPalScriptProvider>
  );
}
