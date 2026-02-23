"use client";

import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/** Placeholder for Buy Me a Coffee latest donations. Replace with API data when connected. */
const PLACEHOLDER_DONORS = [
  { name: "Anonymous", amount: "Coffee", date: "Feb 2026" },
  { name: "Privacy fan", amount: "×2", date: "Feb 2026" },
  { name: "Local-first user", amount: "Coffee", date: "Jan 2026" },
];

export function DonationThankYouWall() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {PLACEHOLDER_DONORS.map((d, i) => (
        <Card key={i} className="border-primary/20">
          <CardContent className="flex items-center gap-3 py-3">
            <Heart className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0">
              <p className="font-medium truncate">{d.name}</p>
              <p className="text-xs text-muted-foreground">{d.amount} · {d.date}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      <p className="col-span-full text-xs text-muted-foreground mt-2">
        Latest donations will sync from Buy Me a Coffee when API is connected. Thank you to every supporter.
      </p>
    </div>
  );
}
