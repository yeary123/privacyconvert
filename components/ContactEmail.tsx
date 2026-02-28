"use client";

import { useEffect, useState } from "react";

/**
 * Contact email link. Renders mailto only after client mount so the address
 * is not in the initial HTML, reducing exposure to address-harvesting bots.
 * Email is assembled from parts to avoid a single literal in the bundle.
 */
const LOCAL_PART = "support";
const DOMAIN_PART = "privacyconvert.online";

export function ContactEmail({
  label,
  className = "text-muted-foreground hover:text-foreground underline underline-offset-2",
}: {
  /** Link text; default shows the email. */
  label?: string;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span className={className} aria-hidden>
        {label ?? `${LOCAL_PART} [at] ${DOMAIN_PART}`}
      </span>
    );
  }

  const email = `${LOCAL_PART}@${DOMAIN_PART}`;
  const displayText = label ?? email;

  return (
    <a href={`mailto:${email}`} className={className} rel="noopener noreferrer">
      {displayText}
    </a>
  );
}
