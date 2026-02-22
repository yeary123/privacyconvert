import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tools - No Upload, Local Convert | PrivacyConvert 2026",
  description:
    "Browse all file conversion tools. Images, audio, video. 100% in browser, no upload, zero privacy risk. 2026.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
