import { Suspense } from "react";
import type { Prisma } from "@prisma/client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { AdminSearchBar } from "@/features/admin/components/AdminSearchBar";
import { DeleteButton } from "@/features/admin/components/DeleteButton";
import { ToggleReadButton } from "@/features/admin/components/ToggleReadButton";
import { deleteContactMessage } from "@/features/admin/actions/contactMessageActions";
import { prisma } from "@/lib/prisma";
import { formatEventDate } from "@/utils/formatDate";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;

interface AdminMessagesPageProps {
  readonly searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
}

async function getMessages(
  q: string | undefined,
  status: string | undefined,
  page: number,
) {
  const where: Prisma.ContactMessageWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { message: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(status === "unread" ? { isRead: false } : {}),
    ...(status === "read" ? { isRead: true } : {}),
  };

  const [messages, total, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  return {
    messages,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    total,
    unreadCount,
  };
}

export default async function AdminMessagesPage({
  searchParams,
}: AdminMessagesPageProps) {
  const { q, status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { messages, totalPages, total, unreadCount } = await getMessages(
    q,
    status,
    page,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">پیام‌ها</h1>
        <p className="text-text-secondary">
          {total} پیام
          {unreadCount > 0 ? ` • ${unreadCount} خوانده‌نشده` : null}
        </p>
      </div>

      <Suspense>
        <AdminSearchBar
          searchPlaceholder="جستجو بر اساس نام، تلفن، ایمیل یا متن پیام..."
          filterParam="status"
          filterOptions={[
            { value: "unread", label: "خوانده‌نشده" },
            { value: "read", label: "خوانده‌شده" },
          ]}
        />
      </Suspense>

      {messages.length === 0 ? (
        <EmptyState
          title="پیامی پیدا نشد"
          description="عبارت جستجو را تغییر دهید یا فیلتر را پاک کنید."
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-240 text-start text-sm">
            <thead className="sticky top-0 border-b border-border bg-surface text-text-secondary">
              <tr>
                <th className="p-4 text-start font-medium">نام</th>
                <th className="p-4 text-start font-medium">تلفن</th>
                <th className="p-4 text-start font-medium">ایمیل</th>
                <th className="p-4 text-start font-medium">پیام</th>
                <th className="p-4 text-start font-medium">تاریخ</th>
                <th className="p-4 text-start font-medium">وضعیت</th>
                <th className="p-4 text-start font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message, index) => (
                <tr
                  key={message.id}
                  className={cn(
                    "border-b border-border last:border-none hover:bg-surface-secondary/60",
                    index % 2 === 1 && "bg-surface-secondary/30",
                  )}
                >
                  <td
                    className={cn(
                      "p-4 text-text-primary",
                      !message.isRead && "font-semibold",
                    )}
                  >
                    {message.name}
                  </td>
                  <td className="p-4 text-text-secondary" dir="ltr">
                    {message.phone ?? "—"}
                  </td>
                  <td className="p-4 text-text-secondary" dir="ltr">
                    {message.email}
                  </td>
                  <td className="p-4 max-w-xs text-text-secondary">
                    <p className="line-clamp-2" title={message.message}>
                      {message.message}
                    </p>
                  </td>
                  <td className="p-4 text-text-secondary">
                    {formatEventDate(message.createdAt)}
                  </td>
                  <td className="p-4">
                    <Badge variant={message.isRead ? "neutral" : "accent"}>
                      {message.isRead ? "خوانده‌شده" : "خوانده‌نشده"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <ToggleReadButton
                        id={message.id}
                        isRead={message.isRead}
                      />
                      <DeleteButton
                        confirmMessage={`آیا از حذف پیام «${message.name}» مطمئن هستید؟`}
                        action={deleteContactMessage.bind(null, message.id)}
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
