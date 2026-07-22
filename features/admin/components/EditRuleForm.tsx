"use client";

import { useRouter } from "next/navigation";

import { RuleForm } from "@/features/admin/components/RuleForm";
import { updateRule } from "@/features/admin/actions/ruleActions";
import type { RuleFormValues } from "@/features/admin/types/ruleForm";

interface EditRuleFormProps {
  readonly ruleId: string;
  readonly defaultValues: RuleFormValues;
}

function EditRuleForm({ ruleId, defaultValues }: EditRuleFormProps) {
  const router = useRouter();

  async function handleSubmit(values: RuleFormValues) {
    const result = await updateRule(ruleId, values);
    if (result.success) router.push("/admin/rules");
    return result;
  }

  return (
    <RuleForm defaultValues={defaultValues} onSubmit={handleSubmit} submitLabel="ذخیره تغییرات" />
  );
}

export { EditRuleForm };
