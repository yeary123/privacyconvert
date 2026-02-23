import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools";
import { buildItemListSchema } from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://privacyconvert.com";

export const metadata: Metadata = {
  title: "All Tools - No Upload, Local Convert | PrivacyConvert 2026",
  description:
    "Browse all file conversion tools. Images, audio, video. 100% in browser, no upload, zero privacy risk. 2026.",
};

const TOOLS_ITEMLIST_SCHEMA = buildItemListSchema({
  name: "PrivacyConvert Tools",
  description: "Local file conversion tools. No upload, zero privacy risk. 2026.",
  url: `${SITE_URL}/tools`,
  items: TOOLS.map((t) => ({
    name: t.name,
    url: `${SITE_URL}/convert/${t.slug}`,
    description: t.description,
  })),
});

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
      {children}
    </>
  );
}
