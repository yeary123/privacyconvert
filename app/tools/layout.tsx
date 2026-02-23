import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools";
import { TOOLS_FAQ } from "@/lib/toolsFaq";
import { buildItemListSchema, buildFAQSchema } from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://privacyconvert.com";

export const metadata: Metadata = {
  title: "All Tools - No Upload 2026, Local Convert | PrivacyConvert",
  description:
    "Browse all file conversion tools. No upload 2026, privacy first. Images, audio, video. 100% in browser, zero privacy risk.",
};

const TOOLS_ITEMLIST_SCHEMA = buildItemListSchema({
  name: "PrivacyConvert Tools",
  description: "Local file conversion tools. No upload 2026, zero privacy risk.",
  url: `${SITE_URL}/tools`,
  items: TOOLS.map((t) => ({
    name: t.name,
    url: `${SITE_URL}/convert/${t.slug}`,
    description: t.description,
  })),
});

const TOOLS_FAQ_SCHEMA = buildFAQSchema(TOOLS_FAQ);

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOLS_ITEMLIST_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOLS_FAQ_SCHEMA) }}
      />
      {children}
    </>
  );
}
