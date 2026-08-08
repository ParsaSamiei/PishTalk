import "server-only";

import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { decodeImage } from "@/lib/decodeImage";

/**
 * Storage for support receipt images.
 *
 * These deliberately do NOT live under public/uploads. That directory is
 * served to anyone who knows a URL by app/uploads/[...path]/route.ts, which
 * performs no authentication at all — and in `next dev`, Next's own static
 * handler serves public/ before any route handler runs, so a guard added
 * there would be bypassed locally and untestable where you'd test it. A bank
 * receipt carries a third party's account details; it must not sit inside a
 * directory whose contract is "everything here is public".
 *
 * Instead: a private directory outside public/, readable only through
 * app/api/admin/receipts/[id]/image/route.ts behind requireAdmin().
 *
 * DEPLOYMENT: in Docker this path must be a mounted volume, or images are
 * written to the container's writable layer and destroyed on the next image
 * update while their database rows survive. See docker-compose.yml.
 */

const RECEIPTS_DIR = path.join(
  process.env.PRIVATE_UPLOADS_DIR ?? path.join(process.cwd(), "private-uploads"),
  "receipts",
);

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 82;

/**
 * Stored filenames are always `<uuid>.jpg` because this module generates them.
 * Re-validating on the way back out means a tampered database value still
 * cannot escape the receipts directory, independent of the resolve check.
 */
const STORED_FILENAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$/;

function resolveStoredPath(filename: string): string | null {
  if (!STORED_FILENAME.test(filename)) return null;

  const resolved = path.join(RECEIPTS_DIR, filename);
  // Defence in depth. The regex above already forbids separators and dots, so
  // this cannot currently fail — it stays so that loosening the regex later
  // does not silently open a traversal.
  if (!resolved.startsWith(RECEIPTS_DIR + path.sep)) return null;

  return resolved;
}

/**
 * Re-encodes an uploaded image and writes it to the private receipts
 * directory, returning the bare filename to store in the database.
 *
 * The re-encode is also the privacy control: `getBuffer` writes a fresh JFIF
 * from the decoded RGBA bitmap, so EXIF — including the GPS coordinates
 * phones attach to photos of documents — cannot survive it. Do not "add EXIF
 * stripping" on top; it is already structurally impossible for metadata to
 * carry through.
 *
 * Throws if the buffer is not a decodable image; callers translate that to a
 * 400. Never trusts a client-supplied MIME type — decodeImage sniffs.
 */
export async function saveReceiptImage(buffer: Buffer): Promise<string> {
  const image = await decodeImage(buffer);
  const { width, height } = image.bitmap;

  // Only downscale; a small receipt photo must not be blown up.
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    image.scaleToFit({ w: MAX_DIMENSION, h: MAX_DIMENSION });
  }
  const jpeg = await image.getBuffer("image/jpeg", { quality: JPEG_QUALITY });

  await mkdir(RECEIPTS_DIR, { recursive: true });

  const filename = `${randomUUID()}.jpg`;
  await writeFile(path.join(RECEIPTS_DIR, filename), jpeg);

  return filename;
}

/** Reads a stored receipt. Returns null when the name is invalid or missing. */
export async function readReceiptImage(filename: string): Promise<Buffer | null> {
  const resolved = resolveStoredPath(filename);
  if (!resolved) return null;

  try {
    return await readFile(resolved);
  } catch {
    return null;
  }
}

/**
 * Deletes a stored receipt. Missing files are not an error: the row is being
 * removed either way, and refusing to delete it because the image already
 * vanished would strand the record permanently.
 */
export async function deleteReceiptImage(filename: string): Promise<void> {
  const resolved = resolveStoredPath(filename);
  if (!resolved) return;

  try {
    await unlink(resolved);
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") {
      // Log the errno: EACCES means the volume is not writable by the runtime
      // user, which is a deployment problem rather than anything to do with
      // this particular receipt.
      console.error(
        "Receipt delete failed:",
        (err as NodeJS.ErrnoException)?.code ?? "",
        err,
      );
    }
  }
}
