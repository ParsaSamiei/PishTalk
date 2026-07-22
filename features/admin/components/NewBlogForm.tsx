"use client";

import { BlogForm } from "@/features/admin/components/BlogForm";
import { createBlog } from "@/features/admin/actions/blogActions";
import type { BlogFormValues } from "@/features/admin/types/blogForm";

interface NewBlogFormProps {
  readonly categories: ReadonlyArray<{ id: string; name: string }>;
}

function NewBlogForm({ categories }: NewBlogFormProps) {
  async function handleSubmit(values: BlogFormValues) {
    return createBlog(values);
  }

  return <BlogForm categories={categories} onSubmit={handleSubmit} submitLabel="ایجاد مطلب" />;
}

export { NewBlogForm };
