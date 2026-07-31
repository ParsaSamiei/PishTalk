import { z } from "zod";

export const eventTimelineItemSchema = z.object({
  time: z.string().trim().min(1, "زمان الزامی است"),
  title: z.string().trim().min(1, "عنوان الزامی است"),
  description: z.string().trim().optional().or(z.literal("")),
  // Optional English translations. Blank means "not translated yet" and the
  // public site falls back to the Persian text (lib/i18n/content.ts).
  titleEn: z.string().trim().optional().or(z.literal("")),
  descriptionEn: z.string().trim().optional().or(z.literal("")),
});

export const eventFormSchema = z.object({
  title: z.string().trim().min(3, "عنوان باید حداقل ۳ حرف باشد").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "نامک باید حداقل ۳ حرف باشد")
    .regex(/^[a-z0-9-]+$/, "نامک فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد"),
  subtitle: z.string().trim().max(300).optional().or(z.literal("")),
  description: z.string().trim().min(10, "توضیحات باید حداقل ۱۰ حرف باشد"),
  coverImage: z
    .string()
    .trim()
    .refine((val) => val === "" || val.startsWith("/") || /^https?:\/\//.test(val), {
      message: "آدرس تصویر معتبر نیست",
    })
    .optional()
    .or(z.literal("")),
  date: z.string().min(1, "تاریخ الزامی است"),
  startTime: z.string().trim().min(1, "ساعت شروع الزامی است"),
  endTime: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().min(3, "مکان الزامی است"),
  speakerName: z.string().trim().max(150).optional().or(z.literal("")),
  speakerBio: z.string().trim().max(1000).optional().or(z.literal("")),
  capacity: z.coerce.number().int().positive().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "CANCELLED"]),
  // Optional English translations. Blank means "not translated yet" and the
  // public site falls back to the Persian text (lib/i18n/content.ts).
  titleEn: z.string().trim().max(200).optional().or(z.literal("")),
  subtitleEn: z.string().trim().max(300).optional().or(z.literal("")),
  descriptionEn: z.string().trim().optional().or(z.literal("")),
  locationEn: z.string().trim().optional().or(z.literal("")),
  speakerNameEn: z.string().trim().max(150).optional().or(z.literal("")),
  speakerBioEn: z.string().trim().max(1000).optional().or(z.literal("")),
  seoTitleEn: z.string().trim().max(70, "عنوان سئو بهتر است حداکثر ۷۰ حرف باشد").optional().or(z.literal("")),
  seoDescriptionEn: z
    .string()
    .trim()
    .max(160, "توضیحات سئو بهتر است حداکثر ۱۶۰ حرف باشد")
    .optional()
    .or(z.literal("")),
  timeline: z.array(eventTimelineItemSchema),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
export type EventFormInput = z.input<typeof eventFormSchema>;
