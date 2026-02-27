/**
 * Roman numeral conversion (1–3999). 100% local, no upload.
 * Standard subtractive notation: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.
 */

const ROMAN_VALUES: { symbol: string; value: number }[] = [
  { symbol: "M", value: 1000 },
  { symbol: "CM", value: 900 },
  { symbol: "D", value: 500 },
  { symbol: "CD", value: 400 },
  { symbol: "C", value: 100 },
  { symbol: "XC", value: 90 },
  { symbol: "L", value: 50 },
  { symbol: "XL", value: 40 },
  { symbol: "X", value: 10 },
  { symbol: "IX", value: 9 },
  { symbol: "V", value: 5 },
  { symbol: "IV", value: 4 },
  { symbol: "I", value: 1 },
];

/** Convert integer 1–3999 to Roman numeral. Returns null if out of range or not integer. */
export function intToRoman(n: number): string | null {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return null;
  let s = "";
  let x = n;
  for (const { symbol, value } of ROMAN_VALUES) {
    while (x >= value) {
      s += symbol;
      x -= value;
    }
  }
  return s;
}

/** Convert Roman numeral string to integer (1–3999). Returns null if invalid. */
export function romanToInt(roman: string): number | null {
  const s = roman.trim().toUpperCase();
  if (!/^[IVXLCDM]+$/.test(s)) return null;
  let num = 0;
  let i = 0;
  for (const { symbol, value } of ROMAN_VALUES) {
    while (s.slice(i, i + symbol.length) === symbol) {
      num += value;
      i += symbol.length;
    }
  }
  if (i !== s.length) return null;
  return num >= 1 && num <= 3999 ? num : null;
}
