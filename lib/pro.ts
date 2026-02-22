const PRO_STORAGE_KEY = "privacyconvert_pro";

/**
 * Read Pro status from storage. Supports both zustand persist format and simple "1" flag.
 */
export function getIsPro(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(PRO_STORAGE_KEY);
  if (!raw) return false;
  if (raw === "1") return true;
  try {
    const data = JSON.parse(raw) as { state?: { isPro?: boolean } };
    return !!data?.state?.isPro;
  } catch {
    return false;
  }
}
