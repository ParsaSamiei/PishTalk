import { prisma } from "@/lib/prisma";
import type { BlogSummary } from "@/features/blogs/types/blog";

/**
 * Three latest published posts for the homepage "Latest Blogs" section.
 */
export async function getLatestBlogs(limit = 3): Promise<BlogSummary[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true, deletedAt: null },
      orderBy: { publishedAt: "desc" },
      take: limit,
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
