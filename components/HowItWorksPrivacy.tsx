/**
 * Reusable "How it works (Privacy First)" copy for About and convert pages.
 * Explains FFmpeg.wasm / client-side conversion for trust and SEO.
 */

export const HOW_IT_WORKS_HEADING = "How it works (Privacy First)";

export const HOW_IT_WORKS_CONTENT = (
  <>
    <p className="text-muted-foreground">
      Conversion runs entirely in your browser using open-source technology compiled to WebAssembly
      (e.g. FFmpeg.wasm). When you drop a file, it never leaves your device: the page loads the
      converter code once, then your file is read in memory, converted in a sandbox in the tab,
      and the result is offered for download. No request sends your file to our servers — we don’t
      have a server that receives it.
    </p>
    <p className="mt-3 text-muted-foreground">
      You can verify this in your browser’s Network tab: after the initial script/WASM load, no
      upload of your file data occurs. This is the same “local-first” approach used by other
      privacy-focused converters; we keep it transparent so you know exactly where your data stays.
    </p>
  </>
);

/** Short one-paragraph version for convert page sidebar. */
export const HOW_IT_WORKS_SHORT = (
  <p className="text-sm text-muted-foreground">
    Conversion runs in your browser (FFmpeg.wasm / client-side). Your file never leaves your
    device — no upload to our servers. You can confirm in the Network tab: no request sends your
    file data.
  </p>
);
