import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { DeleteButton } from "@/features/admin/components/DeleteButton";
import { deleteRule } from "@/features/admin/actions/ruleActions";
import { prisma } from "@/lib/prisma";

export default async function AdminRulesPage() {
  const rules = await prisma.rule.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">قوانین</h1>
          <p className="text-text-secondary">مدیریت قوانین حضور در رویدادها</p>
        </div>
        <Button asChild>
          <Link href="/admin/rules/new">
            <Plus className="size-4" aria-hidden="true" />
            قانون جدید
          </Link>
        </Button>
      </div>

      {rules.length === 0 ? (
        <EmptyState title="هنوز قانونی ثبت نشده است" description="اولین قانون را اضافه کنید." />
      ) : (
        <div className="flex flex-col gap-3">
          {rules.map((rule) => (
            <Card key={rule.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-text-primary">{rule.title}</p>
                  {!rule.published ? <Badge variant="neutral">پنهان</Badge> : null}
                </div>
                <p className="line-clamp-1 text-sm text-text-secondary">{rule.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button asChild variant="ghost" size="icon" aria-label="ویرایش">
                  <Link href={`/admin/rules/${rule.id}`}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <DeleteButton
                  confirmMessage={`آیا از حذف «${rule.title}» مطمئن هستید؟`}
                  action={deleteRule.bind(null, rule.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
