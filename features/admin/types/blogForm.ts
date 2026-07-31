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
  coverImage: z
    .string()
    .trim()
    .refine((val) => val === "" || val.startsWith("/") || /^https?:\/\//.test(val), {
      message: "آدرس تصویر معتبر نیست",
    })
    .optional()
    .or(z.literal("")),
  categoryId: z.string().trim().optional().or(z.literal("")),
  readingTime: z.coerce.number().int().positive().optional().or(z.literal("")),
  // Optional English translations. Blank means "not translated yet" and the
  // public site falls back to the Persian text (lib/i18n/content.ts).
  titleEn: z.string().trim().max(200).optional().or(z.literal("")),
  excerptEn: z.string().trim().max(300).optional().or(z.literal("")),
  contentEn: z.string().trim().optional().or(z.literal("")),
  seoTitleEn: z.string().trim().max(70, "عنوان سئو بهتر است حداکثر ۷۰ حرف باشد").optional().or(z.literal("")),
  seoDescriptionEn: z
    .string()
    .trim()
    .max(160, "توضیحات سئو بهتر است حداکثر ۱۶۰ حرف باشد")
    .optional()
    .or(z.literal("")),
  published: z.boolean().default(false),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
export type BlogFormInput = z.input<typeof blogFormSchema>;
