import { Suspense } from "react";
import { Download, FileSpreadsheet } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { AdminSearchBar } from "@/features/admin/components/AdminSearchBar";
import { DeleteButton } from "@/features/admin/components/DeleteButton";
import { deleteRegistration } from "@/features/admin/actions/registrationActions";
import { prisma } from "@/lib/prisma";
import { formatEventDate } from "@/utils/formatDate";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 25;

interface AdminRegistrationsPageProps {
  readonly searchParams: Promise<{ q?: string; page?: string }>;
}

async function getRegistrations(q: string | undefined, page: number) {
  const where: Prisma.RegistrationWhereInput = q
    ? {
        OR: [
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { phone: { contains: q } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [registrations, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { event: { select: { title: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.registration.count({ where }),
  ]);

  return { registrations, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)), total };
}

export default async function AdminRegistrationsPage({ searchParams }: AdminRegistrationsPageProps) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { registrations, totalPages, total } = await getRegistrations(q, page);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">ثبت‌نام‌ها</h1>
          <p className="text-text-secondary">{total} ثبت‌نام</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href="/api/admin/registrations/export">
              <Download className="size-4" aria-hidden="true" />
              خروجی CSV
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/api/admin/registrations/export-excel">
              <FileSpreadsheet className="size-4" aria-hidden="true" />
              خروجی Excel
            </a>
          </Button>
        </div>
      </div>

      <Suspense>
        <AdminSearchBar searchPlaceholder="جستجو بر اساس نام، موبایل یا ایمیل..." />
      </Suspense>

      {registrations.length === 0 ? (
        <EmptyState
          title="ثبت‌نامی پیدا نشد"
          description="عبارت جستجو را تغییر دهید یا فیلتر را پاک کنید."
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[960px] text-start text-sm">
            <thead className="sticky top-0 border-b border-border bg-surface text-text-secondary">
              <tr>
                <th className="p-4 text-start font-medium">نام</th>
                <th className="p-4 text-start font-medium">موبایل</th>
                <th className="p-4 text-start font-medium">ایمیل</th>
                <th className="p-4 text-start font-medium">دانشگاه / شرکت</th>
                <th className="p-4 text-start font-medium">رویداد</th>
                <th className="p-4 text-start font-medium">تاریخ ثبت‌نام</th>
                <th className="p-4 text-start font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration, index) => (
                <tr
                  key={registration.id}
                  className={`border-b border-border last:border-none hover:bg-surface-secondary/60 ${
                    index % 2 === 1 ? "bg-surface-secondary/30" : ""
                  }`}
                >
                  <td className="p-4 font-medium text-text-primary">
                    {registration.firstName} {registration.lastName}
                  </td>
                  <td className="p-4 text-text-secondary" dir="ltr">
                    {registration.phone}
                  </td>
                  <td className="p-4 text-text-secondary" dir="ltr">
                    {registration.email ?? "—"}
                  </td>
                  <td className="p-4 text-text-secondary">
                    {registration.university || registration.company || "—"}
                  </td>
                  <td className="p-4 text-text-secondary">{registration.event.title}</td>
                  <td className="p-4 text-text-secondary">
                    {formatEventDate(registration.createdAt)}
                  </td>
                  <td className="p-4">
                    <DeleteButton
                      confirmMessage={`آیا از حذف ثبت‌نام «${registration.firstName} ${registration.lastName}» مطمئن هستید؟`}
                      action={deleteRegistration.bind(null, registration.id)}
                    />
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
