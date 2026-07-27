"use client";

import { useRouter } from "next/navigation";

import { BlogForm } from "@/features/admin/components/BlogForm";
import { createBlog } from "@/features/admin/actions/blogActions";
import type { BlogFormValues } from "@/features/admin/types/blogForm";

interface NewBlogFormProps {
  readonly categories: ReadonlyArray<{ id: string; name: string }>;
}

function NewBlogForm({ categories }: NewBlogFormProps) {
  const router = useRouter();

  async function handleSubmit(values: BlogFormValues) {
    const result = await createBlog(values);
    // BlogForm shows the success/failure toast based on this return value;
    // once it knows the outcome, move to the new post's edit page.
    if (result.success && result.blogId) {
      router.push(`/admin/blog/${result.blogId}`);
    }
    return { success: result.success, error: result.error };
  }

  return (
    <BlogForm
      categories={categories}
      onSubmit={handleSubmit}
      submitLabel="ایجاد مطلب"
    />
  );
}

export { NewBlogForm };
