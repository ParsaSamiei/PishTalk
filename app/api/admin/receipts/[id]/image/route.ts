import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { readReceiptImage } from "@/lib/receipt-storage";

/**
 * Serves a receipt image to a logged-in admin.
 *
 * Receipts are stored outside public/ precisely so they cannot be fetched by
 * URL, which makes this route the only way to see one — and therefore the
 * only place the access check exists.
 *
 * Note that middleware.ts matches "/admin/:path*", which does NOT cover
 * "/api/admin/...". This route is protected solely by its own requireAdmin()
 * call, exactly like /api/admin/upload. Do not remove it.
 */

export const runtime = "nodejs";

const idSchema = z.string().uuid();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const receipt = await prisma.supportReceipt.findUnique({
    where: { id },
    select: { receiptFile: true },
  });
  if (!receipt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await readReceiptImage(receipt.receiptFile);
  if (!buffer) {
    // The row survived but the file did not — most likely the private uploads
    // volume was not mounted on a redeploy. Log it: it is a deployment fault,
    // not a bad request.
    console.error("Receipt image missing on disk:", receipt.receiptFile);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      // saveReceiptImage re-encodes everything to JPEG, so this is accurate
      // for every file this route will ever return.
      "Content-Type": "image/jpeg",
      // The opposite of the public uploads route's immutable caching: these
      // are authenticated financial documents and must never be retained by a
      // shared proxy or persisted to disk cache.
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}
