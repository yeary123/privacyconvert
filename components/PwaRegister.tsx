"use client";

import { useEffect } from "react";

/**
 * Registers the minimal service worker so the site meets Chrome's PWA install criteria
 * (Install app / Add to desktop). No caching logic; just enables installability.
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {})
      .catch(() => {});
  }, []);
  return null;
}
