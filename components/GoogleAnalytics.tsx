import Script from "next/script";

// GA4 measurement ID; override with NEXT_PUBLIC_GA_ID in .env.local to disable set to ""
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-C6ZE3ZF599";

/**
 * Google Analytics (GA4). Used in layout for Search Console and analytics.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
