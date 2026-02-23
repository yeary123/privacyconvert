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
          proOnly && "border-primary/40 bg-primary/5"
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {name}
            <span className="flex items-center gap-1">
              {proOnly && (
                <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary">
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
