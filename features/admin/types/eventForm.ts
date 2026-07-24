import { z } from "zod";

export const eventTimelineItemSchema = z.object({
  time: z.string().trim().min(1, "زمان الزامی است"),
  title: z.string().trim().min(1, "عنوان الزامی است"),
  description: z.string().trim().optional().or(z.literal("")),
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
  coverImage: z.string().trim().url("آدرس تصویر معتبر نیست").optional().or(z.literal("")),
  date: z.string().min(1, "تاریخ الزامی است"),
  startTime: z.string().trim().min(1, "ساعت شروع الزامی است"),
  endTime: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().min(3, "مکان الزامی است"),
  speakerName: z.string().trim().max(150).optional().or(z.literal("")),
  speakerBio: z.string().trim().max(1000).optional().or(z.literal("")),
  capacity: z.coerce.number().int().positive().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "CANCELLED"]),
  timeline: z.array(eventTimelineItemSchema),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
export type EventFormInput = z.input<typeof eventFormSchema>;
