import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { EditRuleForm } from "@/features/admin/components/EditRuleForm";

interface EditRulePageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function EditRulePage({ params }: EditRulePageProps) {
  const { id } = await params;
  const rule = await prisma.rule.findUnique({ where: { id } });

  if (!rule) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">ویرایش قانون</h1>
      <EditRuleForm
        ruleId={rule.id}
        defaultValues={{
          title: rule.title,
          description: rule.description,
          icon: (rule.icon as "respect" | "community" | "discussion" | "") ?? "",
          sortOrder: rule.sortOrder,
          published: rule.published,
        }}
      />
    </div>
  );
}
