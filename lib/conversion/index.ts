/**
 * Conversion service (function layer).
 * UI components call convert(), loadFFmpeg(), etc. and do not contain conversion logic.
 */

export type { ConversionOptions, ConversionResult, ConversionHandler } from "./types";
export { needsFFmpeg, FFMPEG_TOOL_SLUGS } from "./types";
export { convert, hasConvertHandler, loadFFmpeg, getFFmpeg } from "./run";
export {
  convertHeicToJpeg,
  isHeicFile,
  heicToJpgFileName,
  DEFAULT_QUALITY,
} from "@/lib/heicConversion";
