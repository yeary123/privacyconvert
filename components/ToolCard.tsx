import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

/** Pro badge: only visual difference for Pro cards. Shown in top-right of card. */
function ProBadgePill() {
  return (
    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
      Pro
    </span>
  );
}

export type ToolCardProps = {
  slug: string;
  name: string;
  description: string;
  category?: string;
  proOnly?: boolean;
  /** If not set, defaults to /convert/{slug}. */
  href?: string;
};

/**
 * Reusable tool card. Pro and non-Pro cards share identical styling (background, border);
 * only difference is the optional Pro badge in the top-right.
 */
export function ToolCard({ slug, name, description, category, proOnly, href }: ToolCardProps) {
  const linkHref = href ?? `/convert/${slug}`;
  return (
    <Link href={linkHref} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="hover:underline">{name}</span>
            <span className="flex items-center gap-1">
              {proOnly && <ProBadgePill />}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
          {category && (
            <span className="text-xs text-muted-foreground capitalize">{category}</span>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
