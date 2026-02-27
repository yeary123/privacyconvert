import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.privacyconvert.online";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/"],
      },
      {
        userAgent: "Googlebot",
        disallow: ["/"],
      },
      {
        userAgent: "Bingbot",
        disallow: ["/"],
      },
    ],
    host: BASE,
  };
}
