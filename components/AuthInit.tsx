"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

/** Call fetchUser on mount so app has user + isPro. Used in root layout. */
export function AuthInit() {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return null;
}
