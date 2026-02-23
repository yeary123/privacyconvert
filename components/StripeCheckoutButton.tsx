"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";

export type StripePlan = "monthly" | "yearly" | "lifetime";

interface StripeCheckoutButtonProps extends Omit<ButtonProps, "onClick"> {
  plan: StripePlan;
  children?: React.ReactNode;
}

export function StripeCheckoutButton({
  plan,
  children,
  disabled,
  ...buttonProps
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      {...buttonProps}
    >
      {loading ? "Redirecting…" : children}
    </Button>
  );
}
