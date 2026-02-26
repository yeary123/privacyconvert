/**
 * Number base (radix) converter: binary, octal, decimal, hexadecimal.
 * Used for the hub page (base-converter) and pair pages (e.g. binary-to-decimal).
 */

export const BASE_OPTIONS = [
  { value: 2, label: "Binary (2)" },
  { value: 8, label: "Octal (8)" },
  { value: 10, label: "Decimal (10)" },
  { value: 16, label: "Hexadecimal (16)" },
] as const;

export const BASE_BY_NAME: Record<string, number> = {
  binary: 2,
  octal: 8,
  decimal: 10,
  hex: 16,
  hexadecimal: 16,
};

/** Slug prefix to base number for pair pages (e.g. "binary" -> 2). */
export const BASE_NAME_FROM_SLUG: Record<string, number> = {
  binary: 2,
  octal: 8,
  decimal: 10,
  hex: 16,
};

/** All pair slugs for base conversion (e.g. binary-to-decimal). */
export const BASE_PAIR_SLUGS = [
  "binary-to-decimal",
  "decimal-to-binary",
  "binary-to-octal",
  "octal-to-binary",
  "binary-to-hex",
  "hex-to-binary",
  "decimal-to-octal",
  "octal-to-decimal",
  "decimal-to-hex",
  "hex-to-decimal",
  "octal-to-hex",
  "hex-to-octal",
] as const;

export type BasePairSlug = (typeof BASE_PAIR_SLUGS)[number];

/** Parse slug like "binary-to-decimal" into { fromBase: 2, toBase: 10 }. */
export function getBasesFromPairSlug(slug: string): { fromBase: number; toBase: number } | null {
  const parts = slug.split("-to-");
  if (parts.length !== 2) return null;
  const [fromName, toName] = parts;
  const fromBase = BASE_NAME_FROM_SLUG[fromName];
  const toBase = BASE_NAME_FROM_SLUG[toName];
  if (fromBase == null || toBase == null) return null;
  return { fromBase, toBase };
}

export function isBasePairSlug(slug: string): slug is BasePairSlug {
  return (BASE_PAIR_SLUGS as readonly string[]).includes(slug);
}

const VALID_CHARS: Record<number, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9a-fA-F]+$/,
};

/**
 * Convert a string in given radix to decimal (number).
 * Returns null if input is invalid for that base.
 */
export function parseBase(value: string, fromRadix: number): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const re = VALID_CHARS[fromRadix];
  if (re && !re.test(trimmed)) return null;
  const num = parseInt(trimmed, fromRadix);
  return Number.isFinite(num) ? num : null;
}

/**
 * Convert decimal number to string in target radix.
 */
export function toBase(num: number, toRadix: number): string {
  if (!Number.isFinite(num) || num < 0) return "0";
  return num.toString(toRadix);
}

/** Convert from one base to another. Returns result string or null if input invalid. */
export function convertBase(value: string, fromRadix: number, toRadix: number): string | null {
  const decimal = parseBase(value, fromRadix);
  if (decimal === null) return null;
  return toBase(decimal, toRadix);
}
