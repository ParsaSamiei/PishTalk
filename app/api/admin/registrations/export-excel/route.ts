import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const STATUS_LABELS: Record<string, string> = {
  REGISTERED: "ثبت‌نام شده",
  CANCELLED: "لغوشده",
  ATTENDED: "حضور یافته",
};

/**
 * Registration fields are free text supplied by anonymous site visitors.
 * A value starting with =, +, -, or @ can be sniffed as a formula by some
 * spreadsheet tools, so neutralize it before writing the cell (see the
 * matching helper in the CSV export route for the full rationale).
 */
function neutralizeFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

export async function GET() {
  await requireAdmin();

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: { select: { title: true } } },
  });

  const rows = registrations.map((registration) => ({
    نام: neutralizeFormula(registration.firstName),
    "نام خانوادگی": neutralizeFormula(registration.lastName),
    موبایل: registration.phone,
    ایمیل: registration.email ?? "",
    دانشگاه: neutralizeFormula(registration.university ?? ""),
    شرکت: neutralizeFormula(registration.company ?? ""),
    حرفه: neutralizeFormula(registration.profession ?? ""),
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
