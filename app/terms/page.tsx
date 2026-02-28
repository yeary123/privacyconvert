import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - No Upload, Local Converter | PrivacyConvert 2026",
  description:
    "Terms of use for PrivacyConvert. Use our local, in-browser converters responsibly. No upload, privacy first. 2026.",
  keywords: ["terms of service", "terms of use", "local converter", "no upload", "2026"],
};

export default function TermsPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: 2026. Please read before using PrivacyConvert.</p>
        </div>

        <section>
          <h2 className="mb-3 text-xl font-semibold">1. Acceptance</h2>
          <p className="text-muted-foreground">
            By using PrivacyConvert (“the site”, “we”, “our”), you agree to these terms. If you do not agree, please
            do not use the site. We provide in-browser conversion tools; conversion runs on your device and we do not
            receive your files.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">2. Use of the service</h2>
          <p className="text-muted-foreground">
            You may use our conversion tools for lawful, personal or professional purposes. You must not use the site to
            convert, distribute, or store content that infringes copyright, is illegal, or violates others’ rights. You
            are responsible for ensuring you have the right to convert and use the files you process. We do not
            guarantee that every format or file will convert correctly; use the results at your own discretion.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">3. No upload</h2>
          <p className="text-muted-foreground">
            Our core conversion runs in your browser. Your files are not uploaded to our servers for conversion. We do
            not store or analyse the content you convert. Some features (e.g. fetching exchange rates for the currency
            converter) may involve network requests; those do not include your file data.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">4. Accounts and Pro</h2>
          <p className="text-muted-foreground">
            Free use does not require an account. If you create an account or subscribe to Pro, you must provide
            accurate information and keep your credentials secure. Pro benefits (e.g. batch conversion, history) are
            subject to the plan you choose. Refunds are handled according to the payment provider (e.g. PayPal) and our
            stated policy at the time of purchase.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">5. Disclaimer</h2>
          <p className="text-muted-foreground">
            The site and tools are provided “as is”. We do not warrant uninterrupted, error-free, or secure operation.
            We are not liable for any loss or damage arising from your use of the site or converted output. You use
            the tools at your own risk.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">6. Intellectual property</h2>
          <p className="text-muted-foreground">
            The site’s design, text, and code (except where we use open-source under their licences) are ours or our
            licensors’. You do not acquire any right to our branding or technology beyond using the site as intended.
            Your files and conversion results remain yours; we do not claim ownership of them.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">7. Changes to terms</h2>
          <p className="text-muted-foreground">
            We may update these terms. The “Last updated” date will change. Continued use after changes means you
            accept the updated terms. We encourage you to check this page periodically.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">8. Contact</h2>
          <p className="text-muted-foreground">
            For questions about these terms or the service, please use the contact option provided on the site (e.g.
            About page or support link).
          </p>
        </section>

        <p className="pt-4 text-sm text-muted-foreground">
          <Link href="/" className="underline hover:no-underline">
            ← Back to Home
          </Link>
          {" · "}
          <Link href="/privacy" className="underline hover:no-underline">
            Privacy Policy
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
