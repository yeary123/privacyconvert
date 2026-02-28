import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { PwaRegister } from "@/components/PwaRegister";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthInit } from "@/components/AuthInit";
import { getSiteSoftwareApplicationSchema } from "@/lib/schema";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.privacyconvert.online"),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  title: {
    default: "PrivacyConvert - 100% Local File Converter | No Upload, Zero Privacy Risk | 2026",
    template: "%s | PrivacyConvert",
  },
  description:
    "Convert images, audio, video locally in your browser. No upload, no server, zero privacy risk. Free & Pro. 2026.",
  keywords: ["file converter", "local convert", "no upload", "privacy", "browser", "AVIF", "MP3", "WAV"],
  authors: [{ name: "PrivacyConvert" }],
  openGraph: {
    title: "PrivacyConvert - Local File Converter, No Upload 2026",
    description: "100% browser-side conversion. No upload 2026, zero privacy risk.",
    type: "website",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#171717" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  appleWebApp: {
    capable: true,
    title: "PrivacyConvert",
    statusBarStyle: "default",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-C6ZE3ZF599";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const softwareSchema = getSiteSoftwareApplicationSchema();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: [
                  "window.dataLayer = window.dataLayer || [];",
                  "function gtag(){dataLayer.push(arguments);}",
                  "gtag('js', new Date());",
                  `gtag('config', '${GA_ID}', { send_page_view: true, anonymize_ip: true });`,
                ].join("\n"),
              }}
            />
          </>
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <PwaRegister />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthInit />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
