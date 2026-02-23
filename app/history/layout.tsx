import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversion History - Pro | PrivacyConvert 2026",
  description: "View your conversion history. Pro feature. No upload, privacy first. 2026.",
};

export default function HistoryLayout({
  children,
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
