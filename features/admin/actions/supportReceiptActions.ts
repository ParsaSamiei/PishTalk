"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { deleteReceiptImage } from "@/lib/receipt-storage";
import {
  reviewReceiptSchema,
  type ReviewReceiptValues,
} from "@/features/admin/types/supportReceiptReview";
import type { ActionResult } from "@/features/admin/actions/eventActions";

/**
 * Records an admin's decision on a submitted receipt.
 *
 * Bookkeeping only. Approving deliberately does NOT create a Sponsor row —
 * the supporters grid on /support stays under manual control in
 * /admin/sponsors, so an approval here can never publish someone's name.
 */
export async function reviewSupportReceipt(
  values: ReviewReceiptValues,
): Promise<ActionResult> {
  const session = await requireAdmin();

  const parsed = reviewReceiptSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات وارد شده معتبر نیست." };
  }

  try {
    await prisma.supportReceipt.update({
      where: { id: parsed.data.id },
      data: {
        status: parsed.data.status,
        adminNote: parsed.data.adminNote || null,
        reviewedAt: new Date(),
        reviewedById: session.user?.id ?? null,
      },
    });

    revalidatePath("/admin/receipts");
    return { success: true };
  } catch (err) {
    console.error("reviewSupportReceipt failed:", err);
    return { success: false, error: "ثبت وضعیت رسید با خطا مواجه شد." };
  }
}

/**
 * Deletes a receipt and its image together.
 *
 * The row is removed first: if the unlink failed and we stopped there, the
 * record would be undeletable. An image with no row is invisible and
 * harmless by comparison — and deleteReceiptImage treats a missing file as
 * success, so a retry always converges.
 */
export async function deleteSupportReceipt(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    const receipt = await prisma.supportReceipt.delete({
      where: { id },
      select: { receiptFile: true },
    });

    await deleteReceiptImage(receipt.receiptFile);

    revalidatePath("/admin/receipts");
    return { success: true };
  } catch (err) {
    console.error("deleteSupportReceipt failed:", err);
    return { success: false, error: "حذف رسید با خطا مواجه شد." };
  }
}
