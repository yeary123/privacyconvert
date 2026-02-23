"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setStatus("error");
      setMessage("Missing auth code. Please try signing in again.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          setStatus("error");
          setMessage(error.message || "Sign in failed.");
          return;
        }
        setMessage("Setting up your account…");
        const token = data.session?.access_token;
        if (token) {
          const res = await fetch("/api/auth/sync-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          });
          if (!res.ok && res.status !== 404) {
            console.warn("Profile sync failed:", await res.text());
          }
        }
        if (cancelled) return;
        const { useAuthStore } = await import("@/store/useAuthStore");
        await useAuthStore.getState().fetchUser();
        if (cancelled) return;
        setStatus("ok");
        window.location.replace("/");
      } catch (e) {
        if (!cancelled) {
          setStatus("error");
          setMessage("Something went wrong. Please try again.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  if (status === "ok") {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center">
          <Shield className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-4 text-lg font-semibold">Sign in failed</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <Link href="/login" className="mt-6 block">
            <Button className="w-full">Try again</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
