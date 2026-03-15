#!/usr/bin/env node
/**
 * Submit site URLs to IndexNow (Bing, Yandex, etc.).
 *
 * Prerequisites:
 * 1. Set INDEXNOW_KEY in your env (8–128 chars, a-z, A-Z, 0-9, hyphens).
 *    Generate at: https://www.bing.com/indexnow/getstarted
 * 2. Deploy the site so the key file is live: https://YOUR_SITE/{INDEXNOW_KEY}.txt
 *
 * Usage:
 *   BASE_URL=https://www.privacyconvert.online INDEXNOW_KEY=your-key node scripts/indexnow-submit.mjs
 *   Or set env in .env.local and run: node scripts/indexnow-submit.mjs
 *
 * The script fetches sitemap.xml from BASE_URL, extracts <loc> URLs, and POSTs
 * them to https://api.indexnow.org/indexnow (batch, up to 10,000 per request).
 */

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.privacyconvert.online";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

if (!INDEXNOW_KEY) {
  console.error("Set INDEXNOW_KEY (and optionally BASE_URL) in the environment.");
  process.exit(1);
}

const host = new URL(BASE_URL).host;
const keyLocation = `${BASE_URL.replace(/\/$/, "")}/${INDEXNOW_KEY}.txt`;
const indexNowUrl = "https://api.indexnow.org/indexnow";

async function fetchSitemapUrls() {
  const sitemapUrl = `${BASE_URL.replace(/\/$/, "")}/sitemap.xml`;
  const res = await fetch(sitemapUrl);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status} ${sitemapUrl}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  return locs;
}

async function submitBatch(urlList) {
  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList,
  };
  const res = await fetch(indexNowUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  return { status: res.status, ok: res.ok };
}

async function main() {
  const urls = await fetchSitemapUrls();
  console.log(`Found ${urls.length} URLs in sitemap. Submitting to IndexNow...`);
  const batchSize = 10000;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const { status, ok } = await submitBatch(batch);
    if (ok) {
      console.log(`Batch ${Math.floor(i / batchSize) + 1}: ${status} OK (${batch.length} URLs).`);
    } else {
      console.error(`Batch ${Math.floor(i / batchSize) + 1}: ${status} failed.`);
      process.exit(1);
    }
  }
  console.log("Done. Verify in Bing Webmaster Tools.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
