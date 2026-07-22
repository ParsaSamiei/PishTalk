import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const STATUS_LABELS: Record<string, string> = {
  REGISTERED: "ثبت‌نام شده",
  CANCELLED: "لغوشده",
  ATTENDED: "حضور یافته",
};

export async function GET() {
  await requireAdmin();

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: { select: { title: true } } },
  });

  const rows = registrations.map((registration) => ({
    نام: registration.firstName,
    "نام خانوادگی": registration.lastName,
    موبایل: registration.phone,
    ایمیل: registration.email ?? "",
    دانشگاه: registration.university ?? "",
    شرکت: registration.company ?? "",
    حرفه: registration.profession ?? "",
    رویداد: registration.event.title,
    وضعیت: STATUS_LABELS[registration.status] ?? registration.status,
    "تاریخ ثبت‌نام": registration.createdAt.toLocaleDateString("fa-IR"),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ثبت‌نام‌ها");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="pishtalk-registrations.xlsx"`,
    },
  });
}
