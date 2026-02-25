/**
 * Optional lightweight conversion via Mediabunny (WebCodecs, ~5KB tree-shaken).
 * Try this first for supported conversions; fall back to FFmpeg when not available or when it fails.
 */

export type MediabunnyConvertResult = { blob: Blob; suggestedName: string } | null;

/**
 * Try MP4 → WebM using Mediabunny. Returns null if not supported or conversion fails.
 */
export async function tryMp4ToWebM(
  file: File,
  onProgress?: (percent: number) => void
): Promise<MediabunnyConvertResult> {
  try {
    const { Input, Output, Conversion, ALL_FORMATS, BlobSource, WebMOutputFormat, BufferTarget } = await import(
      "mediabunny"
    );
    const input = new Input({ formats: ALL_FORMATS, source: new BlobSource(file) });
    const target = new BufferTarget();
    const output = new Output({ format: new WebMOutputFormat(), target });
    const conversion = await Conversion.init({ input, output });
    if (!conversion.isValid) return null;
    if (onProgress) conversion.onProgress = (p: number) => onProgress(Math.round(p * 100));
    await conversion.execute();
    const buffer = target.buffer;
    if (!buffer || buffer.byteLength === 0) return null;
    return {
      blob: new Blob([buffer], { type: "video/webm" }),
      suggestedName: file.name.replace(/\.mp4$/i, ".webm"),
    };
  } catch {
    return null;
  }
}
