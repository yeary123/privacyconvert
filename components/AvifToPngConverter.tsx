"use client";

import { CanvasImageConverter } from "@/components/CanvasImageConverter";
import type { ToolSlug } from "@/lib/tools";

const CONFIG = {
  acceptMime: "image/avif",
  acceptExt: [".avif"],
  outputMime: "image/png" as const,
  outputExt: ".png",
  inputExtPattern: /\.avif$/i,
  toolSlug: "avif-to-png" as const,
  ariaLabel: "Drop or select AVIF files",
  dropMessage: "Drop AVIF files here, or click to select",
};

type Props = { toolSlug?: ToolSlug };

export function AvifToPngConverter({ toolSlug = "avif-to-png" }: Props) {
  return <CanvasImageConverter config={{ ...CONFIG, toolSlug }} />;
}
