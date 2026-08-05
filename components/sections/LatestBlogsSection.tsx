import Link from "next/link";
import { Newspaper } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { ForwardArrow } from "@/components/shared/DirectionalIcon";
import { BlogCard } from "@/components/cards/BlogCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import type { BlogSummary } from "@/features/blogs/types/blog";
import { getDictionary } from "@/lib/i18n/server";

interface LatestBlogsSectionProps {
  readonly blogs: readonly BlogSummary[];
}

async function LatestBlogsSection({ blogs }: LatestBlogsSectionProps) {
  const d = await getDictionary();

  return (
    <Section id="latest-blogs" circuit>
      <Container className="flex flex-col gap-10">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle
            eyebrow={d.blog.latestEyebrow}
            title={d.blog.latestTitle}
          />
          {blogs.length > 0 ? (
            <Button
              asChild
              variant="ghost"
              className="border border-border-primary hover:border-accent hover:bg-accent/5"
            >
              <Link href="/blog">
                {d.blog.viewAllPosts}
                <ForwardArrow className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </Reveal>

        {blogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <Reveal key={blog.id} delay={index * 0.08} className="h-full">
                <BlogCard blog={blog} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1}>
            <EmptyState
              icon={Newspaper}
              title={d.blog.emptyTitle}
              description={d.blog.homeEmptyDescription}
            />
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

export { LatestBlogsSection };
