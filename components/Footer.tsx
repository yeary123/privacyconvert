import Link from "next/link";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/NewsletterForm";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/transfer", label: "P2P Transfer" },
];

const DONATE_URL = "https://www.buymeacoffee.com/privacyconvert";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-2 font-semibold">PrivacyConvert</p>
            <p className="text-sm text-muted-foreground">
              100% client-side conversion. No upload, no server, zero privacy risk. 2026.
            </p>
          </div>
          <div>
            <p className="mb-2 font-semibold">Newsletter</p>
            <p className="mb-2 text-sm text-muted-foreground">Tips and updates. No spam.</p>
            <NewsletterForm />
          </div>
          <div>
            <p className="mb-2 font-semibold">Links</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {footerLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="mb-2 font-semibold">Support</p>
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm">
                <Coffee className="mr-2 h-4 w-4" />
                Donate
              </Button>
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {year} PrivacyConvert. All rights reserved. Local conversion only — no upload.
        </div>
      </div>
    </footer>
  );
}
