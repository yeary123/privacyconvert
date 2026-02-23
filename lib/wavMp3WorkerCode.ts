/**
 * WAV → MP3 Worker source (inline string + Blob).
 * Loaded via importScripts from CDN to avoid bundling path issues.
 * Compute-intensive encoding runs in Worker.
 */

const LAMEJS_URL = "https://cdn.jsdelivr.net/npm/lamejs@1.2.0/lame.min.js";

export const WAV_MP3_WORKER_CODE = `
(function() {
  'use strict';
  importScripts('${LAMEJS_URL}');
  var maxSamples = 1152;

  self.onmessage = function(e) {
    var arrayBuffer = e.data;
    try {
      var wav = lamejs.WavHeader.readHeader(new DataView(arrayBuffer));
      if (!wav) {
        self.postMessage({ ok: false, error: 'Not a valid WAV file' });
        return;
      }
      var dataView = new Int16Array(arrayBuffer, wav.dataOffset, wav.dataLen / 2);
      var samplesLeft = wav.channels === 1
        ? dataView
        : new Int16Array(wav.dataLen / (2 * wav.channels));
      var samplesRight = wav.channels === 2
        ? new Int16Array(wav.dataLen / (2 * wav.channels))
        : undefined;
      if (wav.channels > 1) {
        for (var i = 0; i < samplesLeft.length; i++) {
          samplesLeft[i] = dataView[i * 2];
          samplesRight[i] = dataView[i * 2 + 1];
        }
      }
      var mp3Encoder = new lamejs.Mp3Encoder(wav.channels, wav.sampleRate, 128);
      var mp3Data = [];
      var remaining = samplesLeft.length;
      for (var i = 0; remaining >= maxSamples; i += maxSamples) {
        var left = samplesLeft.subarray(i, i + maxSamples);
        var right = samplesRight ? samplesRight.subarray(i, i + maxSamples) : left;
        var mp3buf = mp3Encoder.encodeBuffer(left, right);
        if (mp3buf.length > 0) mp3Data.push(new Int8Array(mp3buf));
        remaining -= maxSamples;
      }
      var last = mp3Encoder.flush();
      if (last.length > 0) mp3Data.push(new Int8Array(last));
      var totalLen = mp3Data.reduce(function(acc, arr) { return acc + arr.length; }, 0);
      var out = new Int8Array(totalLen);
      var offset = 0;
      for (var j = 0; j < mp3Data.length; j++) {
        out.set(mp3Data[j], offset);
        offset += mp3Data[j].length;
      }
      self.postMessage({ ok: true, blob: new Blob([out], { type: 'audio/mpeg' }) });
    } catch (err) {
      self.postMessage({ ok: false, error: (err && err.message) ? err.message : String(err) });
    }
  };
})();
`;
