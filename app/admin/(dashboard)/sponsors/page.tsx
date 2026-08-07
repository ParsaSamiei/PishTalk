import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { DeleteButton } from "@/features/admin/components/DeleteButton";
import { deleteSponsor } from "@/features/admin/actions/sponsorActions";
import { prisma } from "@/lib/prisma";

export default async function AdminSponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">حامیان</h1>
          <p className="text-text-secondary">مدیریت حامیانی که در صفحه حمایت نمایش داده می‌شوند</p>
        </div>
        <Button asChild>
          <Link href="/admin/sponsors/new">
            <Plus className="size-4" aria-hidden="true" />
            حامی جدید
          </Link>
        </Button>
      </div>

      {sponsors.length === 0 ? (
        <EmptyState title="هنوز حامی‌ای ثبت نشده است" description="اولین حامی را اضافه کنید." />
      ) : (
        <div className="flex flex-col gap-3">
          {sponsors.map((sponsor) => (
            <Card
              key={sponsor.id}
              className="flex flex-wrap items-center justify-between gap-4 p-4"
            >
              <div className="flex flex-1 items-center gap-3">
                {sponsor.logo ? (
                  <Image
                    src={sponsor.logo}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-[var(--radius-input)] border border-border object-contain p-1"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-input)] border border-border bg-surface-secondary text-sm font-medium text-text-secondary"
                  >
                    {sponsor.name.slice(0, 1)}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-text-primary">{sponsor.name}</p>
                    {!sponsor.published ? <Badge variant="neutral">پنهان</Badge> : null}
                  </div>
                  {sponsor.description ? (
                    <p className="line-clamp-1 text-sm text-text-secondary">
                      {sponsor.description}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button asChild variant="ghost" size="icon" aria-label="ویرایش">
                  <Link href={`/admin/sponsors/${sponsor.id}`}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <DeleteButton
                  confirmMessage={`آیا از حذف «${sponsor.name}» مطمئن هستید؟`}
                  action={deleteSponsor.bind(null, sponsor.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
