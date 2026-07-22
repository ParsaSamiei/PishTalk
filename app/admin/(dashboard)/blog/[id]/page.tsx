import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { EditBlogForm } from "@/features/admin/components/EditBlogForm";

interface EditBlogPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const [blog, categories] = await Promise.all([
    prisma.blog.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!blog) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">ویرایش مطلب</h1>
        <p className="text-text-secondary">{blog.title}</p>
      </div>
      <EditBlogForm
        blogId={blog.id}
        categories={categories}
        defaultValues={{
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          coverImage: blog.coverImage ?? "",
          categoryId: blog.categoryId ?? "",
          readingTime: blog.readingTime ?? "",
          published: blog.published,
        }}
      />
    </div>
  );
}
