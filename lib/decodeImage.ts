import "server-only";

import { readFile } from "fs/promises";
import { createRequire } from "module";

import { Jimp } from "jimp";

/**
 * jimp@1.6.1 ships codecs for bmp/gif/jpeg/png/tiff but NOT webp — there is no
 * `@jimp/js-webp` package — so `Jimp.read` throws "Mime type image/webp does
 * not support decoding" for every .webp upload. sharp would handle it, but is
 * deliberately not an option here: its prebuilt libvips requires the
 * x86-64-v2 baseline (SSE4.2) and this project's host CPU predates it, which
 * is why the codebase moved off sharp in the first place. Depending on the
 * build that surfaces either as a load-time "Unsupported CPU" error or as a
 * bare SIGILL during libvips init — and a SIGILL kills the worker outright, so
 * no try/catch in the route can contain it.
 *
 * So: decode webp with a WASM build of libwebp (portable, no CPU baseline, no
 * native binary) and hand the raw RGBA bitmap to Jimp for the resize/encode
 * path that already works for every other format.
 */

const require = createRequire(import.meta.url);

// The .wasm is compiled once per process, not per request: WebAssembly.compile
// on this module costs ~20-40ms, which would otherwise be paid by every single
// upload. Held as a promise so concurrent uploads during a cold start share
// one compile rather than racing to do it N times.
let webpInit: Promise<void> | undefined;

async function initWebp() {
  webpInit ??= (async () => {
    const decoder = await import("@jsquash/webp/decode.js");
    const wasmPath = require.resolve("@jsquash/webp/codec/dec/webp_dec.wasm");
    // Emscripten's default loader fetch()es the .wasm relative to the module
    // URL, which fails under Node on a file:// URL ("not implemented... yet").
    // Compiling it ourselves and passing the Module in sidesteps that loader.
    await decoder.init(await WebAssembly.compile(await readFile(wasmPath)));
  })();
  return webpInit;
}

/**
 * Sniff the container rather than trusting the declared MIME type: `file.type`
 * comes from the browser (and is trivially forged by a direct POST), so a file
 * claiming image/jpeg may really be webp, and vice versa. RIFF....WEBP is the
 * webp magic — bytes 0-3 "RIFF", 8-11 "WEBP", with the length in between.
 */
function isWebp(buffer: Buffer) {
  return (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
}

/**
 * Decode any supported upload to a Jimp image. Throws if the buffer isn't a
 * decodable image; callers are expected to translate that into a 400.
 */
export async function decodeImage(buffer: Buffer) {
  if (!isWebp(buffer)) {
    return Jimp.read(buffer);
  }

  await initWebp();
  const decode = (await import("@jsquash/webp/decode.js")).default;

  // Copy into a standalone ArrayBuffer rather than passing `buffer.buffer`.
  // Node hands out Buffers carved from a shared pool, so the underlying
  // ArrayBuffer usually holds unrelated bytes either side of this file's
  // region — the decoder would read those too. (It also keeps the type honest:
  // Buffer.buffer is ArrayBufferLike, which admits SharedArrayBuffer.)
  const bytes = new Uint8Array(buffer.byteLength);
  bytes.set(buffer);

  const { width, height, data } = await decode(bytes.buffer);

  return Jimp.fromBitmap({ width, height, data: Buffer.from(data) });
}
