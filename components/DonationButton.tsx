"use client";

import { Button } from "@/components/ui/button";
import { Coffee, CreditCard } from "lucide-react";

const BUYMEACOFFEE_URL = "https://www.buymeacoffee.com/privacyconvert";
const STRIPE_URL = "#"; // Placeholder for Stripe checkout

export function DonationButton() {
  return (
    <div className="flex flex-wrap gap-3">
      <a href={BUYMEACOFFEE_URL} target="_blank" rel="noopener noreferrer">
        <Button variant="default" size="lg">
          <Coffee className="h-4 w-4" />
          Buy Me a Coffee
        </Button>
      </a>
      <a href={STRIPE_URL}>
        <Button variant="outline" size="lg">Stripe (Pro)</Button>
      </a>
    </div>
  );
}
