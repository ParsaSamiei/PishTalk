import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ShareButton } from "@/components/shared/ShareButton";
import { prisma } from "@/lib/prisma";
import { formatEventDate } from "@/utils/formatDate";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

interface BlogPageProps {
  readonly params: Promise<{ slug: string }>;
}

async function getBlogBySlug(slug: string) {
  try {
    return await prisma.blog.findFirst({
      where: { slug, published: true, deletedAt: null },
      include: { category: true },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return { title: "مطلب یافت نشد" };

  const title = blog.seoTitle ?? blog.title;
  const description = blog.seoDescription ?? blog.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blog/${blog.slug}` },
    openGraph: blog.coverImage
      ? { images: [{ url: blog.coverImage }], title, description, type: "article" }
      : { title, description, type: "article" },
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const blogUrl = `${SITE_URL}/blog/${blog.slug}`;

  // Assumption: docs/05_DATABASE.md's Blog model has no author column —
  // Pishtalk publishes as a single organizational voice, so the byline is
  // the community itself rather than a per-post author record.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage ? [blog.coverImage] : undefined,
    datePublished: blog.publishedAt?.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: blogUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section className="pt-12">
        <Container className="mx-auto flex max-w-3xl flex-col gap-8">
          <Breadcrumbs items={[{ label: "وبلاگ", href: "/blog" }, { label: blog.title }]} />
          <div className="flex flex-col gap-4">
            {blog.category ? <Badge variant="accent">{blog.category.name}</Badge> : null}
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span>نویسنده: تیم پیشتاک</span>
              {blog.publishedAt ? <span>{formatEventDate(blog.publishedAt)}</span> : null}
              {blog.readingTime ? (
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden="true" />
                  {blog.readingTime} دقیقه مطالعه
                </span>
              ) : null}
            </div>
          </div>

          {blog.coverImage ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-card)]">
              <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" priority />
            </div>
          ) : null}

          {/*
            Content is authored via the Tiptap rich-text editor in the admin
            panel and sanitized with DOMPurify at write time (see
            features/admin/actions/blogActions.ts), so it's safe to render
            directly here.
          */}
          <div
            className="prose prose-slate max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-accent-hover"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div>
            <ShareButton title={blog.title} url={blogUrl} />
          </div>
        </Container>
      </Section>
    </>
  );
}
