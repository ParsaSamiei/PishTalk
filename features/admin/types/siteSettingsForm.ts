import { z } from "zod";

export const siteSettingsFormSchema = z.object({
  siteName: z.string().trim().min(1).max(100),
  tagline: z.string().trim().min(1).max(200),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  logo: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  favicon: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  heroTitle: z.string().trim().max(200).optional().or(z.literal("")),
  heroSubtitle: z.string().trim().max(300).optional().or(z.literal("")),
  contactEmail: z.string().trim().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  instagram: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  telegram: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  pishnamUrl: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  googleMapsEmbed: z.string().trim().max(2000).optional().or(z.literal("")),
  seoTitle: z.string().trim().max(70, "عنوان سئو بهتر است حداکثر ۷۰ حرف باشد").optional().or(z.literal("")),
  seoDescription: z
    .string()
    .trim()
    .max(160, "توضیحات سئو بهتر است حداکثر ۱۶۰ حرف باشد")
    .optional()
    .or(z.literal("")),
  defaultOgImage: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  googleAnalyticsId: z
    .string()
    .trim()
    .regex(/^(G-[A-Z0-9]+)?$/, "شناسه Google Analytics معتبر نیست (مثال: G-XXXXXXX)")
    .optional()
    .or(z.literal("")),
  maintenanceMode: z.boolean().default(false),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;
export type SiteSettingsFormInput = z.input<typeof siteSettingsFormSchema>;
