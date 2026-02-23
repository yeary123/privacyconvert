"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProStore } from "@/store/useProStore";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isPro = useAuthStore((s) => s.isPro);
  const hydrate = useProStore((s) => s.hydrate);
  useEffect(() => setMounted(true), []);
  useEffect(() => { hydrate(); }, [hydrate]);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground hover:opacity-90"
        >
          <Shield className="h-5 w-5 text-primary" aria-hidden />
          <span>PrivacyConvert</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}>
              <Button variant="ghost" size="sm">
                {label}
              </Button>
            </Link>
          ))}
          {isPro && (
            <Link href="/history">
              <Button variant="ghost" size="sm">History</Button>
            </Link>
          )}
          <Link href="/profile">
              <Button variant="ghost" size="sm">Profile</Button>
            </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/pricing#pro">
            <Button size="sm">Pro</Button>
          </Link>
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
        </nav>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container flex flex-col gap-0 py-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            {isPro && (
              <Link
                href="/history"
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                History
              </Link>
            )}
            <Link
              href="/profile"
              className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
              onClick={() => setMobileOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/login"
              className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/pricing#pro"
              className="mx-3 mt-2"
              onClick={() => setMobileOpen(false)}
            >
              <Button size="sm" className="w-full">
                Pro
              </Button>
            </Link>
            {mounted && (
              <button
                type="button"
                className="mx-3 mt-2 flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
                onClick={() => { toggleTheme(); setMobileOpen(false); }}
              >
                {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {resolvedTheme === "dark" ? "Light" : "Dark"}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
