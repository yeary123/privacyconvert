/**
 * Decode any browser-supported audio to WAV using Web Audio API (zero extra deps).
 * Use for *-to-wav when format is supported by decodeAudioData (MP3, OGG, M4A, AAC, etc.).
 */

/**
 * Encode AudioBuffer to 16-bit PCM WAV blob.
 */
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const duration = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = duration * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);
  let offset = 0;

  function writeU16(v: number) {
    view.setUint16(offset, v, true);
    offset += 2;
  }
  function writeU32(v: number) {
    view.setUint32(offset, v, true);
    offset += 4;
  }

  // RIFF header
  view.setUint8(offset, 0x52); offset += 1; // "R"
  view.setUint8(offset, 0x49); offset += 1; // "I"
  view.setUint8(offset, 0x46); offset += 1; // "F"
  view.setUint8(offset, 0x46); offset += 1; // "F"
  writeU32(36 + dataSize); // file size - 8
  view.setUint8(offset, 0x57); offset += 1; // "W"
  view.setUint8(offset, 0x41); offset += 1; // "A"
  view.setUint8(offset, 0x56); offset += 1; // "V"
  view.setUint8(offset, 0x45); offset += 1; // "E"
  // fmt subchunk
  view.setUint8(offset, 0x66); offset += 1; // "f"
  view.setUint8(offset, 0x6d); offset += 1; // "m"
  view.setUint8(offset, 0x74); offset += 1; // "t"
  view.setUint8(offset, 0x20); offset += 1; // " "
  writeU32(16); // fmt chunk size
  writeU16(1);  // PCM
  writeU16(numChannels);
  writeU32(sampleRate);
  writeU32(byteRate);
  writeU16(blockAlign);
  writeU16(16); // bits per sample
  // data subchunk
  view.setUint8(offset, 0x64); offset += 1; // "d"
  view.setUint8(offset, 0x61); offset += 1; // "a"
  view.setUint8(offset, 0x74); offset += 1; // "t"
  view.setUint8(offset, 0x61); offset += 1; // "a"
  writeU32(dataSize);

  // Interleave PCM 16-bit
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }
  for (let i = 0; i < duration; i++) {
    for (let c = 0; c < numChannels; c++) {
      const s = Math.max(-1, Math.min(1, channels[c][i]));
      const v = s < 0 ? s * 0x8000 : s * 0x7fff;
      view.setInt16(offset, v, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

/**
 * Decode audio file to WAV using Web Audio API. No FFmpeg, no extra lib.
 * Works for any format the browser can decode (MP3, OGG, M4A, AAC, FLAC, etc. depending on browser).
 */
export async function decodeAudioFileToWav(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
  const blob = audioBufferToWavBlob(buffer);
  await ctx.close();
  return blob;
}
