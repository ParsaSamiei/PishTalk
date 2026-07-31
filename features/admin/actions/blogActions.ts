"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import {
  blogFormSchema,
  type BlogFormValues,
} from "@/features/admin/types/blogForm";
import { blankToNull } from "@/features/admin/actions/normalize";
import type { ActionResult } from "@/features/admin/actions/eventActions";

export interface CreateBlogResult extends ActionResult {
  readonly blogId?: string;
}

const TRANSLATABLE = [
  "titleEn",
  "excerptEn",
  "contentEn",
  "seoTitleEn",
  "seoDescriptionEn",
] as const;

/**
 * Tiptap serializes a cleared editor as `<p></p>` rather than "", which would
 * otherwise be stored as real content and beat the Persian fallback in
 * `pick()`. Treated as blank so `blankToNull` can turn it into NULL.
 */
function richTextOrBlank(html: string | undefined): string | undefined {
  if (html === undefined) return undefined;
  const sanitized = sanitizeHtml(html);
  return sanitized.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/g, "").trim() === ""
    ? ""
    : sanitized;
}

function toBlogData(values: BlogFormValues) {
  return blankToNull(
    {
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt,
      // Sanitized here rather than trusting the rich-text editor's output —
      // this action is callable directly regardless of which UI produced
      // the value (docs/05_DATABASE.md: never trust client input).
      content: sanitizeHtml(values.content),
      coverImage: values.coverImage || null,
      categoryId: values.categoryId || null,
      readingTime:
        values.readingTime === "" || values.readingTime === undefined
          ? null
          : values.readingTime,
      published: values.published,
      publishedAt: values.published ? new Date() : null,
      titleEn: values.titleEn,
      excerptEn: values.excerptEn,
      // Same sanitization as the Persian body: this is rich text that gets
      // rendered as HTML.
      contentEn: richTextOrBlank(values.contentEn),
      seoTitleEn: values.seoTitleEn,
      seoDescriptionEn: values.seoDescriptionEn,
    },
    TRANSLATABLE,
  );
}

export async function createBlog(
  values: BlogFormValues,
): Promise<CreateBlogResult> {
  await requireAdmin();
  const parsed = blogFormSchema.safeParse(values);
  if (!parsed.success)
    return { success: false, error: "اطلاعات وارد شده معتبر نیست." };

  try {
    const existing = await prisma.blog.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing)
      return { success: false, error: "این نامک قبلاً استفاده شده است." };

    const blog = await prisma.blog.create({ data: toBlogData(parsed.data) });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");
    // Navigation is left to the caller (NewBlogForm) via router.push, once
    // it has resolved this promise — see that component for why: mixing
    // redirect()'s throw-based control flow with a normal return value made
    // it ambiguous on the client whether create had actually succeeded.
    return { success: true, blogId: blog.id };
  } catch (err) {
    console.error("createBlog failed:", err);
    return { success: false, error: "ثبت مطلب با خطا مواجه شد." };
  }
}

export async function updateBlog(
  id: string,
  values: BlogFormValues,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = blogFormSchema.safeParse(values);
  if (!parsed.success)
    return { success: false, error: "اطلاعات وارد شده معتبر نیست." };

  try {
    const existing = await prisma.blog.findFirst({
      where: { slug: parsed.data.slug, NOT: { id } },
    });
    if (existing)
      return { success: false, error: "این نامک قبلاً استفاده شده است." };

    const current = await prisma.blog.findUnique({ where: { id } });

    await prisma.blog.update({
      where: { id },
      data: {
        ...toBlogData(parsed.data),
        // Keep the original publish date once a post has already gone live.
        publishedAt:
          current?.publishedAt ?? (parsed.data.published ? new Date() : null),
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${id}`);
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("updateBlog failed:", err);
    return { success: false, error: "به‌روزرسانی مطلب با خطا مواجه شد." };
  }
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.blog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("deleteBlog failed:", err);
    return { success: false, error: "حذف مطلب با خطا مواجه شد." };
  }
}
