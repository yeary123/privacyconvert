/**
 * Frankfurter API currencies and generated pair tools.
 * @see https://api.frankfurter.app/latest
 */

export const FRANKFURTER_CURRENCIES = [
  "AUD", "BRL", "CAD", "CHF", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD",
  "HUF", "IDR", "ILS", "INR", "ISK", "JPY", "KRW", "MXN", "MYR", "NOK",
  "NZD", "PHP", "PLN", "RON", "SEK", "SGD", "THB", "TRY", "USD", "ZAR",
] as const;

export type FrankfurterCurrency = (typeof FRANKFURTER_CURRENCIES)[number];

const PAIR_TOOLS = FRANKFURTER_CURRENCIES.flatMap((from) =>
  FRANKFURTER_CURRENCIES.filter((to) => to !== from).map((to) => ({
    slug: `${from.toLowerCase()}-to-${to.toLowerCase()}` as const,
    name: `${from} to ${to}` as const,
    description: `Convert ${from} to ${to} with live rates` as const,
    category: "units" as const,
    proOnly: false as const,
  }))
);

export const CURRENCY_PAIR_TOOLS = PAIR_TOOLS;

const CURRENCY_PAIR_SLUGS = new Set(PAIR_TOOLS.map((t) => t.slug));

export function isCurrencyPairSlug(slug: string): boolean {
  return CURRENCY_PAIR_SLUGS.has(slug as (typeof PAIR_TOOLS)[number]["slug"]);
}

export function parseCurrencyPairSlug(slug: string): { from: string; to: string } | null {
  const match = slug.match(/^([a-z]{3})-to-([a-z]{3})$/);
  if (!match) return null;
  const [, from, to] = match;
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  if (!FRANKFURTER_CURRENCIES.includes(fromUpper as FrankfurterCurrency)) return null;
  if (!FRANKFURTER_CURRENCIES.includes(toUpper as FrankfurterCurrency)) return null;
  return { from: fromUpper, to: toUpper };
}
