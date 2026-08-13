import { Suspense } from "react";
import Link from "next/link";
import { Download, FileSpreadsheet, AlertTriangle } from "lucide-react";
import type { RegistrationStatus } from "@prisma/client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { AdminSearchBar } from "@/features/admin/components/AdminSearchBar";
import { DeleteButton } from "@/features/admin/components/DeleteButton";
import { RegistrationReviewActions } from "@/features/admin/components/RegistrationReviewActions";
import { deleteRegistration } from "@/features/admin/actions/registrationActions";
import { prisma } from "@/lib/prisma";
import { formatEventDate } from "@/utils/formatDate";
import { resolveCertificateName } from "@/features/registration/types/registration";
import { cn } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 25;

const STATUS_TABS: { value: RegistrationStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "همه" },
  { value: "PENDING", label: "در انتظار بررسی" },
  { value: "APPROVED", label: "تأیید شده" },
  { value: "REJECTED", label: "رد شده" },
  { value: "ATTENDED", label: "حضور یافته" },
  { value: "CANCELLED", label: "لغو شده" },
];

const STATUS_BADGE: Record<
  RegistrationStatus,
  { label: string; variant: BadgeProps["variant"] }
> = {
  PENDING: { label: "در انتظار بررسی", variant: "warning" },
  APPROVED: { label: "تأیید شده", variant: "info" },
  REJECTED: { label: "رد شده", variant: "danger" },
  ATTENDED: { label: "حضور یافته", variant: "success" },
  CANCELLED: { label: "لغو شده", variant: "danger" },
};

interface AdminRegistrationsPageProps {
  readonly searchParams: Promise<{
    q?: string;
    page?: string;
    status?: string;
  }>;
}

function isRegistrationStatus(
  value: string | undefined,
): value is RegistrationStatus {
  return (
    !!value && STATUS_TABS.some((tab) => tab.value === value) && value !== "ALL"
  );
}

async function getRegistrations(
  q: string | undefined,
  status: string | undefined,
  page: number,
) {
  const where: Prisma.RegistrationWhereInput = {
    ...(q
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(isRegistrationStatus(status) ? { status } : {}),
  };

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

  return {
    registrations,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    total,
  };
}

export default async function AdminRegistrationsPage({
  searchParams,
}: AdminRegistrationsPageProps) {
  const { q, page: pageParam, status } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { registrations, totalPages, total } = await getRegistrations(
    q,
    status,
    page,
  );
  const activeStatus = isRegistrationStatus(status) ? status : "ALL";

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

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const params = new URLSearchParams();
          if (tab.value !== "ALL") params.set("status", tab.value);
          const href = params.toString()
            ? `/admin/registrations?${params}`
            : "/admin/registrations";
          const isActive = activeStatus === tab.value;
          return (
            <Link
              key={tab.value}
              href={href}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                isActive
                  ? "border-accent bg-accent/15 text-accent-hover"
                  : "border-border text-text-secondary hover:bg-surface-secondary",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
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
          <table className="w-full min-w-[1380px] text-start text-sm">
            <thead className="sticky top-0 border-b border-border bg-surface text-text-secondary">
              <tr>
                <th className="p-4 text-start font-medium">نام</th>
                <th className="p-4 text-start font-medium">نام (گواهی)</th>
                <th className="p-4 text-start font-medium">موبایل</th>
                <th className="p-4 text-start font-medium">ایمیل</th>
                <th className="p-4 text-start font-medium">دانشگاه / شرکت</th>
                <th className="p-4 text-start font-medium">
                  درباره خودشون / دلیل حضور
                </th>
                <th className="p-4 text-start font-medium">رویداد</th>
                <th className="p-4 text-start font-medium">تاریخ ثبت‌نام</th>
                <th className="p-4 text-start font-medium">وضعیت</th>
                <th className="min-w-[220px] p-4 text-start font-medium">
                  عملیات
                </th>
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
                    {resolveCertificateName(registration)}
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
                  <td className="p-4 text-text-secondary">
                    <p
                      className="line-clamp-3 max-w-xs whitespace-pre-line"
                      title={registration.notes ?? undefined}
                    >
                      {registration.notes || "—"}
                    </p>
                  </td>
                  <td className="p-4 text-text-secondary">
                    {registration.event.title}
                  </td>
                  <td className="p-4 text-text-secondary">
                    {formatEventDate(registration.createdAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={STATUS_BADGE[registration.status].variant}
                        className="w-fit"
                      >
                        {STATUS_BADGE[registration.status].label}
                      </Badge>
                      {registration.status === "APPROVED" &&
                        !registration.smsSentAt && (
                          <AlertTriangle
                            className="size-4 shrink-0 text-danger"
                            aria-label="ارسال پیامک ناموفق یا انجام‌نشده"
                          />
                        )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <RegistrationReviewActions
                        id={registration.id}
                        fullName={`${registration.firstName} ${registration.lastName}`}
                        status={registration.status}
                        smsSentAt={
                          registration.smsSentAt?.toISOString() ?? null
                        }
                        approvalToken={registration.approvalToken}
                      />
                      <DeleteButton
                        confirmMessage={`آیا از حذف ثبت‌نام «${registration.firstName} ${registration.lastName}» مطمئن هستید؟`}
                        action={deleteRegistration.bind(null, registration.id)}
                      />
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
