"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { ruleFormSchema, type RuleFormValues } from "@/features/admin/types/ruleForm";
import type { ActionResult } from "@/features/admin/actions/eventActions";

export async function createRule(values: RuleFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = ruleFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: "اطلاعات وارد شده معتبر نیست." };

  try {
    await prisma.rule.create({ data: { ...parsed.data, icon: parsed.data.icon || null } });
    revalidatePath("/admin/rules");
    revalidatePath("/rules");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "ثبت قانون با خطا مواجه شد." };
  }
}

export async function updateRule(id: string, values: RuleFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = ruleFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: "اطلاعات وارد شده معتبر نیست." };

  try {
    await prisma.rule.update({
      where: { id },
      data: { ...parsed.data, icon: parsed.data.icon || null },
    });
    revalidatePath("/admin/rules");
    revalidatePath("/rules");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "به‌روزرسانی قانون با خطا مواجه شد." };
  }
}

export async function deleteRule(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.rule.delete({ where: { id } });
    revalidatePath("/admin/rules");
    revalidatePath("/rules");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "حذف قانون با خطا مواجه شد." };
  }
}
