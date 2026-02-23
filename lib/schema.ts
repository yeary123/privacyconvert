/**
 * JSON-LD Schema helpers for SEO (FAQ, SoftwareApplication).
 */

export type FAQItem = { q: string; a: string };

export function buildFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.a,
      },
    })),
  };
}

export function buildSoftwareApplicationSchema(options: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication" as const,
    name: options.name,
    description: options.description,
    url: options.url,
    applicationCategory: options.applicationCategory ?? "UtilitiesApplication",
  };
}

export function buildHowToSchema(options: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo" as const,
    name: options.name,
    description: options.description,
    totalTime: options.totalTime ?? "PT2M",
    step: options.steps.map((s, i) => ({
      "@type": "HowToStep" as const,
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function schemaToScript(schema: object): string {
  return JSON.stringify(schema);
}
