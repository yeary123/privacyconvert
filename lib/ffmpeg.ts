import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const CORE_VERSION = "0.12.10";
const BASE_URL = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export type LoadProgress = { phase: "loading"; percent: number } | { phase: "done" };

/**
 * Lazy-load FFmpeg with optional progress callback.
 * Uses single shared instance.
 */
export async function loadFFmpeg(
  onProgress?: (p: LoadProgress) => void
): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();
    const report = (percent: number) => onProgress?.({ phase: "loading", percent });
    report(0);
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
      });
    } finally {
      report(100);
      onProgress?.({ phase: "done" });
    }
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return loadPromise;
}

export function getFFmpeg(): FFmpeg | null {
  return ffmpegInstance;
}
