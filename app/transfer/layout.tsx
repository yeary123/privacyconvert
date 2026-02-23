import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "P2P File Transfer - No Upload, Pro | PrivacyConvert 2026",
  description:
    "Send files directly between browsers with PeerJS. No server storage. Pro feature. 2026.",
};

export default function TransferLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
