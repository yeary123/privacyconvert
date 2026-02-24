"use client";

import { CanvasImageConverter } from "@/components/CanvasImageConverter";
import type { ToolSlug } from "@/lib/tools";

const CONFIG = {
  acceptMime: "image/webp",
  acceptExt: [".webp"],
  outputMime: "image/png" as const,
  outputExt: ".png",
  inputExtPattern: /\.webp$/i,
  toolSlug: "webp-to-png" as const,
  ariaLabel: "Drop or select WebP files",
  dropMessage: "Drop WebP files here, or click to select",
};

type Props = { toolSlug?: ToolSlug };

export function WebpToPngConverter({ toolSlug = "webp-to-png" }: Props) {
  return <CanvasImageConverter config={{ ...CONFIG, toolSlug }} />;
}
