import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - No Upload, Local Converter | PrivacyConvert 2026",
  description:
    "PrivacyConvert privacy policy: we do not collect or store your files. Conversion runs 100% in your browser. No upload, zero privacy risk. 2026.",
  keywords: ["privacy policy", "no upload", "local converter", "data protection", "2026"],
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: 2026. PrivacyConvert — no upload, local conversion.</p>
        </div>

        <section>
          <h2 className="mb-3 text-xl font-semibold">1. What we do</h2>
          <p className="text-muted-foreground">
            PrivacyConvert provides file conversion tools (images, audio, video, documents, units) that run entirely in
            your browser. We do not upload your files to our servers. Conversion happens on your device using
            WebAssembly (e.g. FFmpeg) and other client-side code. No account is required for free, single-file
            conversion.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">2. What we do not collect</h2>
          <p className="text-muted-foreground">
            We do not collect, store, or process the files you convert. Your AVIF, WAV, MP4, PDF, or any other input
            and output files exist only in your browser session. We have no access to them. We do not use your files
            for analytics, advertising, or any other purpose.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">3. Account and Pro</h2>
          <p className="text-muted-foreground">
            If you create an account (e.g. for Pro or history), we store only what is needed to provide the service:
            email, account identifier, and Pro status. We do not store your conversion history content (e.g. file names
            or file data) on our servers beyond what you explicitly save in your history. Payment for Pro is handled by
            third parties (e.g. PayPal); we do not store your payment details.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">4. Cookies and analytics</h2>
          <p className="text-muted-foreground">
            We may use essential cookies for session and authentication. If we use analytics (e.g. to understand traffic
            and errors), we aim to minimise identification and not to link analytics to your converted files. We do not
            sell your data or use it for ad targeting.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">5. Third parties</h2>
          <p className="text-muted-foreground">
            Conversion itself does not send your files to third parties. We may use CDNs to load open-source libraries
            (e.g. FFmpeg.wasm) in your browser; those requests do not include your file content. For payments,
            newsletter, or support, relevant data is handled by the respective providers (e.g. PayPal, email
            provider). Their privacy policies apply to those interactions.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">6. Your rights</h2>
          <p className="text-muted-foreground">
            You can use our conversion tools without an account and without giving us personal data. If you have an
            account, you can request access, correction, or deletion of the data we hold about you by contacting us.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">7. Changes</h2>
          <p className="text-muted-foreground">
            We may update this privacy policy from time to time. The “Last updated” date at the top will be revised. We
            will not reduce your privacy for existing uses of the service without notice where practicable.
          </p>
        </section>

        <p className="pt-4 text-sm text-muted-foreground">
          <Link href="/" className="underline hover:no-underline">
            ← Back to Home
          </Link>
          {" · "}
          <Link href="/terms" className="underline hover:no-underline">
            Terms of Service
          </Link>
          {" · "}
          <Link href="/about" className="underline hover:no-underline">
            About
          </Link>
        </p>
      </div>
    </div>
  );
}
