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
import { getLocaleContext } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { formatEventDate } from "@/utils/formatDate";
import { SITE_URL } from "@/lib/constants";

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

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { locale, dictionary: d } = await getLocaleContext();
  const blog = await getBlogBySlug(slug);

  if (!blog) return { title: d.blog.notFound };

  const title =
    pick(locale, blog.seoTitle, blog.seoTitleEn) ??
    pick(locale, blog.title, blog.titleEn);
  const description =
    pick(locale, blog.seoDescription, blog.seoDescriptionEn) ??
    pick(locale, blog.excerpt, blog.excerptEn);

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blog/${blog.slug}` },
    openGraph: blog.coverImage
      ? {
          images: [{ url: blog.coverImage }],
          title,
          description,
          type: "article",
        }
      : { title, description, type: "article" },
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const { locale, dictionary: d } = await getLocaleContext();
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const blogUrl = `${SITE_URL}/blog/${blog.slug}`;

  const title = pick(locale, blog.title, blog.titleEn);
  const excerpt = pick(locale, blog.excerpt, blog.excerptEn);
  const content = pick(locale, blog.content, blog.contentEn);
  const categoryName = blog.category
    ? pick(locale, blog.category.name, blog.category.nameEn)
    : null;
  const siteName = `${d.logo.first}${d.logo.second}`;

  // Assumption: docs/05_DATABASE.md's Blog model has no author column —
  // Pishtalk publishes as a single organizational voice, so the byline is
  // the community itself rather than a per-post author record.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: blog.coverImage ? [blog.coverImage] : undefined,
    datePublished: blog.publishedAt?.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: { "@type": "Organization", name: siteName },
    publisher: { "@type": "Organization", name: siteName },
    mainEntityOfPage: blogUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section className="pt-12" circuit>
        <Container className="mx-auto flex max-w-3xl flex-col gap-8">
          <Breadcrumbs
            items={[
              { label: d.blog.pageTitle, href: "/blog" },
              { label: title },
            ]}
          />
          <div className="flex flex-col gap-4">
            {categoryName ? (
              <Badge variant="accent" className="w-fit">
                {categoryName}
              </Badge>
            ) : null}
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span>{d.blog.author}</span>
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

          {blog.coverImage ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-card">
              <Image
                src={blog.coverImage}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : null}

          {/*
            Content is authored via the Tiptap rich-text editor in the admin
            panel and sanitized with DOMPurify at write time (see
            features/admin/actions/blogActions.ts), so it's safe to render
            directly here.
          */}
          <div
            className="prose prose-slate max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-accent-hover [&_p]:text-justify "
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div>
            <ShareButton title={title} url={blogUrl} />
          </div>
        </Container>
      </Section>
    </>
  );
}
