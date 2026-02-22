import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

type ToolCardProps = {
  slug: string;
  name: string;
  description: string;
  category?: string;
};

export function ToolCard({ slug, name, description, category }: ToolCardProps) {
  return (
    <Link href={`/convert/${slug}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {name}
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
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
