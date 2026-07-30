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
    // The upload route always re-encodes and writes images as .jpg via
    // Jimp, so this is accurate for every file this directory will ever
    // contain.
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
