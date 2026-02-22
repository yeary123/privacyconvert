import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          PrivacyConvert
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/tools">
            <Button variant="ghost" size="sm">
              Tools
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              Pricing
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" size="sm">
              About
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              Blog
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="sm">Pro</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
