"use client";

import { CanvasImageConverter } from "@/components/CanvasImageConverter";

const CONFIG = {
  acceptMime: "image/png",
  acceptExt: [".png"],
  outputMime: "image/jpeg" as const,
  outputExt: ".jpg",
  inputExtPattern: /\.png$/i,
  quality: 0.92,
  toolSlug: "png-to-jpeg",
  ariaLabel: "Drop or select PNG files",
  dropMessage: "Drop PNG files here, or click to select",
};

type Props = { toolSlug?: string };

export function PngToJpegConverter({ toolSlug = "png-to-jpeg" }: Props) {
  return <CanvasImageConverter config={{ ...CONFIG, toolSlug }} />;
}
