/**
 * JSON-LD Schema helpers for SEO (FAQ, SoftwareApplication, HowTo, ItemList).
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.privacyconvert.online";

export type FAQItem = { q: string; a: string };

/** Site-wide SoftwareApplication schema for layout. */
export function getSiteSoftwareApplicationSchema() {
  return buildSoftwareApplicationSchema({
    name: "PrivacyConvert",
    description: "100% local file converter. No upload, zero privacy risk. Convert images, audio, video in your browser. 2026.",
    url: SITE_URL,
    applicationCategory: "UtilitiesApplication",
  });
}

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

/**
 * Article schema for convert-page long-form tutorial (SEO, rich results).
 */
export function buildArticleSchema(options: {
  name: string;
  description: string;
  url: string;
  articleBody: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article" as const,
    name: options.name,
    description: options.description,
    url: options.url,
    articleBody: options.articleBody,
    datePublished: options.datePublished ?? "2026-01-01",
    dateModified: options.dateModified ?? "2026-01-01",
  };
}

/**
 * BreadcrumbList schema for convert and other hierarchical pages.
 */
export function buildBreadcrumbListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * ItemList schema for Tools page (list of converters).
 */
export function buildItemListSchema(options: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList" as const,
    name: options.name,
    description: options.description,
    url: options.url,
    numberOfItems: options.items.length,
    itemListElement: options.items.map((item, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      item: {
        "@type": "SoftwareApplication" as const,
        name: item.name,
        url: item.url,
        description: item.description,
      },
    })),
  };
}
