"use client";

import { BlogForm } from "@/features/admin/components/BlogForm";
import { updateBlog } from "@/features/admin/actions/blogActions";
import type { BlogFormValues } from "@/features/admin/types/blogForm";

interface EditBlogFormProps {
  readonly blogId: string;
  readonly defaultValues: Partial<BlogFormValues>;
  readonly categories: ReadonlyArray<{ id: string; name: string }>;
}

function EditBlogForm({ blogId, defaultValues, categories }: EditBlogFormProps) {
  async function handleSubmit(values: BlogFormValues) {
    return updateBlog(blogId, values);
  }

  return (
    <BlogForm
      defaultValues={defaultValues}
      categories={categories}
      onSubmit={handleSubmit}
      submitLabel="ذخیره تغییرات"
    />
  );
}

export { EditBlogForm };
