import type { Metadata } from "next";
import { Newspaper } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BlogCard } from "@/components/cards/BlogCard";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/constants";
import type { BlogSummary } from "@/features/blogs/types/blog";

// Prevents this page from being statically prerendered at Docker build time (when the DB may be empty/unreachable) and cached forever.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();

  return {
    title: d.blog.pageTitle,
    description: d.blog.metaDescription,
    alternates: { canonical: `${SITE_URL}/blog` },
  };
}

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
      titleEn: blog.titleEn,
      excerpt: blog.excerpt,
      excerptEn: blog.excerptEn,
      coverImage: blog.coverImage,
      categoryName: blog.category?.name ?? null,
      categoryNameEn: blog.category?.nameEn ?? null,
      readingTime: blog.readingTime,
      publishedAt: blog.publishedAt,
    }));
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const [blogs, d] = await Promise.all([getAllBlogs(), getDictionary()]);

  return (
    <Section className="pt-12" circuit>
      <Container className="flex flex-col gap-10">
        <Breadcrumbs items={[{ label: d.blog.pageTitle }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {d.blog.pageTitle}
          </h1>
          <p className="max-w-2xl text-lg text-text-secondary">{d.blog.lead}</p>
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
            title={d.blog.emptyTitle}
            description={d.blog.emptyDescription}
          />
        )}
      </Container>
    </Section>
  );
}
