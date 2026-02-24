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
      } else if (outExt === "flac") {
        await ffmpeg.exec(["-i", inName, "-codec:a", "flac", outName]);
      } else if (outExt === "m4a" || outExt === "aac") {
        await ffmpeg.exec(["-i", inName, "-codec:a", "aac", "-b:a", "192k", outName]);
      } else if (outExt === "opus") {
        await ffmpeg.exec(["-i", inName, "-codec:a", "libopus", "-b:a", "128k", outName]);
      } else if (outExt === "wma") {
        await ffmpeg.exec(["-i", inName, "-codec:a", "wmav2", outName]);
      } else if (outExt === "aiff") {
        await ffmpeg.exec(["-i", inName, "-acodec", "pcm_s16be", "-f", "aiff", outName]);
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
      if (outExt === "mp4" || outExt === "m4v" || outExt === "mov") {
        await ffmpeg.exec(["-i", inName, "-c", "copy", "-movflags", "+faststart", outName]);
      } else if (outExt === "webm" || outExt === "ogv") {
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

function ffmpegVideoToGifHandler(inExt: string, inputPattern: RegExp): ConversionHandler {
  return async (file, options) => {
    let result: { blob: Blob; suggestedName: string } | null = null;
    const id = Math.random().toString(36).slice(2, 10);
    const inName = `input_${id}.${inExt}`;
    const outName = `output_${id}.gif`;
    await withFFmpeg(options, async (ffmpeg) => {
      const data = await fetchFile(file);
      await ffmpeg.writeFile(inName, data);
      await ffmpeg.exec(["-i", inName, "-vf", "fps=10,scale=320:-1:flags=lanczos", "-c:v", "gif", outName]);
      const outData = await ffmpeg.readFile(outName);
      await ffmpeg.deleteFile(inName);
      await ffmpeg.deleteFile(outName);
      result = {
        blob: new Blob([outData as BlobPart], { type: "image/gif" }),
        suggestedName: file.name.replace(inputPattern, ".gif"),
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
  "avif-to-jpeg": async (file, _options) => {
    const blob = await convertImageFile(file, "image/jpeg", DEFAULT_JPEG_QUALITY);
    return { blob, suggestedName: file.name.replace(/\.avif$/i, ".jpg") };
  },
  "avif-to-webp": async (file, _options) => {
    const blob = await convertImageFile(file, "image/webp", DEFAULT_JPEG_QUALITY);
    return { blob, suggestedName: file.name.replace(/\.avif$/i, ".webp") };
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
  "bmp-to-jpeg": async (file, _options) => {
    const blob = await convertImageFile(file, "image/jpeg", DEFAULT_JPEG_QUALITY);
    return { blob, suggestedName: file.name.replace(/\.bmp$/i, ".jpg") };
  },
  "bmp-to-webp": async (file, _options) => {
    const blob = await convertImageFile(file, "image/webp", DEFAULT_JPEG_QUALITY);
    return { blob, suggestedName: file.name.replace(/\.bmp$/i, ".webp") };
  },
  "gif-to-png": async (file, _options) => {
    const blob = await convertImageFile(file, "image/png");
    return { blob, suggestedName: file.name.replace(/\.gif$/i, ".png") };
  },
  "gif-to-jpeg": async (file, _options) => {
    const blob = await convertImageFile(file, "image/jpeg", DEFAULT_JPEG_QUALITY);
    return { blob, suggestedName: file.name.replace(/\.gif$/i, ".jpg") };
  },
  "gif-to-webp": async (file, _options) => {
    const blob = await convertImageFile(file, "image/webp", DEFAULT_JPEG_QUALITY);
    return { blob, suggestedName: file.name.replace(/\.gif$/i, ".webp") };
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
  "wav-to-flac": ffmpegAudioHandler("wav", "flac", "audio/flac", ".flac", /\.wav$/i),
  "wav-to-m4a": ffmpegAudioHandler("wav", "m4a", "audio/mp4", ".m4a", /\.wav$/i),
  "wav-to-aac": ffmpegAudioHandler("wav", "aac", "audio/aac", ".aac", /\.wav$/i),
  "wav-to-opus": ffmpegAudioHandler("wav", "opus", "audio/opus", ".opus", /\.wav$/i),
  "wav-to-wma": ffmpegAudioHandler("wav", "wma", "audio/x-ms-wma", ".wma", /\.wav$/i),
  "wav-to-aiff": ffmpegAudioHandler("wav", "aiff", "audio/aiff", ".aiff", /\.wav$/i),
  "mp3-to-flac": ffmpegAudioHandler("mp3", "flac", "audio/flac", ".flac", /\.mp3$/i),
  "mp3-to-m4a": ffmpegAudioHandler("mp3", "m4a", "audio/mp4", ".m4a", /\.mp3$/i),
  "mp3-to-aac": ffmpegAudioHandler("mp3", "aac", "audio/aac", ".aac", /\.mp3$/i),
  "mp3-to-opus": ffmpegAudioHandler("mp3", "opus", "audio/opus", ".opus", /\.mp3$/i),
  "mp3-to-wma": ffmpegAudioHandler("mp3", "wma", "audio/x-ms-wma", ".wma", /\.mp3$/i),
  "mp3-to-aiff": ffmpegAudioHandler("mp3", "aiff", "audio/aiff", ".aiff", /\.mp3$/i),
  "ogg-to-flac": ffmpegAudioHandler("ogg", "flac", "audio/flac", ".flac", /\.ogg$/i),
  "ogg-to-m4a": ffmpegAudioHandler("ogg", "m4a", "audio/mp4", ".m4a", /\.ogg$/i),
  "ogg-to-aac": ffmpegAudioHandler("ogg", "aac", "audio/aac", ".aac", /\.ogg$/i),
  "ogg-to-opus": ffmpegAudioHandler("ogg", "opus", "audio/opus", ".opus", /\.ogg$/i),
  "ogg-to-wma": ffmpegAudioHandler("ogg", "wma", "audio/x-ms-wma", ".wma", /\.ogg$/i),
  "ogg-to-aiff": ffmpegAudioHandler("ogg", "aiff", "audio/aiff", ".aiff", /\.ogg$/i),
  "flac-to-wav": ffmpegAudioHandler("flac", "wav", "audio/wav", ".wav", /\.flac$/i),
  "flac-to-ogg": ffmpegAudioHandler("flac", "ogg", "audio/ogg", ".ogg", /\.flac$/i),
  "flac-to-m4a": ffmpegAudioHandler("flac", "m4a", "audio/mp4", ".m4a", /\.flac$/i),
  "flac-to-aac": ffmpegAudioHandler("flac", "aac", "audio/aac", ".aac", /\.flac$/i),
  "flac-to-opus": ffmpegAudioHandler("flac", "opus", "audio/opus", ".opus", /\.flac$/i),
  "flac-to-wma": ffmpegAudioHandler("flac", "wma", "audio/x-ms-wma", ".wma", /\.flac$/i),
  "flac-to-aiff": ffmpegAudioHandler("flac", "aiff", "audio/aiff", ".aiff", /\.flac$/i),
  "m4a-to-wav": ffmpegAudioHandler("m4a", "wav", "audio/wav", ".wav", /\.m4a$/i),
  "m4a-to-ogg": ffmpegAudioHandler("m4a", "ogg", "audio/ogg", ".ogg", /\.m4a$/i),
  "m4a-to-flac": ffmpegAudioHandler("m4a", "flac", "audio/flac", ".flac", /\.m4a$/i),
  "m4a-to-aac": ffmpegAudioHandler("m4a", "aac", "audio/aac", ".aac", /\.m4a$/i),
  "m4a-to-opus": ffmpegAudioHandler("m4a", "opus", "audio/opus", ".opus", /\.m4a$/i),
  "m4a-to-wma": ffmpegAudioHandler("m4a", "wma", "audio/x-ms-wma", ".wma", /\.m4a$/i),
  "m4a-to-aiff": ffmpegAudioHandler("m4a", "aiff", "audio/aiff", ".aiff", /\.m4a$/i),
  "aac-to-wav": ffmpegAudioHandler("aac", "wav", "audio/wav", ".wav", /\.aac$/i),
  "aac-to-ogg": ffmpegAudioHandler("aac", "ogg", "audio/ogg", ".ogg", /\.aac$/i),
  "aac-to-flac": ffmpegAudioHandler("aac", "flac", "audio/flac", ".flac", /\.aac$/i),
  "aac-to-m4a": ffmpegAudioHandler("aac", "m4a", "audio/mp4", ".m4a", /\.aac$/i),
  "aac-to-opus": ffmpegAudioHandler("aac", "opus", "audio/opus", ".opus", /\.aac$/i),
  "aac-to-wma": ffmpegAudioHandler("aac", "wma", "audio/x-ms-wma", ".wma", /\.aac$/i),
  "aac-to-aiff": ffmpegAudioHandler("aac", "aiff", "audio/aiff", ".aiff", /\.aac$/i),
  "opus-to-wav": ffmpegAudioHandler("opus", "wav", "audio/wav", ".wav", /\.opus$/i),
  "opus-to-mp3": ffmpegAudioHandler("opus", "mp3", "audio/mpeg", ".mp3", /\.opus$/i),
  "opus-to-ogg": ffmpegAudioHandler("opus", "ogg", "audio/ogg", ".ogg", /\.opus$/i),
  "opus-to-flac": ffmpegAudioHandler("opus", "flac", "audio/flac", ".flac", /\.opus$/i),
  "opus-to-m4a": ffmpegAudioHandler("opus", "m4a", "audio/mp4", ".m4a", /\.opus$/i),
  "opus-to-aac": ffmpegAudioHandler("opus", "aac", "audio/aac", ".aac", /\.opus$/i),
  "opus-to-wma": ffmpegAudioHandler("opus", "wma", "audio/x-ms-wma", ".wma", /\.opus$/i),
  "opus-to-aiff": ffmpegAudioHandler("opus", "aiff", "audio/aiff", ".aiff", /\.opus$/i),
  "wma-to-wav": ffmpegAudioHandler("wma", "wav", "audio/wav", ".wav", /\.wma$/i),
  "wma-to-mp3": ffmpegAudioHandler("wma", "mp3", "audio/mpeg", ".mp3", /\.wma$/i),
  "wma-to-ogg": ffmpegAudioHandler("wma", "ogg", "audio/ogg", ".ogg", /\.wma$/i),
  "wma-to-flac": ffmpegAudioHandler("wma", "flac", "audio/flac", ".flac", /\.wma$/i),
  "wma-to-m4a": ffmpegAudioHandler("wma", "m4a", "audio/mp4", ".m4a", /\.wma$/i),
  "wma-to-aac": ffmpegAudioHandler("wma", "aac", "audio/aac", ".aac", /\.wma$/i),
  "wma-to-opus": ffmpegAudioHandler("wma", "opus", "audio/opus", ".opus", /\.wma$/i),
  "wma-to-aiff": ffmpegAudioHandler("wma", "aiff", "audio/aiff", ".aiff", /\.wma$/i),
  "aiff-to-wav": ffmpegAudioHandler("aiff", "wav", "audio/wav", ".wav", /\.aiff$/i),
  "aiff-to-mp3": ffmpegAudioHandler("aiff", "mp3", "audio/mpeg", ".mp3", /\.aiff$/i),
  "aiff-to-ogg": ffmpegAudioHandler("aiff", "ogg", "audio/ogg", ".ogg", /\.aiff$/i),
  "aiff-to-flac": ffmpegAudioHandler("aiff", "flac", "audio/flac", ".flac", /\.aiff$/i),
  "aiff-to-m4a": ffmpegAudioHandler("aiff", "m4a", "audio/mp4", ".m4a", /\.aiff$/i),
  "aiff-to-aac": ffmpegAudioHandler("aiff", "aac", "audio/aac", ".aac", /\.aiff$/i),
  "aiff-to-opus": ffmpegAudioHandler("aiff", "opus", "audio/opus", ".opus", /\.aiff$/i),
  "aiff-to-wma": ffmpegAudioHandler("aiff", "wma", "audio/x-ms-wma", ".wma", /\.aiff$/i),
  // Video (FFmpeg)
  "webm-to-mp4": ffmpegVideoHandler("webm", "mp4", "video/mp4", ".mp4", /\.webm$/i),
  "mov-to-mp4": ffmpegVideoHandler("mov", "mp4", "video/mp4", ".mp4", /\.mov$/i),
  "mkv-to-mp4": ffmpegVideoHandler("mkv", "mp4", "video/mp4", ".mp4", /\.mkv$/i),
  "avi-to-mp4": ffmpegVideoHandler("avi", "mp4", "video/mp4", ".mp4", /\.avi$/i),
  "gif-to-webm": ffmpegVideoHandler("gif", "webm", "video/webm", ".webm", /\.gif$/i),
  "mp4-to-gif": ffmpegVideoToGifHandler("mp4", /\.mp4$/i),
  "mp4-to-mov": ffmpegVideoHandler("mp4", "mov", "video/quicktime", ".mov", /\.mp4$/i),
  "mp4-to-mkv": ffmpegVideoHandler("mp4", "mkv", "video/x-matroska", ".mkv", /\.mp4$/i),
  "mp4-to-avi": ffmpegVideoHandler("mp4", "avi", "video/x-msvideo", ".avi", /\.mp4$/i),
  "mp4-to-flv": ffmpegVideoHandler("mp4", "flv", "video/x-flv", ".flv", /\.mp4$/i),
  "mp4-to-wmv": ffmpegVideoHandler("mp4", "wmv", "video/x-ms-wmv", ".wmv", /\.mp4$/i),
  "mp4-to-m4v": ffmpegVideoHandler("mp4", "m4v", "video/x-m4v", ".m4v", /\.mp4$/i),
  "mp4-to-ogv": ffmpegVideoHandler("mp4", "ogv", "video/ogg", ".ogv", /\.mp4$/i),
  "mp4-to-3gp": ffmpegVideoHandler("mp4", "3gp", "video/3gpp", ".3gp", /\.mp4$/i),
  "webm-to-mov": ffmpegVideoHandler("webm", "mov", "video/quicktime", ".mov", /\.webm$/i),
  "webm-to-mkv": ffmpegVideoHandler("webm", "mkv", "video/x-matroska", ".mkv", /\.webm$/i),
  "webm-to-avi": ffmpegVideoHandler("webm", "avi", "video/x-msvideo", ".avi", /\.webm$/i),
  "webm-to-gif": ffmpegVideoToGifHandler("webm", /\.webm$/i),
  "webm-to-flv": ffmpegVideoHandler("webm", "flv", "video/x-flv", ".flv", /\.webm$/i),
  "webm-to-wmv": ffmpegVideoHandler("webm", "wmv", "video/x-ms-wmv", ".wmv", /\.webm$/i),
  "webm-to-m4v": ffmpegVideoHandler("webm", "m4v", "video/x-m4v", ".m4v", /\.webm$/i),
  "webm-to-ogv": ffmpegVideoHandler("webm", "ogv", "video/ogg", ".ogv", /\.webm$/i),
  "webm-to-3gp": ffmpegVideoHandler("webm", "3gp", "video/3gpp", ".3gp", /\.webm$/i),
  "mov-to-webm": ffmpegVideoHandler("mov", "webm", "video/webm", ".webm", /\.mov$/i),
  "mov-to-mkv": ffmpegVideoHandler("mov", "mkv", "video/x-matroska", ".mkv", /\.mov$/i),
  "mov-to-avi": ffmpegVideoHandler("mov", "avi", "video/x-msvideo", ".avi", /\.mov$/i),
  "mov-to-gif": ffmpegVideoToGifHandler("mov", /\.mov$/i),
  "mov-to-flv": ffmpegVideoHandler("mov", "flv", "video/x-flv", ".flv", /\.mov$/i),
  "mov-to-wmv": ffmpegVideoHandler("mov", "wmv", "video/x-ms-wmv", ".wmv", /\.mov$/i),
  "mov-to-m4v": ffmpegVideoHandler("mov", "m4v", "video/x-m4v", ".m4v", /\.mov$/i),
  "mov-to-ogv": ffmpegVideoHandler("mov", "ogv", "video/ogg", ".ogv", /\.mov$/i),
  "mov-to-3gp": ffmpegVideoHandler("mov", "3gp", "video/3gpp", ".3gp", /\.mov$/i),
  "mkv-to-webm": ffmpegVideoHandler("mkv", "webm", "video/webm", ".webm", /\.mkv$/i),
  "mkv-to-mov": ffmpegVideoHandler("mkv", "mov", "video/quicktime", ".mov", /\.mkv$/i),
  "mkv-to-avi": ffmpegVideoHandler("mkv", "avi", "video/x-msvideo", ".avi", /\.mkv$/i),
  "mkv-to-gif": ffmpegVideoToGifHandler("mkv", /\.mkv$/i),
  "mkv-to-flv": ffmpegVideoHandler("mkv", "flv", "video/x-flv", ".flv", /\.mkv$/i),
  "mkv-to-wmv": ffmpegVideoHandler("mkv", "wmv", "video/x-ms-wmv", ".wmv", /\.mkv$/i),
  "mkv-to-m4v": ffmpegVideoHandler("mkv", "m4v", "video/x-m4v", ".m4v", /\.mkv$/i),
  "mkv-to-ogv": ffmpegVideoHandler("mkv", "ogv", "video/ogg", ".ogv", /\.mkv$/i),
  "mkv-to-3gp": ffmpegVideoHandler("mkv", "3gp", "video/3gpp", ".3gp", /\.mkv$/i),
  "avi-to-webm": ffmpegVideoHandler("avi", "webm", "video/webm", ".webm", /\.avi$/i),
  "avi-to-mov": ffmpegVideoHandler("avi", "mov", "video/quicktime", ".mov", /\.avi$/i),
  "avi-to-mkv": ffmpegVideoHandler("avi", "mkv", "video/x-matroska", ".mkv", /\.avi$/i),
  "avi-to-gif": ffmpegVideoToGifHandler("avi", /\.avi$/i),
  "avi-to-flv": ffmpegVideoHandler("avi", "flv", "video/x-flv", ".flv", /\.avi$/i),
  "avi-to-wmv": ffmpegVideoHandler("avi", "wmv", "video/x-ms-wmv", ".wmv", /\.avi$/i),
  "avi-to-m4v": ffmpegVideoHandler("avi", "m4v", "video/x-m4v", ".m4v", /\.avi$/i),
  "avi-to-ogv": ffmpegVideoHandler("avi", "ogv", "video/ogg", ".ogv", /\.avi$/i),
  "avi-to-3gp": ffmpegVideoHandler("avi", "3gp", "video/3gpp", ".3gp", /\.avi$/i),
  "gif-to-mov": ffmpegVideoHandler("gif", "mov", "video/quicktime", ".mov", /\.gif$/i),
  "gif-to-mkv": ffmpegVideoHandler("gif", "mkv", "video/x-matroska", ".mkv", /\.gif$/i),
  "gif-to-avi": ffmpegVideoHandler("gif", "avi", "video/x-msvideo", ".avi", /\.gif$/i),
  "gif-to-flv": ffmpegVideoHandler("gif", "flv", "video/x-flv", ".flv", /\.gif$/i),
  "gif-to-wmv": ffmpegVideoHandler("gif", "wmv", "video/x-ms-wmv", ".wmv", /\.gif$/i),
  "gif-to-m4v": ffmpegVideoHandler("gif", "m4v", "video/x-m4v", ".m4v", /\.gif$/i),
  "gif-to-ogv": ffmpegVideoHandler("gif", "ogv", "video/ogg", ".ogv", /\.gif$/i),
  "gif-to-3gp": ffmpegVideoHandler("gif", "3gp", "video/3gpp", ".3gp", /\.gif$/i),
  "flv-to-mp4": ffmpegVideoHandler("flv", "mp4", "video/mp4", ".mp4", /\.flv$/i),
  "flv-to-webm": ffmpegVideoHandler("flv", "webm", "video/webm", ".webm", /\.flv$/i),
  "flv-to-mov": ffmpegVideoHandler("flv", "mov", "video/quicktime", ".mov", /\.flv$/i),
  "flv-to-mkv": ffmpegVideoHandler("flv", "mkv", "video/x-matroska", ".mkv", /\.flv$/i),
  "flv-to-avi": ffmpegVideoHandler("flv", "avi", "video/x-msvideo", ".avi", /\.flv$/i),
  "flv-to-gif": ffmpegVideoToGifHandler("flv", /\.flv$/i),
  "flv-to-wmv": ffmpegVideoHandler("flv", "wmv", "video/x-ms-wmv", ".wmv", /\.flv$/i),
  "flv-to-m4v": ffmpegVideoHandler("flv", "m4v", "video/x-m4v", ".m4v", /\.flv$/i),
  "flv-to-ogv": ffmpegVideoHandler("flv", "ogv", "video/ogg", ".ogv", /\.flv$/i),
  "flv-to-3gp": ffmpegVideoHandler("flv", "3gp", "video/3gpp", ".3gp", /\.flv$/i),
  "wmv-to-mp4": ffmpegVideoHandler("wmv", "mp4", "video/mp4", ".mp4", /\.wmv$/i),
  "wmv-to-webm": ffmpegVideoHandler("wmv", "webm", "video/webm", ".webm", /\.wmv$/i),
  "wmv-to-mov": ffmpegVideoHandler("wmv", "mov", "video/quicktime", ".mov", /\.wmv$/i),
  "wmv-to-mkv": ffmpegVideoHandler("wmv", "mkv", "video/x-matroska", ".mkv", /\.wmv$/i),
  "wmv-to-avi": ffmpegVideoHandler("wmv", "avi", "video/x-msvideo", ".avi", /\.wmv$/i),
  "wmv-to-gif": ffmpegVideoToGifHandler("wmv", /\.wmv$/i),
  "wmv-to-flv": ffmpegVideoHandler("wmv", "flv", "video/x-flv", ".flv", /\.wmv$/i),
  "wmv-to-m4v": ffmpegVideoHandler("wmv", "m4v", "video/x-m4v", ".m4v", /\.wmv$/i),
  "wmv-to-ogv": ffmpegVideoHandler("wmv", "ogv", "video/ogg", ".ogv", /\.wmv$/i),
  "wmv-to-3gp": ffmpegVideoHandler("wmv", "3gp", "video/3gpp", ".3gp", /\.wmv$/i),
  "m4v-to-mp4": ffmpegVideoHandler("m4v", "mp4", "video/mp4", ".mp4", /\.m4v$/i),
  "m4v-to-webm": ffmpegVideoHandler("m4v", "webm", "video/webm", ".webm", /\.m4v$/i),
  "m4v-to-mov": ffmpegVideoHandler("m4v", "mov", "video/quicktime", ".mov", /\.m4v$/i),
  "m4v-to-mkv": ffmpegVideoHandler("m4v", "mkv", "video/x-matroska", ".mkv", /\.m4v$/i),
  "m4v-to-avi": ffmpegVideoHandler("m4v", "avi", "video/x-msvideo", ".avi", /\.m4v$/i),
  "m4v-to-gif": ffmpegVideoToGifHandler("m4v", /\.m4v$/i),
  "m4v-to-flv": ffmpegVideoHandler("m4v", "flv", "video/x-flv", ".flv", /\.m4v$/i),
  "m4v-to-wmv": ffmpegVideoHandler("m4v", "wmv", "video/x-ms-wmv", ".wmv", /\.m4v$/i),
  "m4v-to-ogv": ffmpegVideoHandler("m4v", "ogv", "video/ogg", ".ogv", /\.m4v$/i),
  "m4v-to-3gp": ffmpegVideoHandler("m4v", "3gp", "video/3gpp", ".3gp", /\.m4v$/i),
  "ogv-to-mp4": ffmpegVideoHandler("ogv", "mp4", "video/mp4", ".mp4", /\.ogv$/i),
  "ogv-to-webm": ffmpegVideoHandler("ogv", "webm", "video/webm", ".webm", /\.ogv$/i),
  "ogv-to-mov": ffmpegVideoHandler("ogv", "mov", "video/quicktime", ".mov", /\.ogv$/i),
  "ogv-to-mkv": ffmpegVideoHandler("ogv", "mkv", "video/x-matroska", ".mkv", /\.ogv$/i),
  "ogv-to-avi": ffmpegVideoHandler("ogv", "avi", "video/x-msvideo", ".avi", /\.ogv$/i),
  "ogv-to-gif": ffmpegVideoToGifHandler("ogv", /\.ogv$/i),
  "ogv-to-flv": ffmpegVideoHandler("ogv", "flv", "video/x-flv", ".flv", /\.ogv$/i),
  "ogv-to-wmv": ffmpegVideoHandler("ogv", "wmv", "video/x-ms-wmv", ".wmv", /\.ogv$/i),
  "ogv-to-m4v": ffmpegVideoHandler("ogv", "m4v", "video/x-m4v", ".m4v", /\.ogv$/i),
  "ogv-to-3gp": ffmpegVideoHandler("ogv", "3gp", "video/3gpp", ".3gp", /\.ogv$/i),
  "3gp-to-mp4": ffmpegVideoHandler("3gp", "mp4", "video/mp4", ".mp4", /\.3gp$/i),
  "3gp-to-webm": ffmpegVideoHandler("3gp", "webm", "video/webm", ".webm", /\.3gp$/i),
  "3gp-to-mov": ffmpegVideoHandler("3gp", "mov", "video/quicktime", ".mov", /\.3gp$/i),
  "3gp-to-mkv": ffmpegVideoHandler("3gp", "mkv", "video/x-matroska", ".mkv", /\.3gp$/i),
  "3gp-to-avi": ffmpegVideoHandler("3gp", "avi", "video/x-msvideo", ".avi", /\.3gp$/i),
  "3gp-to-gif": ffmpegVideoToGifHandler("3gp", /\.3gp$/i),
  "3gp-to-flv": ffmpegVideoHandler("3gp", "flv", "video/x-flv", ".flv", /\.3gp$/i),
  "3gp-to-wmv": ffmpegVideoHandler("3gp", "wmv", "video/x-ms-wmv", ".wmv", /\.3gp$/i),
  "3gp-to-m4v": ffmpegVideoHandler("3gp", "m4v", "video/x-m4v", ".m4v", /\.3gp$/i),
  "3gp-to-ogv": ffmpegVideoHandler("3gp", "ogv", "video/ogg", ".ogv", /\.3gp$/i),
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
