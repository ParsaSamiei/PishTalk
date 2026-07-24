import { z } from "zod";

export const blogFormSchema = z.object({
  title: z.string().trim().min(3, "عنوان باید حداقل ۳ حرف باشد").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "نامک باید حداقل ۳ حرف باشد")
    .regex(/^[a-z0-9-]+$/, "نامک فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد"),
  excerpt: z.string().trim().min(10, "خلاصه باید حداقل ۱۰ حرف باشد").max(300),
  content: z.string().trim().min(20, "محتوا باید حداقل ۲۰ حرف باشد"),
  coverImage: z.string().trim().url("آدرس تصویر معتبر نیست").optional().or(z.literal("")),
  categoryId: z.string().trim().optional().or(z.literal("")),
  readingTime: z.coerce.number().int().positive().optional().or(z.literal("")),
  published: z.boolean().default(false),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
export type BlogFormInput = z.input<typeof blogFormSchema>;
