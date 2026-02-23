"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
        },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setSent(true);
      toast.success("Magic link sent! Check your email.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4">
        <Card className="w-full max-w-md border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a magic link to <strong className="text-foreground">{email.trim()}</strong>. Click the link to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive it? Check spam or{" "}
              <button
                type="button"
                className="font-medium text-primary underline underline-offset-2 hover:no-underline"
                onClick={() => setSent(false)}
              >
                try another email
              </button>
            </p>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Back to home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-foreground hover:opacity-90">
            <Shield className="h-5 w-5 text-primary" aria-hidden />
            PrivacyConvert
          </Link>
          <CardTitle className="mt-4">Sign in with magic link</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to sign in — no password needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                autoFocus
                className="h-10"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send magic link"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            By signing in you agree to use the service. No password is stored.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
