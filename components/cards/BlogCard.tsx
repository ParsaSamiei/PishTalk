import Image from "next/image";
import Link from "next/link";
import { Clock, Newspaper } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { BlogSummary } from "@/features/blogs/types/blog";
import { pick } from "@/lib/i18n/content";
import { getLocaleContext } from "@/lib/i18n/server";
import { formatEventDate } from "@/utils/formatDate";

interface BlogCardProps {
  readonly blog: BlogSummary;
}

async function BlogCard({ blog }: BlogCardProps) {
  const { locale, dictionary: d } = await getLocaleContext();
  const title = pick(locale, blog.title, blog.titleEn);
  const categoryName = pick(locale, blog.categoryName, blog.categoryNameEn);

  return (
    <Card
      asChild
      className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_16px_40px_-24px_rgba(244,185,66,0.55)]"
    >
      <Link href={`/blog/${blog.slug}`} className="flex h-full flex-col">
        <div className="h-1 w-full scale-x-0 bg-linear-to-l from-accent to-sky-400 transition-transform duration-300 group-hover:scale-x-100" />
        <div className="relative aspect-video w-full overflow-hidden bg-surface-secondary">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-text-light">
              <Newspaper className="size-10" aria-hidden="true" />
            </div>
          )}
          {categoryName ? (
            <Badge variant="accent" className="absolute top-4 inset-e-4">
              {categoryName}
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="line-clamp-2 text-lg font-semibold text-text-primary">
            {title}
          </h3>
          <div className="mt-auto flex items-center gap-4 pt-2 text-sm text-text-secondary">
            {blog.publishedAt ? (
              <span>{formatEventDate(blog.publishedAt, locale)}</span>
            ) : null}
            {blog.readingTime ? (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                {blog.readingTime} {d.common.minutesRead}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </Card>
  );
}

export { BlogCard };
