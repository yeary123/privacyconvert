"use client";

import { useEffect, useRef, useState } from "react";
import { useProStore } from "@/store/useProStore";

const DURATION_MS = 1500;
const TICK = 50;

/** Dynamic "files protected" counter: reads from store (localStorage-backed). */
export function ProtectedCounter() {
  const [mounted, setMounted] = useState(false);
  const storeCount = useProStore((s) => s.protectedCount);
  const hydrate = useProStore((s) => s.hydrate);
  const [displayCount, setDisplayCount] = useState(storeCount);
  const startRef = useRef(storeCount);

  useEffect(() => {
    setMounted(true);
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!mounted) return;
    const start = startRef.current;
    if (start === storeCount) return;
    startRef.current = storeCount;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 2;
      setDisplayCount(Math.round(start + (storeCount - start) * eased));
      if (progress >= 1) clearInterval(timer);
    }, TICK);
    return () => clearInterval(timer);
  }, [mounted, storeCount]);

  if (!mounted) return <span className="tabular-nums font-semibold text-primary">128,000+</span>;
  return (
    <span className="tabular-nums font-semibold text-primary">
      {displayCount.toLocaleString()}
    </span>
  );
}
