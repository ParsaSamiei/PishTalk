"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { faqFormSchema, type FaqFormValues } from "@/features/admin/types/faqForm";
import type { ActionResult } from "@/features/admin/actions/eventActions";

export async function createFaq(values: FaqFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = faqFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: "اطلاعات وارد شده معتبر نیست." };

  try {
    await prisma.faq.create({ data: parsed.data });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "ثبت سوال با خطا مواجه شد." };
  }
}

export async function updateFaq(id: string, values: FaqFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = faqFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: "اطلاعات وارد شده معتبر نیست." };

  try {
    await prisma.faq.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "به‌روزرسانی سوال با خطا مواجه شد." };
  }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.faq.delete({ where: { id } });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "حذف سوال با خطا مواجه شد." };
  }
}
