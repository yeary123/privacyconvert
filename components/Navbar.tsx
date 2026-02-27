"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProStore } from "@/store/useProStore";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, isPro } = useAuthStore();
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

        {/* Desktop nav: 统一间距，Pro 与主导航同一组，不单独堆在右侧 */}
        <nav className="hidden items-center gap-3 md:flex">
          {navLinks.map(({ href, label }) => {
            const active = isActivePath(pathname, href);
            return (
              <Link key={href} href={href}>
                <Button variant={active ? "secondary" : "ghost"} size="sm" className={active ? "bg-muted" : undefined}>
                  {label}
                </Button>
              </Link>
            );
          })}
          {!isPro && (
            <Link href="/pricing#pro">
              <Button variant={isActivePath(pathname, "/pricing") ? "secondary" : "ghost"} size="sm" className={isActivePath(pathname, "/pricing") ? "bg-muted" : undefined}>
                Pro
              </Button>
            </Link>
          )}
          {isPro && (
            <Link href="/history">
              <Button variant={isActivePath(pathname, "/history") ? "secondary" : "ghost"} size="sm" className={isActivePath(pathname, "/history") ? "bg-muted" : undefined}>History</Button>
            </Link>
          )}
          {user ? (
            <Link href="/profile" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary ring-1 ring-border" aria-label="Profile">
              {(user.email?.[0] ?? "U").toUpperCase()}
            </Link>
          ) : (
            <Link href="/login">
              <Button variant={isActivePath(pathname, "/login") ? "secondary" : "ghost"} size="sm" className={isActivePath(pathname, "/login") ? "bg-muted" : undefined}>Login</Button>
            </Link>
          )}
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
            {navLinks.map(({ href, label }) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn("rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent", active && "bg-muted")}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
            {isPro && (
              <Link
                href="/history"
                className={cn("rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent", isActivePath(pathname, "/history") && "bg-muted")}
                onClick={() => setMobileOpen(false)}
              >
                History
              </Link>
            )}
            {user ? (
              <Link
                href="/profile"
                className={cn("flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent", isActivePath(pathname, "/profile") && "bg-muted")}
                onClick={() => setMobileOpen(false)}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                  {(user.email?.[0] ?? "U").toUpperCase()}
                </span>
                Profile
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn("rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent", isActivePath(pathname, "/login") && "bg-muted")}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
            {!isPro && (
              <Link
                href="/pricing#pro"
                className="mx-3 mt-2"
                onClick={() => setMobileOpen(false)}
              >
                <Button size="sm" className="w-full">
                  Pro
                </Button>
              </Link>
            )}
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
