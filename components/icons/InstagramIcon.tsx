import type { SVGProps } from "react";

/**
 * lucide-react v1 removed brand/logo icons. This is a minimal geometric
 * rendition (rounded square + lens + flash dot) in the same stroke style
 * as the rest of the icon set, not a reproduction of Instagram's logo mark.
 */
function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export { InstagramIcon };
