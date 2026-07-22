"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import type { ActionResult } from "@/features/admin/actions/eventActions";

export async function deleteRegistration(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.registration.delete({ where: { id } });
    revalidatePath("/admin/registrations");
    return { success: true };
  } catch {
    return { success: false, error: "حذف ثبت‌نام با خطا مواجه شد." };
  }
}
