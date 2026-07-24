import { prisma } from "@/lib/prisma";
import { NewBlogForm } from "@/features/admin/components/NewBlogForm";

export default async function NewBlogPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">مطلب جدید</h1>
      <NewBlogForm categories={categories} />
    </div>
  );
}
