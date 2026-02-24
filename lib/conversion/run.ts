/**
 * Conversion handlers (function layer).
 * Each handler takes a File and options, returns { blob, suggestedName }.
 */

import { fetchFile } from "@ffmpeg/util";
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import type { ToolSlug } from "@/lib/tools";
import type { ConversionHandler, ConversionOptions } from "./types";
import { loadFFmpeg, getFFmpeg } from "@/lib/ffmpeg";
import { convertImageFile, DEFAULT_JPEG_QUALITY } from "@/lib/imageConversion";
import { WAV_MP3_WORKER_CODE } from "@/lib/wavMp3WorkerCode";

async function withFFmpeg(
  options: ConversionOptions,
  fn: (ffmpeg: FFmpeg) => Promise<void>
): Promise<void> {
  const ffmpeg = await loadFFmpeg((p) => {
    if (p.phase === "loading" && options.onProgress) {
      options.onProgress(p.percent);
    }
  });
  if (!ffmpeg) throw new Error("FFmpeg not loaded");
  const off = (e: { progress?: number }) => {
    options.onProgress?.(Math.round((e.progress ?? 0) * 100));
  };
  ffmpeg.on("progress", off);
  try {
    await fn(ffmpeg);
  } finally {
    ffmpeg.off("progress", off);
  }
}

function wavToMp3Handler(file: File, _options: ConversionOptions): Promise<{ blob: Blob; suggestedName: string }> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([WAV_MP3_WORKER_CODE], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    URL.revokeObjectURL(url);
    const onMessage = (e: MessageEvent) => {
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      const { ok, blob: resultBlob, error: msg } = e.data ?? {};
      if (ok && resultBlob) {
        resolve({
          blob: resultBlob,
          suggestedName: file.name.replace(/\.wav$/i, ".mp3"),
        });
      } else {
        reject(new Error(msg || "Conversion failed"));
      }
    };
    const onError = () => {
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      reject(new Error("Worker error"));
    };
    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);
    file.arrayBuffer().then((buf) => worker.postMessage(buf));
  });
}

const handlers: Partial<Record<ToolSlug, ConversionHandler>> = {
  "avif-to-png": async (file, _options) => {
    const blob = await convertImageFile(file, "image/png");
    return {
      blob,
      suggestedName: file.name.replace(/\.avif$/i, ".png"),
    };
  },
  "webp-to-png": async (file, _options) => {
    const blob = await convertImageFile(file, "image/png");
    return {
      blob,
      suggestedName: file.name.replace(/\.webp$/i, ".png"),
    };
  },
  "png-to-jpeg": async (file, _options) => {
    const blob = await convertImageFile(file, "image/jpeg", DEFAULT_JPEG_QUALITY);
    return {
      blob,
      suggestedName: file.name.replace(/\.png$/i, ".jpg"),
    };
  },
  "wav-to-mp3": wavToMp3Handler,
  "ogg-to-mp3": async (file, options) => {
    let result: { blob: Blob; suggestedName: string } | null = null;
    const id = Math.random().toString(36).slice(2, 10);
    await withFFmpeg(options, async (ffmpeg) => {
      const inName = `input_${id}.ogg`;
      const outName = `output_${id}.mp3`;
      const data = await fetchFile(file);
      await ffmpeg.writeFile(inName, data);
      await ffmpeg.exec(["-i", inName, "-codec:a", "libmp3lame", "-q:a", "2", outName]);
      const outData = await ffmpeg.readFile(outName);
      await ffmpeg.deleteFile(inName);
      await ffmpeg.deleteFile(outName);
      result = {
        blob: new Blob([outData as BlobPart], { type: "audio/mpeg" }),
        suggestedName: file.name.replace(/\.ogg$/i, ".mp3"),
      };
    });
    if (!result) throw new Error("Conversion failed");
    return result;
  },
  "mp4-to-webm": async (file, options) => {
    let result: { blob: Blob; suggestedName: string } | null = null;
    const id = Math.random().toString(36).slice(2, 10);
    await withFFmpeg(options, async (ffmpeg) => {
      const inName = `input_${id}.mp4`;
      const outName = `output_${id}.webm`;
      const data = await fetchFile(file);
      await ffmpeg.writeFile(inName, data);
      await ffmpeg.exec(["-i", inName, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libopus", outName]);
      const outData = await ffmpeg.readFile(outName);
      await ffmpeg.deleteFile(inName);
      await ffmpeg.deleteFile(outName);
      result = {
        blob: new Blob([outData as BlobPart], { type: "video/webm" }),
        suggestedName: file.name.replace(/\.mp4$/i, ".webm"),
      };
    });
    if (!result) throw new Error("Conversion failed");
    return result;
  },
  "gif-to-mp4": async (file, options) => {
    let result: { blob: Blob; suggestedName: string } | null = null;
    const id = Math.random().toString(36).slice(2, 10);
    await withFFmpeg(options, async (ffmpeg) => {
      const inName = `input_${id}.gif`;
      const outName = `output_${id}.mp4`;
      const data = await fetchFile(file);
      await ffmpeg.writeFile(inName, data);
      await ffmpeg.exec(["-i", inName, "-movflags", "+faststart", "-pix_fmt", "yuv420p", outName]);
      const outData = await ffmpeg.readFile(outName);
      await ffmpeg.deleteFile(inName);
      await ffmpeg.deleteFile(outName);
      result = {
        blob: new Blob([outData as BlobPart], { type: "video/mp4" }),
        suggestedName: file.name.replace(/\.gif$/i, ".mp4"),
      };
    });
    if (!result) throw new Error("Conversion failed");
    return result;
  },
};

/** Convert a single file using the registered handler for the given tool. */
export async function convert(
  slug: ToolSlug,
  file: File,
  options: ConversionOptions = {}
): Promise<{ blob: Blob; suggestedName: string }> {
  const handler = handlers[slug];
  if (!handler) {
    throw new Error(`No conversion handler for tool: ${slug}`);
  }
  return handler(file, options);
}

/** Whether the tool has a blob-based conversion handler (excludes HEIC/PDF). */
export function hasConvertHandler(slug: ToolSlug): boolean {
  return slug in handlers;
}

export { loadFFmpeg, getFFmpeg } from "@/lib/ffmpeg";
