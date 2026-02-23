"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center py-16">
      <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
      <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
        We couldn’t load this page. Try again or go back home.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/">
          <Button variant="outline">Home</Button>
        </Link>
      </div>
    </div>
  );
}
