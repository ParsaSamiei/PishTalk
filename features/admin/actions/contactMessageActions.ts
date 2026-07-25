"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import type { ActionResult } from "@/features/admin/actions/eventActions";

export async function toggleContactMessageRead(
  id: string,
  isRead: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.contactMessage.update({ where: { id }, data: { isRead } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { success: false, error: "به‌روزرسانی وضعیت پیام با خطا مواجه شد." };
  }
}

export async function deleteContactMessage(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { success: false, error: "حذف پیام با خطا مواجه شد." };
  }
}
