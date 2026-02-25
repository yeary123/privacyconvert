/**
 * Unified metadata for all /convert/* tool pages.
 * Title: "XXX to YYY No Upload – 100% Local Browser Converter 2026 | PrivacyConvert"
 * Description: 150–160 chars, must include no upload, 100% local, 200+ formats, 2026, privacy.
 */

const SITE = "PrivacyConvert";

export function getConvertPageTitle(toolName: string): string {
  return `${toolName} No Upload – 100% Local Browser Converter 2026 | ${SITE}`;
}

/**
 * Meta description 150–160 chars. Includes: no upload, 100% local, 200+ formats, 2026, privacy.
 */
export function getConvertPageDescription(toolName: string): string {
  return `${toolName}: no upload, 100% local in browser. Privacy-first. Part of 200+ format tools on ${SITE}. Your files never leave your device. 2026. Free & Pro.`;
}

export function getConvertMetadata(toolName: string): {
  title: string;
  description: string;
  openGraph: { title: string; description: string };
} {
  const title = getConvertPageTitle(toolName);
  const description = getConvertPageDescription(toolName);
  return {
    title,
    description,
    openGraph: { title, description },
  };
}
