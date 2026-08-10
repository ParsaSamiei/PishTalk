import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// In `output: "standalone"` mode, Next.js decides whether a request path is a
// static asset using a manifest built at compile time. Files written into
// public/uploads at runtime (i.e. everything the admin panel ever uploads)
// were never part of that manifest, so Next never recognizes them as static
// files and falls through to page routing -> 404, even though the file is
// sitting right there on disk. This route handler serves those files
// directly instead, reading from disk on every request.
const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const requestedPath = path.join(UPLOADS_ROOT, ...segments);

  // Guard against path traversal (e.g. ../../etc/passwd) escaping the
  // uploads directory via a crafted segment.
  if (!requestedPath.startsWith(UPLOADS_ROOT + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const buffer = await readFile(requestedPath);
    // The upload route re-encodes via Jimp and writes either .jpg or .png
    // (.png when the source had transparency, to avoid flattening it to
    // black — see app/api/admin/upload/route.ts), so the extension on disk
    // is authoritative for the content type.
    const contentType =
      path.extname(requestedPath).toLowerCase() === ".png"
        ? "image/png"
        : "image/jpeg";
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
