"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Crown, Mail, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage() {
  const { user, isPro, loading, fetchUser, signOut } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Sign in to see your profile and Pro status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button>Sign in</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account and Pro status (synced across devices).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email ?? "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <Crown className={`h-5 w-5 ${isPro ? "text-primary" : "text-muted-foreground"}`} />
            <div>
              <p className="text-sm font-medium">Pro</p>
              <p className="text-sm text-muted-foreground">
                {isPro ? "Lifetime Pro — batch & history unlocked." : "Free — upgrade on Pricing for $9.9 lifetime."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {!isPro && (
              <Link href="/pricing">
                <Button>Upgrade to Pro</Button>
              </Link>
            )}
            <Button variant="outline" onClick={() => signOut()} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
