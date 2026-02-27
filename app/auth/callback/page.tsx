"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

/** Parse hash fragment for access_token & refresh_token (Supabase magic link implicit flow). */
function parseHashParams(hash: string): { access_token?: string; refresh_token?: string } {
  if (!hash || !hash.startsWith("#")) return {};
  const params = new URLSearchParams(hash.slice(1));
  return {
    access_token: params.get("access_token") ?? undefined,
    refresh_token: params.get("refresh_token") ?? undefined,
  };
}

async function finishSignIn(accessToken: string): Promise<void> {
  const res = await fetch("/api/auth/sync-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok && res.status !== 404) {
    console.warn("Profile sync failed:", await res.text());
  }
  const { useAuthStore } = await import("@/store/useAuthStore");
  await useAuthStore.getState().fetchUser();
}

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    const code = searchParams.get("code");
    const hashParams = typeof window !== "undefined" ? parseHashParams(window.location.hash) : null;
    const hasCode = Boolean(code);
    const hasHashTokens = Boolean(hashParams?.access_token);

    if (!hasCode && !hasHashTokens) {
      setStatus("error");
      setMessage("Missing auth code. Please try signing in again.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (error) {
            setStatus("error");
            setMessage(error.message || "Sign in failed.");
            return;
          }
          setMessage("Setting up your account…");
          const token = data.session?.access_token;
          if (token) await finishSignIn(token);
        } else if (hashParams?.access_token) {
          setMessage("Setting up your account…");
          const { error } = await supabase.auth.setSession({
            access_token: hashParams.access_token,
            refresh_token: hashParams.refresh_token ?? "",
          });
          if (cancelled) return;
          if (error) {
            setStatus("error");
            setMessage(error.message || "Sign in failed.");
            return;
          }
          await finishSignIn(hashParams.access_token);
        }

        if (cancelled) return;
        setStatus("ok");
        const redirectTo = searchParams.get("redirect");
        const path = redirectTo?.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
        window.location.replace(path);
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
