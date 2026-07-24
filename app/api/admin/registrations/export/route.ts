import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  await requireAdmin();

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: { select: { title: true } } },
  });

  const header = [
    "نام",
    "نام خانوادگی",
    "موبایل",
    "ایمیل",
    "دانشگاه",
    "شرکت",
    "حرفه",
    "رویداد",
    "وضعیت",
    "تاریخ ثبت‌نام",
  ];

  const rows = registrations.map((registration) =>
    [
      registration.firstName,
      registration.lastName,
      registration.phone,
      registration.email ?? "",
      registration.university ?? "",
      registration.company ?? "",
      registration.profession ?? "",
      registration.event.title,
      registration.status,
      registration.createdAt.toISOString(),
    ]
      .map(escapeCsvField)
      .join(",")
  );

  // BOM prefix so Excel opens Persian text as UTF-8 correctly.
  const csv = `\uFEFF${[header.join(","), ...rows].join("\n")}`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pishtalk-registrations.csv"`,
    },
  });
}
