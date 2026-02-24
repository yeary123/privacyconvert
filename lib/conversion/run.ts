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

function ffmpegAudioHandler(
  inExt: string,
  outExt: string,
  outMime: string,
  outSuffix: string,
  inputPattern: RegExp
): ConversionHandler {
  return async (file, options) => {
    let result: { blob: Blob; suggestedName: string } | null = null;
    const id = Math.random().toString(36).slice(2, 10);
    const inName = `input_${id}.${inExt}`;
    const outName = `output_${id}.${outExt}`;
    await withFFmpeg(options, async (ffmpeg) => {
      const data = await fetchFile(file);
      await ffmpeg.writeFile(inName, data);
      if (outExt === "mp3") {
        await ffmpeg.exec(["-i", inName, "-codec:a", "libmp3lame", "-q:a", "2", outName]);
      } else if (outExt === "wav") {
        await ffmpeg.exec(["-i", inName, "-acodec", "pcm_s16le", outName]);
      } else if (outExt === "ogg") {
        await ffmpeg.exec(["-i", inName, "-codec:a", "libvorbis", "-q:a", "4", outName]);
      } else {
        await ffmpeg.exec(["-i", inName, outName]);
      }
      const outData = await ffmpeg.readFile(outName);
      await ffmpeg.deleteFile(inName);
      await ffmpeg.deleteFile(outName);
      result = {
        blob: new Blob([outData as BlobPart], { type: outMime }),
        suggestedName: file.name.replace(inputPattern, outSuffix),
      };
    });
    if (!result) throw new Error("Conversion failed");
    return result;
  };
}

function ffmpegVideoHandler(
  inExt: string,
  outExt: string,
  outMime: string,
  outSuffix: string,
  inputPattern: RegExp
): ConversionHandler {
  return async (file, options) => {
    let result: { blob: Blob; suggestedName: string } | null = null;
    const id = Math.random().toString(36).slice(2, 10);
    const inName = `input_${id}.${inExt}`;
    const outName = `output_${id}.${outExt}`;
    await withFFmpeg(options, async (ffmpeg) => {
      const data = await fetchFile(file);
      await ffmpeg.writeFile(inName, data);
      if (outExt === "mp4") {
        await ffmpeg.exec(["-i", inName, "-c", "copy", "-movflags", "+faststart", outName]);
      } else if (outExt === "webm") {
        await ffmpeg.exec(["-i", inName, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libopus", outName]);
      } else {
        await ffmpeg.exec(["-i", inName, outName]);
      }
      const outData = await ffmpeg.readFile(outName);
      await ffmpeg.deleteFile(inName);
      await ffmpeg.deleteFile(outName);
      result = {
        blob: new Blob([outData as BlobPart], { type: outMime }),
        suggestedName: file.name.replace(inputPattern, outSuffix),
      };
    });
    if (!result) throw new Error("Conversion failed");
    return result;
  };
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
  "jpeg-to-png": async (file, _options) => {
    const blob = await convertImageFile(file, "image/png");
    return {
      blob,
      suggestedName: file.name.replace(/\.(jpe?g|jfif)$/i, ".png"),
    };
  },
  "png-to-webp": async (file, _options) => {
    const blob = await convertImageFile(file, "image/webp", DEFAULT_JPEG_QUALITY);
    return {
      blob,
      suggestedName: file.name.replace(/\.png$/i, ".webp"),
    };
  },
  "webp-to-jpeg": async (file, _options) => {
    const blob = await convertImageFile(file, "image/jpeg", DEFAULT_JPEG_QUALITY);
    return {
      blob,
      suggestedName: file.name.replace(/\.webp$/i, ".jpg"),
    };
  },
  "jpeg-to-webp": async (file, _options) => {
    const blob = await convertImageFile(file, "image/webp", DEFAULT_JPEG_QUALITY);
    return {
      blob,
      suggestedName: file.name.replace(/\.(jpe?g|jfif)$/i, ".webp"),
    };
  },
  "bmp-to-png": async (file, _options) => {
    const blob = await convertImageFile(file, "image/png");
    return {
      blob,
      suggestedName: file.name.replace(/\.bmp$/i, ".png"),
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
  // Audio (FFmpeg)
  "mp3-to-wav": ffmpegAudioHandler("mp3", "wav", "audio/wav", ".wav", /\.mp3$/i),
  "flac-to-mp3": ffmpegAudioHandler("flac", "mp3", "audio/mpeg", ".mp3", /\.flac$/i),
  "m4a-to-mp3": ffmpegAudioHandler("m4a", "mp3", "audio/mpeg", ".mp3", /\.m4a$/i),
  "wav-to-ogg": ffmpegAudioHandler("wav", "ogg", "audio/ogg", ".ogg", /\.wav$/i),
  "aac-to-mp3": ffmpegAudioHandler("aac", "mp3", "audio/mpeg", ".mp3", /\.aac$/i),
  "ogg-to-wav": ffmpegAudioHandler("ogg", "wav", "audio/wav", ".wav", /\.ogg$/i),
  "mp3-to-ogg": ffmpegAudioHandler("mp3", "ogg", "audio/ogg", ".ogg", /\.mp3$/i),
  // Video (FFmpeg)
  "webm-to-mp4": ffmpegVideoHandler("webm", "mp4", "video/mp4", ".mp4", /\.webm$/i),
  "mov-to-mp4": ffmpegVideoHandler("mov", "mp4", "video/mp4", ".mp4", /\.mov$/i),
  "mkv-to-mp4": ffmpegVideoHandler("mkv", "mp4", "video/mp4", ".mp4", /\.mkv$/i),
  "avi-to-mp4": ffmpegVideoHandler("avi", "mp4", "video/mp4", ".mp4", /\.avi$/i),
  "gif-to-webm": ffmpegVideoHandler("gif", "webm", "video/webm", ".webm", /\.gif$/i),
  "mp4-to-gif": async (file, options) => {
    let result: { blob: Blob; suggestedName: string } | null = null;
    const id = Math.random().toString(36).slice(2, 10);
    await withFFmpeg(options, async (ffmpeg) => {
      const inName = `input_${id}.mp4`;
      const outName = `output_${id}.gif`;
      const data = await fetchFile(file);
      await ffmpeg.writeFile(inName, data);
      await ffmpeg.exec(["-i", inName, "-vf", "fps=10,scale=320:-1:flags=lanczos", "-c:v", "gif", outName]);
      const outData = await ffmpeg.readFile(outName);
      await ffmpeg.deleteFile(inName);
      await ffmpeg.deleteFile(outName);
      result = {
        blob: new Blob([outData as BlobPart], { type: "image/gif" }),
        suggestedName: file.name.replace(/\.mp4$/i, ".gif"),
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
