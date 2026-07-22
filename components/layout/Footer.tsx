import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { MAIN_NAV_ITEMS } from "@/lib/navigation";

interface FooterProps {
  readonly tagline?: string;
  readonly contactEmail?: string | null;
  readonly phone?: string | null;
  readonly instagram?: string | null;
  readonly telegram?: string | null;
  readonly pishnamUrl?: string | null;
}

/**
 * Footer per docs/03_Information_Architecture.md: About, Quick Links, Contact,
 * social links, Pishnam website, and copyright. Kept deliberately uncrowded.
 */
function Footer({
  tagline = "جامعه مهندسان رباتیک، هوش مصنوعی و فناوری",
  contactEmail,
  phone,
  instagram,
  telegram,
  pishnamUrl = "https://pishnam.org",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-secondary">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-text-secondary">{tagline}</p>
          <SocialLinks instagram={instagram} telegram={telegram} />
        </div>

        <nav aria-label="لینک‌های سریع" className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-primary">لینک‌های سریع</h3>
          <ul className="flex flex-col gap-2">
            {MAIN_NAV_ITEMS.slice(0, 6).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-primary">ارتباط با ما</h3>
          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            {contactEmail ? (
              <li>
                <a href={`mailto:${contactEmail}`} className="hover:text-text-primary">
                  {contactEmail}
                </a>
              </li>
            ) : null}
            {phone ? (
              <li>
                <a href={`tel:${phone}`} className="hover:text-text-primary" dir="ltr">
                  {phone}
                </a>
              </li>
            ) : null}
            <li>
              <a
                href={pishnamUrl ?? "https://pishnam.org"}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-text-primary"
              >
                وب‌سایت پیشنام
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-sm text-text-light sm:flex-row">
          <p>© {year} پیشتاک. تمامی حقوق محفوظ است.</p>
          <p>برگزار شده توسط پژوهشکده رباتیک پیشنام</p>
        </Container>
      </div>
    </footer>
  );
}

export { Footer };
