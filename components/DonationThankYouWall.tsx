"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/** Dynamic donation thank-you wall. Placeholder data; replace with Buy Me a Coffee API when connected. */
const PLACEHOLDER_DONORS = [
  { name: "Anonymous", amount: "Coffee", date: "Feb 2026" },
  { name: "Privacy fan", amount: "×2", date: "Feb 2026" },
  { name: "Local-first user", amount: "Coffee", date: "Jan 2026" },
  { name: "No-upload advocate", amount: "Coffee", date: "Jan 2026" },
  { name: "Designer M.", amount: "×3", date: "Dec 2025" },
  { name: "Open source supporter", amount: "Coffee", date: "Dec 2025" },
];

export function DonationThankYouWall() {
  const [donors, setDonors] = useState<typeof PLACEHOLDER_DONORS>([]);
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);

  useEffect(() => {
    setDonors(PLACEHOLDER_DONORS);
    setLoadedAt(new Date());
  }, []);

  if (donors.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Loading thank-you wall…</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {donors.map((d, i) => (
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
      </div>
      {loadedAt && (
        <p className="text-xs text-muted-foreground">
          Thank you to every supporter. Last updated: {loadedAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}.
        </p>
      )}
    </div>
  );
}
