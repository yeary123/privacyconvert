/**
 * Convert Salesforce metadata/code from API version 15 to 18.
 * Updates package.xml <version>, *-meta.xml apiVersion, and similar patterns.
 * Browser-only; no upload.
 */

const TO_MAJOR = 18;

/**
 * Replaces Salesforce API version references from 15 to 18 in file content.
 * Handles: package.xml <version>15.0</version>, *-meta.xml apiVersion="15"|"15.0", <version>15</version>, and standalone 15.0.
 */
export function convertSalesforce15To18(content: string): string {
  let out = content;
  // Explicit version attributes (avoid touching other "15.0" in content)
  out = out.replace(/apiVersion="15\.0"/g, 'apiVersion="18.0"');
  out = out.replace(/apiVersion='15\.0'/g, "apiVersion='18.0'");
  out = out.replace(/apiVersion="15"/g, 'apiVersion="18"');
  out = out.replace(/apiVersion='15'/g, "apiVersion='18'");
  out = out.replace(/<version>15\.0<\/version>/gi, "<version>18.0</version>");
  out = out.replace(/<version>15<\/version>/g, "<version>18</version>");
  // sourceAPIVersion in sfdx-project.json
  out = out.replace(/"sourceAPIVersion"\s*:\s*"15\.0"/g, '"sourceAPIVersion": "18.0"');
  out = out.replace(/"sourceAPIVersion"\s*:\s*"15"/g, '"sourceAPIVersion": "18"');
  // Any remaining standalone 15.0 (e.g. in comments or other version refs)
  out = out.replace(/\b15\.0\b/g, "18.0");
  return out;
}

/**
 * Converts a single Salesforce metadata/source file (text) from API 15 to 18.
 */
export function convertSalesforceFile15To18(file: File): Promise<{ blob: Blob; suggestedName: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const converted = convertSalesforce15To18(text);
      const base = file.name.replace(/\.[^.]+$/, "") || "metadata";
      const ext = (file.name.match(/\.[^.]+$/) || [".xml"])[0];
      const suggestedName = `${base}-v${TO_MAJOR}${ext}`;
      const blob = new Blob([converted], { type: file.type || "text/plain" });
      resolve({ blob, suggestedName });
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsText(file, "UTF-8");
  });
}
