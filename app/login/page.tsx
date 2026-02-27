"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Shield, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";
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
      // 始终用配置的站点 URL 或默认正式站，避免邮件链接变成 localhost（NEXT_PUBLIC_* 在构建时内联，Vercel 需配置后重新部署才生效）
      const redirectBase =
        (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
        "https://www.privacyconvert.online";
      const callbackUrl = `${redirectBase.replace(/\/$/, "")}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: callbackUrl,
        },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setSent(true);
      toast.success("Check your email for the sign-in link.");
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
              We sent a sign-in link to <strong className="text-foreground">{email.trim()}</strong>. Click the link in the email to sign in.
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
          <Link
            href="/"
            className="mx-auto inline-flex items-center gap-2 font-semibold text-foreground hover:opacity-90"
          >
            <Shield className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <span>PrivacyConvert</span>
          </Link>
          <CardTitle className="mt-4">Secure Email Login</CardTitle>
          <CardDescription>
            Enter your email to receive a secure, one-time authentication link. No password required for better security.
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
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                autoFocus
                className="h-10"
              />
            </div>
            <Button type="submit" className="w-full rounded-lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Secure Link
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="font-medium text-foreground underline underline-offset-2 hover:no-underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-foreground underline underline-offset-2 hover:no-underline">
              Privacy Policy
            </Link>
            . We prioritize your privacy and never store passwords.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
