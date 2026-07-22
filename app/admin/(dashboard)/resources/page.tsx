import Link from "next/link";
import { Suspense } from "react";
import { Plus, Pencil } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { AdminSearchBar } from "@/features/admin/components/AdminSearchBar";
import { DeleteButton } from "@/features/admin/components/DeleteButton";
import { deleteResource } from "@/features/admin/actions/resourceActions";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const TYPE_LABELS: Record<string, string> = {
  PDF: "PDF",
  PRESENTATION: "اسلاید",
  GITHUB: "گیت‌هاب",
  VIDEO: "ویدیو",
  RESEARCH_PAPER: "مقاله پژوهشی",
  EXTERNAL_LINK: "لینک خارجی",
};

const PAGE_SIZE = 25;

interface AdminResourcesPageProps {
  readonly searchParams: Promise<{ q?: string; page?: string }>;
}

async function getAdminResources(q: string | undefined, page: number) {
  const where: Prisma.ResourceWhereInput = { deletedAt: null };
  if (q) where.title = { contains: q, mode: "insensitive" };

  const [resources, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      orderBy: { title: "asc" },
      include: { event: { select: { title: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.resource.count({ where }),
  ]);

  return { resources, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export default async function AdminResourcesPage({ searchParams }: AdminResourcesPageProps) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { resources, totalPages } = await getAdminResources(q, page);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">منابع آموزشی</h1>
          <p className="text-text-secondary">مدیریت اسلایدها، مقالات و لینک‌های آموزشی</p>
        </div>
        <Button asChild>
          <Link href="/admin/resources/new">
            <Plus className="size-4" aria-hidden="true" />
            منبع جدید
          </Link>
        </Button>
      </div>

      <Suspense>
        <AdminSearchBar searchPlaceholder="جستجوی عنوان..." />
      </Suspense>

      {resources.length === 0 ? (
        <EmptyState title="منبعی پیدا نشد" description="عبارت جستجو را تغییر دهید." />
      ) : (
        <div className="flex flex-col gap-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-text-primary">{resource.title}</p>
                  <Badge variant="neutral">{TYPE_LABELS[resource.resourceType]}</Badge>
                  {resource.event ? <Badge variant="accent">{resource.event.title}</Badge> : null}
                </div>
                {resource.description ? (
                  <p className="line-clamp-1 text-sm text-text-secondary">{resource.description}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-1">
                <Button asChild variant="ghost" size="icon" aria-label="ویرایش">
                  <Link href={`/admin/resources/${resource.id}`}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <DeleteButton
                  confirmMessage={`آیا از حذف «${resource.title}» مطمئن هستید؟`}
                  action={deleteResource.bind(null, resource.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
