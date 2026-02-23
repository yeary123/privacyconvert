import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "P2P Batch Transfer - No Upload, Pro | PrivacyConvert 2026",
  description:
    "Send files directly between browsers. No upload, no server storage. PeerJS P2P. Pro feature. 2026.",
};

export default function TransferLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
