"use client";

import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

const BUYMEACOFFEE_URL = "https://www.buymeacoffee.com/privacyconvert";

export function DonationButton() {
  return (
    <div className="flex flex-wrap gap-3">
      <a href={BUYMEACOFFEE_URL} target="_blank" rel="noopener noreferrer">
        <Button variant="default" size="lg">
          <Coffee className="h-4 w-4" />
          Buy Me a Coffee
        </Button>
      </a>
    </div>
  );
}
