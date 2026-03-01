"use client";

import { CanvasImageConverter } from "@/components/CanvasImageConverter";
import type { ToolSlug } from "@/lib/tools";

const CONFIG = {
  acceptMime: "image/png",
  acceptExt: [".png"],
  outputMime: "image/jpeg" as const,
  outputExt: ".jpg",
  inputExtPattern: /\.png$/i,
  quality: 0.92,
  toolSlug: "png-to-jpeg" as const,
  ariaLabel: "Drop or select PNG files",
  dropMessage: "Drop PNG files (.png) here, or click to select",
};

type Props = { toolSlug?: ToolSlug };

export function PngToJpegConverter({ toolSlug = "png-to-jpeg" }: Props) {
  return <CanvasImageConverter config={{ ...CONFIG, toolSlug }} />;
}
