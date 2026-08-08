import { Suspense } from "react";
import type { Prisma } from "@prisma/client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { AdminSearchBar } from "@/features/admin/components/AdminSearchBar";
import { DeleteButton } from "@/features/admin/components/DeleteButton";
import { ReceiptImageDialog } from "@/features/admin/components/ReceiptImageDialog";
import { ReceiptReviewActions } from "@/features/admin/components/ReceiptReviewActions";
import { deleteSupportReceipt } from "@/features/admin/actions/supportReceiptActions";
import { prisma } from "@/lib/prisma";
import { formatEventDate } from "@/utils/formatDate";
import { formatNumber } from "@/utils/formatNumber";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;

const STATUS_LABEL = {
  PENDING: "در انتظار بررسی",
  APPROVED: "تأیید شده",
  REJECTED: "رد شده",
} as const;

const STATUS_VARIANT = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
} as const;

interface AdminReceiptsPageProps {
  readonly searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
}

function parseStatus(status: string | undefined) {
  return status === "PENDING" || status === "APPROVED" || status === "REJECTED"
    ? status
    : undefined;
}

async function getReceipts(
  q: string | undefined,
  status: string | undefined,
  page: number,
) {
  const parsedStatus = parseStatus(status);

  const where: Prisma.SupportReceiptWhereInput = {
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
          ],
        }
      : {}),
    ...(parsedStatus ? { status: parsedStatus } : {}),
  };

  const [receipts, total, pendingCount] = await Promise.all([
    prisma.supportReceipt.findMany({
      where,
      // Unreviewed first, then newest — the queue an admin actually works
      // through, matching how /admin/messages orders unread ahead of read.
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { reviewedBy: { select: { name: true } } },
    }),
    prisma.supportReceipt.count({ where }),
    prisma.supportReceipt.count({ where: { status: "PENDING" } }),
  ]);

  return {
    receipts,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    total,
    pendingCount,
  };
}

export default async function AdminReceiptsPage({
  searchParams,
}: AdminReceiptsPageProps) {
  const { q, status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { receipts, totalPages, total, pendingCount } = await getReceipts(
    q,
    status,
    page,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">رسیدهای حمایت</h1>
        <p className="text-text-secondary">
          {total} رسید
          {pendingCount > 0 ? ` • ${pendingCount} در انتظار بررسی` : null}
        </p>
      </div>

      <Suspense>
        <AdminSearchBar
          searchPlaceholder="جستجو بر اساس نام یا شماره موبایل..."
          filterParam="status"
          filterOptions={[
            { value: "PENDING", label: "در انتظار بررسی" },
            { value: "APPROVED", label: "تأیید شده" },
            { value: "REJECTED", label: "رد شده" },
          ]}
        />
      </Suspense>

      {receipts.length === 0 ? (
        <EmptyState
          title="رسیدی پیدا نشد"
          description="عبارت جستجو را تغییر دهید یا فیلتر را پاک کنید."
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-240 text-start text-sm">
            <thead className="sticky top-0 border-b border-border bg-surface text-text-secondary">
              <tr>
                <th className="p-4 text-start font-medium">رسید</th>
                <th className="p-4 text-start font-medium">نام</th>
                <th className="p-4 text-start font-medium">موبایل</th>
                <th className="p-4 text-start font-medium">مبلغ (تومان)</th>
                <th className="p-4 text-start font-medium">تاریخ ارسال</th>
                <th className="p-4 text-start font-medium">وضعیت</th>
                <th className="p-4 text-start font-medium">بررسی</th>
                <th className="p-4 text-start font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt, index) => (
                <tr
                  key={receipt.id}
                  className={cn(
                    "border-b border-border last:border-none hover:bg-surface-secondary/60",
                    index % 2 === 1 && "bg-surface-secondary/30",
                  )}
                >
                  <td className="p-4">
                    <ReceiptImageDialog
                      id={receipt.id}
                      fullName={receipt.fullName}
                    />
                  </td>
                  <td
                    className={cn(
                      "p-4 text-text-primary",
                      receipt.status === "PENDING" && "font-semibold",
                    )}
                  >
                    {receipt.fullName}
                  </td>
                  <td className="p-4 text-text-secondary" dir="ltr">
                    {receipt.phone}
                  </td>
                  <td className="p-4 tabular-nums text-text-primary">
                    {formatNumber(receipt.amountToman)}
                  </td>
                  <td className="p-4 text-text-secondary">
                    {formatEventDate(receipt.createdAt)}
                  </td>
                  <td className="p-4">
                    <Badge variant={STATUS_VARIANT[receipt.status]}>
                      {STATUS_LABEL[receipt.status]}
                    </Badge>
                  </td>
                  <td className="max-w-xs p-4 text-text-secondary">
                    {receipt.reviewedAt ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs">
                          {receipt.reviewedBy?.name ?? "—"} •{" "}
                          {formatEventDate(receipt.reviewedAt)}
                        </span>
                        {receipt.adminNote ? (
                          <p className="line-clamp-2" title={receipt.adminNote}>
                            {receipt.adminNote}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <ReceiptReviewActions
                        id={receipt.id}
                        fullName={receipt.fullName}
                      />
                      <DeleteButton
                        confirmMessage={`آیا از حذف رسید «${receipt.fullName}» مطمئن هستید؟ تصویر رسید نیز حذف می‌شود.`}
                        action={deleteSupportReceipt.bind(null, receipt.id)}
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
