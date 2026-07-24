import { Send } from "lucide-react";

import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  readonly instagram?: string | null;
  readonly telegram?: string | null;
  readonly className?: string;
}

/**
 * Renders the community's social links. Reads from site settings so
 * updating a handle in the admin panel never requires a code change.
 */
function SocialLinks({ instagram, telegram, className }: SocialLinksProps) {
  const links = [
    { href: instagram, label: "اینستاگرام پیشتاک", Icon: InstagramIcon },
    { href: telegram, label: "تلگرام پیشتاک", Icon: Send },
  ].filter((link): link is { href: string; label: string; Icon: typeof Send } =>
    Boolean(link.href)
  );

  if (links.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          className="flex size-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors duration-150 hover:border-accent hover:text-accent-hover"
        >
          <Icon className="size-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export { SocialLinks };
