"use client";

import { useRouter } from "next/navigation";

import { RuleForm } from "@/features/admin/components/RuleForm";
import { createRule } from "@/features/admin/actions/ruleActions";
import type { RuleFormValues } from "@/features/admin/types/ruleForm";

export default function NewRulePage() {
  const router = useRouter();

  async function handleSubmit(values: RuleFormValues) {
    const result = await createRule(values);
    if (result.success) {
      router.push("/admin/rules");
      router.refresh();
    }
    return result;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">قانون جدید</h1>
      <RuleForm onSubmit={handleSubmit} submitLabel="ایجاد قانون" />
    </div>
  );
}
