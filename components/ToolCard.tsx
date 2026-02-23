import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolCardProps = {
  slug: string;
  name: string;
  description: string;
  category?: string;
  proOnly?: boolean;
};

export function ToolCard({ slug, name, description, category, proOnly }: ToolCardProps) {
  return (
    <Link href={`/convert/${slug}`}>
      <Card
        className={cn(
          "h-full transition-colors hover:bg-muted/50",
          proOnly && "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {name}
            <span className="flex items-center gap-1">
              {proOnly && (
                <span className="rounded-full bg-primary/25 px-2 py-0.5 text-xs font-semibold text-primary">
                  Pro
                </span>
              )}
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
