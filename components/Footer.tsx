import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PrivacyConvert. 100% client-side, no upload.{" "}
            <Link href="/pricing" className="underline hover:text-foreground">Donate / Pro</Link>
          </div>
          <nav className="flex gap-6 text-sm">
            <Link href="/tools" className="text-muted-foreground hover:text-foreground">
              Tools
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground">
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
