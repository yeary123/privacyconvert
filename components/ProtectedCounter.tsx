"use client";

import { useEffect, useState } from "react";

const BASE_COUNT = 128456;
const START_COUNT = 127900;
const DURATION_MS = 2000;
const TICK = 50;

export function ProtectedCounter() {
  const [count, setCount] = useState(START_COUNT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const target = BASE_COUNT;
    const start = START_COUNT;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 2;
      setCount(Math.round(start + (target - start) * eased));
      if (progress >= 1) clearInterval(timer);
    }, TICK);
    return () => clearInterval(timer);
  }, [mounted]);

  return (
    <span className="tabular-nums font-semibold text-primary">
      {mounted ? count.toLocaleString() : "128,000+"}
    </span>
  );
}
