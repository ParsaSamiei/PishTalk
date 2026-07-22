import Image from "next/image";
import Link from "next/link";
import { Clock, Newspaper } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { BlogSummary } from "@/features/blogs/types/blog";
import { formatEventDate } from "@/utils/formatDate";

interface BlogCardProps {
  readonly blog: BlogSummary;
}

function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card asChild className="group overflow-hidden p-0 hover:-translate-y-0.5">
      <Link href={`/blog/${blog.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-video w-full overflow-hidden bg-surface-secondary">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-text-light">
              <Newspaper className="size-10" aria-hidden="true" />
            </div>
          )}
          {blog.categoryName ? (
            <Badge variant="accent" className="absolute top-4 end-4">
              {blog.categoryName}
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="line-clamp-2 text-lg font-semibold text-text-primary">
            {blog.title}
          </h3>
          <div className="mt-auto flex items-center gap-4 pt-2 text-sm text-text-secondary">
            {blog.publishedAt ? <span>{formatEventDate(blog.publishedAt)}</span> : null}
            {blog.readingTime ? (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                {blog.readingTime} دقیقه مطالعه
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </Card>
  );
}

export { BlogCard };
