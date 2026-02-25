import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools";
import { TOOLS_FAQ } from "@/lib/toolsFaq";
import { buildItemListSchema, buildFAQSchema } from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.privacyconvert.online";

const TOOLS_TITLE = "All Tools No Upload – 100% Local Browser Converter 2026";
const TOOLS_DESCRIPTION =
  "No upload, 100% local in browser. Privacy-first. 200+ formats—images, audio, video, document. Your files never leave your device. 2026. Free & Pro.";

export const metadata: Metadata = {
  title: TOOLS_TITLE,
  description: TOOLS_DESCRIPTION,
  openGraph: {
    title: TOOLS_TITLE,
    description: TOOLS_DESCRIPTION,
  },
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
