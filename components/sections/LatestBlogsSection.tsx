import Link from "next/link";
import { Newspaper, ArrowLeft } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { BlogCard } from "@/components/cards/BlogCard";
import { Button } from "@/components/ui/Button";
import type { BlogSummary } from "@/features/blogs/types/blog";

interface LatestBlogsSectionProps {
  readonly blogs: readonly BlogSummary[];
}

function LatestBlogsSection({ blogs }: LatestBlogsSectionProps) {
  return (
    <Section id="latest-blogs" className="bg-surface-secondary">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle eyebrow="وبلاگ" title="جدیدترین نوشته‌ها" />
          {blogs.length > 0 ? (
            <Button asChild variant="ghost">
              <Link href="/blog">
                مشاهده همه مطالب
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
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
            description="اولین نوشته‌های وبلاگ پیشتاک به‌زودی اینجا منتشر می‌شود."
          />
        )}
      </Container>
    </Section>
  );
}

export { LatestBlogsSection };
