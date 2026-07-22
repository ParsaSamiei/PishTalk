import type { Metadata } from "next";
import { Newspaper } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BlogCard } from "@/components/cards/BlogCard";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";
import type { BlogSummary } from "@/features/blogs/types/blog";

export const metadata: Metadata = {
  title: "وبلاگ",
  description: "نوشته‌ها و یادداشت‌های جامعه پیشتاک درباره رباتیک، هوش مصنوعی و فناوری.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

async function getAllBlogs(): Promise<BlogSummary[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true, deletedAt: null },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    });

    return blogs.map((blog) => ({
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      coverImage: blog.coverImage,
      categoryName: blog.category?.name ?? null,
      readingTime: blog.readingTime,
      publishedAt: blog.publishedAt,
    }));
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getAllBlogs();

  return (
    <Section className="pt-12">
      <Container className="flex flex-col gap-10">
        <Breadcrumbs items={[{ label: "وبلاگ" }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">وبلاگ</h1>
          <p className="max-w-2xl text-lg text-text-secondary">
            یادداشت‌ها و تجربه‌های جامعه پیشتاک درباره رباتیک، هوش مصنوعی و فناوری.
          </p>
        </div>

        {blogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Newspaper}
            title="هنوز مطلبی منتشر نشده است"
            description="اولین نوشته‌های وبلاگ پیشتاک به‌زودی منتشر می‌شود."
          />
        )}
      </Container>
    </Section>
  );
}
