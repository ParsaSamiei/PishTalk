import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { resolveCertificateName } from "@/features/registration/types/registration";

/**
 * Registration fields are free text supplied by anonymous site visitors.
 * Excel/Sheets treats a cell starting with =, +, -, or @ as a formula, so an
 * attacker could enter a value like `=HYPERLINK(...)` as their "company" and
 * have it execute when an admin opens the export (CSV/formula injection).
 * Prefixing with a leading apostrophe forces the cell to be read as text.
 */
function neutralizeFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function escapeCsvField(value: string): string {
  const safeValue = neutralizeFormula(value);
  if (/[",\n]/.test(safeValue)) {
    return `"${safeValue.replace(/"/g, '""')}"`;
  }
  return safeValue;
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
    "نام برای گواهی",
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
      resolveCertificateName(registration),
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
