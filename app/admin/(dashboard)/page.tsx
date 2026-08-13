import { CalendarDays, Users, Newspaper, Images } from "lucide-react";

import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";

async function getDashboardStats() {
  try {
    const [upcomingEvents, nextEvent, publishedBlogs, galleryImages] = await Promise.all([
      prisma.event.count({
        where: { status: "PUBLISHED", date: { gte: new Date(new Date().toDateString()) } },
      }),
      // "ثبت‌نام‌های رویداد بعدی" tracks the soonest upcoming event specifically,
      // not a lifetime total across every event ever held — that number only
      // grows and stops being useful as a day-to-day dashboard glance.
      prisma.event.findFirst({
        where: { status: "PUBLISHED", date: { gte: new Date(new Date().toDateString()) } },
        orderBy: { date: "asc" },
        select: { id: true, title: true },
      }),
      prisma.blog.count({ where: { published: true, deletedAt: null } }),
      prisma.galleryMedia.count({ where: { type: "IMAGE" } }),
    ]);

    const nextEventRegistrations = nextEvent
      ? await prisma.registration.count({
          where: { eventId: nextEvent.id, status: { in: ["PENDING", "APPROVED"] } },
        })
      : 0;

    return {
      upcomingEvents,
      nextEventTitle: nextEvent?.title ?? null,
      nextEventRegistrations,
      publishedBlogs,
      galleryImages,
    };
  } catch {
    return {
      upcomingEvents: 0,
      nextEventTitle: null,
      nextEventRegistrations: 0,
      publishedBlogs: 0,
      galleryImages: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "رویدادهای پیش رو", value: stats.upcomingEvents, icon: CalendarDays },
    {
      label: "ثبت‌نام‌های رویداد بعدی",
      value: stats.nextEventRegistrations,
      icon: Users,
      hint: stats.nextEventTitle ?? "رویداد پیش رویی ثبت نشده",
    },
    { label: "مطالب منتشرشده", value: stats.publishedBlogs, icon: Newspaper },
    { label: "تصاویر گالری", value: stats.galleryImages, icon: Images },
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">داشبورد</h1>
        <p className="text-text-secondary">نمای کلی از فعالیت‌های پیشتاک</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, ...rest }) => (
          <Card key={label}>
            <CardHeader>
              <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent-hover">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <CardTitle className="text-3xl">{value}</CardTitle>
            </CardHeader>
            <p className="text-sm text-text-secondary">{label}</p>
            {"hint" in rest && rest.hint ? (
              <p className="mt-1 truncate text-xs text-text-secondary/70" title={rest.hint}>
                {rest.hint}
              </p>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
