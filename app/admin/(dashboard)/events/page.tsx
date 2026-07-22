import Link from "next/link";
import { Suspense } from "react";
import { Plus, Pencil, ExternalLink } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { AdminSearchBar } from "@/features/admin/components/AdminSearchBar";
import { DeleteEventButton } from "@/features/admin/components/DeleteEventButton";
import { prisma } from "@/lib/prisma";
import { formatEventDate } from "@/utils/formatDate";
import type { Prisma } from "@prisma/client";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "پیش‌نویس",
  PUBLISHED: "منتشرشده",
  ARCHIVED: "آرشیوشده",
  CANCELLED: "لغوشده",
};

const FILTER_OPTIONS = [
  { value: "all", label: "همه" },
  { value: "upcoming", label: "پیش رو" },
  { value: "past", label: "گذشته" },
  { value: "DRAFT", label: "پیش‌نویس" },
  { value: "ARCHIVED", label: "آرشیوشده" },
  { value: "CANCELLED", label: "لغوشده" },
] as const;

const PAGE_SIZE = 25;

interface AdminEventsPageProps {
  readonly searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

async function getAdminEvents(q: string | undefined, status: string | undefined, page: number) {
  const where: Prisma.EventWhereInput = { deletedAt: null };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ];
  }

  const today = new Date(new Date().toDateString());
  if (status === "upcoming") where.date = { gte: today };
  else if (status === "past") where.date = { lt: today };
  else if (status && status !== "all") where.status = status as Prisma.EventWhereInput["status"];

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { date: "desc" },
      include: { _count: { select: { registrations: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.event.count({ where }),
  ]);

  return { events, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export default async function AdminEventsPage({ searchParams }: AdminEventsPageProps) {
  const { q, status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { events, totalPages } = await getAdminEvents(q, status, page);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">رویدادها</h1>
          <p className="text-text-secondary">مدیریت رویدادهای پیشتاک</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="size-4" aria-hidden="true" />
            رویداد جدید
          </Link>
        </Button>
      </div>

      <Suspense>
        <AdminSearchBar
          searchPlaceholder="جستجوی رویداد..."
          filterOptions={FILTER_OPTIONS}
          filterParam="status"
        />
      </Suspense>

      {events.length === 0 ? (
        <EmptyState title="رویدادی پیدا نشد" description="فیلتر یا عبارت جستجو را تغییر دهید." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[820px] text-start text-sm">
            <thead className="sticky top-0 border-b border-border bg-surface text-text-secondary">
              <tr>
                <th className="p-4 text-start font-medium">عنوان</th>
                <th className="p-4 text-start font-medium">تاریخ</th>
                <th className="p-4 text-start font-medium">وضعیت</th>
                <th className="p-4 text-start font-medium">ثبت‌نام‌ها</th>
                <th className="p-4 text-start font-medium">ایجاد شده در</th>
                <th className="p-4 text-start font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr
                  key={event.id}
                  className={`border-b border-border last:border-none hover:bg-surface-secondary/60 ${
                    index % 2 === 1 ? "bg-surface-secondary/30" : ""
                  }`}
                >
                  <td className="p-4 font-medium text-text-primary">{event.title}</td>
                  <td className="p-4 text-text-secondary">{formatEventDate(event.date)}</td>
                  <td className="p-4">
                    <Badge variant={event.status === "PUBLISHED" ? "success" : "neutral"}>
                      {STATUS_LABELS[event.status] ?? event.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-text-secondary">{event._count.registrations}</td>
                  <td className="p-4 text-text-secondary">{formatEventDate(event.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label="مشاهده در سایت">
                        <Link href={`/events/${event.slug}`} target="_blank">
                          <ExternalLink className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" aria-label="ویرایش">
                        <Link href={`/admin/events/${event.id}`}>
                          <Pencil className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                      <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
