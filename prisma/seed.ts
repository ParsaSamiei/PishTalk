import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Site settings (singleton) ---
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteName: "پیشتاک",
        tagline: "جامعه مهندسان رباتیک، هوش مصنوعی و فناوری",
        description:
          "پیشتاک رویداد ماهانه رباتیک، هوش مصنوعی و مهندسی نرم‌افزار است که توسط پژوهشکده رباتیک پیشنام برگزار می‌شود.",
        contactEmail: "info@pishtalk.ir",
        instagram: "https://instagram.com/pishtalk",
        telegram: "https://t.me/pishtalk",
        pishnamUrl: "https://pishnam.org",
      },
    });
  }

  // --- Admin user ---
  const adminEmail = "admin@pishtalk.ir";
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        name: "مدیر پیشتاک",
        email: adminEmail,
        passwordHash: await bcrypt.hash("ChangeMe123!", 10),
        role: "SUPER_ADMIN",
      },
    });
    console.log(`Seeded admin: ${adminEmail} / ChangeMe123! (change this immediately)`);
  }

  // --- Next event ---
  const nextEventDate = new Date();
  nextEventDate.setDate(nextEventDate.getDate() + 21);

  const nextEvent = await prisma.event.upsert({
    where: { slug: "pishtalk-05" },
    update: {},
    create: {
      slug: "pishtalk-05",
      title: "پیشتاک #۵: یادگیری تقویتی در رباتیک",
      subtitle: "از تئوری تا پیاده‌سازی روی ربات‌های واقعی",
      description:
        "در این نشست به بررسی کاربردهای یادگیری تقویتی در کنترل ربات‌ها می‌پردازیم و چند نمونه پیاده‌سازی واقعی را مرور می‌کنیم.",
      date: nextEventDate,
      startTime: "18:00",
      endTime: "20:30",
      location: "تهران، دانشگاه علم و صنعت ایران، دانشکده کامپیوتر",
      speakerName: "مهندس علی رضایی",
      speakerBio: "پژوهشگر رباتیک و یادگیری ماشین، پژوهشکده رباتیک پیشنام.",
      capacity: 80,
      status: "PUBLISHED",
      timeline: {
        create: [
          { time: "18:00", title: "ورود و پذیرش", sortOrder: 0 },
          { time: "18:20", title: "سخنرانی اصلی", sortOrder: 1 },
          { time: "19:30", title: "پرسش و پاسخ", sortOrder: 2 },
          { time: "19:50", title: "شبکه‌سازی و پذیرایی", sortOrder: 3 },
        ],
      },
    },
  });

  // --- Past events ---
  for (let i = 1; i <= 4; i += 1) {
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - i);

    await prisma.event.upsert({
      where: { slug: `pishtalk-0${5 - i}` },
      update: {},
      create: {
        slug: `pishtalk-0${5 - i}`,
        title: `پیشتاک #${5 - i}`,
        subtitle: "گزارش رویداد گذشته پیشتاک",
        description: "این رویداد با موفقیت برگزار شد.",
        date: pastDate,
        startTime: "18:00",
        location: "تهران، دانشگاه علم و صنعت ایران",
        status: "PUBLISHED",
      },
    });
  }

  // --- Category + blog ---
  const category = await prisma.category.upsert({
    where: { slug: "robotics" },
    update: {},
    create: { name: "رباتیک", slug: "robotics" },
  });

  await prisma.blog.upsert({
    where: { slug: "chera-pishtalk" },
    update: {},
    create: {
      slug: "chera-pishtalk",
      title: "چرا پیشتاک را شروع کردیم",
      excerpt: "داستان شکل‌گیری جامعه‌ای برای مهندسان رباتیک و هوش مصنوعی.",
      content:
        "<p>پیشتاک از یک ایده ساده شروع شد: مهندسانی که در سکوت کار می‌کنند باید فضایی برای گفتگو داشته باشند.</p>",
      categoryId: category.id,
      published: true,
      publishedAt: new Date(),
      readingTime: 4,
    },
  });

  // --- FAQ ---
  const faqItems = [
    {
      question: "آیا شرکت در رویدادها رایگان است؟",
      answer: "بله، تمام رویدادهای پیشتاک رایگان هستند.",
    },
    {
      question: "چه کسانی می‌توانند شرکت کنند؟",
      answer: "هر علاقه‌مند به رباتیک، هوش مصنوعی و فناوری، از دانشجو تا مهندس شاغل.",
    },
    {
      question: "آیا نیاز به دانش تخصصی دارم؟",
      answer: "خیر، محتوای رویدادها برای سطوح مختلف طراحی شده است.",
    },
  ];
  for (const [index, faq] of faqItems.entries()) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faq.create({ data: { ...faq, sortOrder: index } });
    }
  }

  // --- Rules ---
  const ruleItems = [
    {
      title: "احترام متقابل",
      description: "با تمام شرکت‌کنندگان با احترام رفتار کنید.",
      icon: "respect",
    },
    {
      title: "مشارکت فعال",
      description: "در بحث‌ها و پرسش و پاسخ مشارکت کنید.",
      icon: "discussion",
    },
    {
      title: "شبکه‌سازی سالم",
      description: "به دیگران فرصت صحبت و معرفی خود را بدهید.",
      icon: "community",
    },
  ];
  for (const [index, rule] of ruleItems.entries()) {
    const existing = await prisma.rule.findFirst({ where: { title: rule.title } });
    if (!existing) {
      await prisma.rule.create({ data: { ...rule, sortOrder: index } });
    }
  }

  console.log("Seed complete. Next event:", nextEvent.title);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
