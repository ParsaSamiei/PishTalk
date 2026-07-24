import Link from "next/link";
import { Suspense } from "react";
import { Plus, Pencil, ExternalLink } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { AdminSearchBar } from "@/features/admin/components/AdminSearchBar";
import { DeleteButton } from "@/features/admin/components/DeleteButton";
import { deleteBlog } from "@/features/admin/actions/blogActions";
import { prisma } from "@/lib/prisma";
import { formatEventDate } from "@/utils/formatDate";
import type { Prisma } from "@prisma/client";

const FILTER_OPTIONS = [
  { value: "all", label: "همه" },
  { value: "published", label: "منتشرشده" },
  { value: "draft", label: "پیش‌نویس" },
] as const;

const PAGE_SIZE = 25;

interface AdminBlogPageProps {
  readonly searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

async function getAdminBlogs(q: string | undefined, status: string | undefined, page: number) {
  const where: Prisma.BlogWhereInput = { deletedAt: null };

  if (q) where.title = { contains: q, mode: "insensitive" };
  if (status === "published") where.published = true;
  else if (status === "draft") where.published = false;

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.blog.count({ where }),
  ]);

  return { blogs, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  const { q, status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { blogs, totalPages } = await getAdminBlogs(q, status, page);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">وبلاگ</h1>
          <p className="text-text-secondary">مدیریت مطالب وبلاگ</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="size-4" aria-hidden="true" />
            مطلب جدید
          </Link>
        </Button>
      </div>

      <Suspense>
        <AdminSearchBar
          searchPlaceholder="جستجوی عنوان..."
          filterOptions={FILTER_OPTIONS}
          filterParam="status"
        />
      </Suspense>

      {blogs.length === 0 ? (
        <EmptyState title="مطلبی پیدا نشد" description="فیلتر یا عبارت جستجو را تغییر دهید." />
      ) : (
        <div className="flex flex-col gap-3">
          {blogs.map((blog) => (
            <Card key={blog.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-text-primary">{blog.title}</p>
                  <Badge variant={blog.published ? "success" : "neutral"}>
                    {blog.published ? "منتشرشده" : "پیش‌نویس"}
                  </Badge>
                  {blog.category ? <Badge variant="accent">{blog.category.name}</Badge> : null}
                </div>
                <p className="line-clamp-1 text-sm text-text-secondary">{blog.excerpt}</p>
                <p className="text-xs text-text-light">
                  {blog.readingTime ? `${blog.readingTime} دقیقه مطالعه · ` : ""}
                  {blog.publishedAt
                    ? `منتشر شده در ${formatEventDate(blog.publishedAt)}`
                    : `ایجاد شده در ${formatEventDate(blog.createdAt)}`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {blog.published ? (
                  <Button asChild variant="ghost" size="icon" aria-label="مشاهده در سایت">
                    <Link href={`/blog/${blog.slug}`} target="_blank">
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                ) : null}
                <Button asChild variant="ghost" size="icon" aria-label="ویرایش">
                  <Link href={`/admin/blog/${blog.id}`}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <DeleteButton
                  confirmMessage={`آیا از حذف «${blog.title}» مطمئن هستید؟`}
                  action={deleteBlog.bind(null, blog.id)}
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
