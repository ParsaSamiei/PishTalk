import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { DeleteButton } from "@/features/admin/components/DeleteButton";
import { deleteFaq } from "@/features/admin/actions/faqActions";
import { prisma } from "@/lib/prisma";

export default async function AdminFaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">سوالات متداول</h1>
          <p className="text-text-secondary">مدیریت سوالات صفحه FAQ</p>
        </div>
        <Button asChild>
          <Link href="/admin/faq/new">
            <Plus className="size-4" aria-hidden="true" />
            سوال جدید
          </Link>
        </Button>
      </div>

      {faqs.length === 0 ? (
        <EmptyState title="هنوز سوالی ثبت نشده است" description="اولین سوال را اضافه کنید." />
      ) : (
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <Card key={faq.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-text-primary">{faq.question}</p>
                  {!faq.published ? <Badge variant="neutral">پنهان</Badge> : null}
                </div>
                <p className="line-clamp-1 text-sm text-text-secondary">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button asChild variant="ghost" size="icon" aria-label="ویرایش">
                  <Link href={`/admin/faq/${faq.id}`}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <DeleteButton
                  confirmMessage={`آیا از حذف «${faq.question}» مطمئن هستید؟`}
                  action={deleteFaq.bind(null, faq.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
