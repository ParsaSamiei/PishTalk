import Image from "next/image";

import { cn } from "@/lib/utils";

interface MugIllustrationProps {
  readonly className?: string;
}

// Brand tokens (see app/globals.css / docs/02_BRAND_IDENTITY.md). Kept as
// plain hex rather than Tailwind classes because these colours are part of
// the illustration itself (a navy mug stays navy in both themes) rather
// than UI chrome that should invert with the theme — only the backdrop
// plate behind the scene switches with dark mode, via className below.
const NAVY = "#1e3a6b"; // mug body, board body, rim — brighter than
// --color-primary so it still reads as navy (not near-black) against a
// dark hero background.
const NAVY_DEEP = "#11274a"; // coaster + chip modules
const NAVY_DARK = "#0b1830"; // notebook cover, recessed shadow, gear hubs
const GOLD = "#f4b942"; // --color-accent
const GOLD_MUTED = "#d89e2e"; // --color-accent-hover, used sparingly
const CREAM = "#f8fafc"; // --color-surface-secondary (paper, highlight)
const SILVER = "#cbd5e1"; // metal (screwdriver shaft, USB notch)
const INK = "#475569"; // --color-text-secondary (sketch lines)

/**
 * Flat, stylised hero illustration: a navy ceramic mug bearing the Pishtalk
 * logo, sitting on a PCB-shaped coaster, with a tiny Arduino board, a
 * sketch notebook and a screwdriver scattered beside it. Steam is drawn as
 * rising circuit traces that resolve into small gears.
 *
 * This intentionally replaces the earlier react-three-fiber CoffeeMugScene:
 * docs/02_BRAND_IDENTITY.md calls for flat, minimal illustrations and
 * explicitly lists 3D renders under "avoid". A flat SVG also drops the
 * three.js/@react-three bundle from the client entirely (they were only
 * used here) and lets this render as a plain Server Component — no
 * "use client", no dynamic()/ssr:false, no loading skeleton needed.
 *
 * Motion is ambient CSS only (the --animate-* tokens already used by
 * CircuitBackground/FloatingIcon), respecting prefers-reduced-motion via
 * Tailwind's motion-reduce: variant, so no JS/useReducedMotion is needed
 * either. The Hero's own pointer-parallax wrapper still applies on top of
 * this, since it wraps whatever illustration is passed to it.
 *
 * The logo itself is the real /logo.png asset (via next/image), laid over
 * the mug's front face, rather than a hand-redrawn approximation — same
 * reasoning the old scene's comment called for ("swap this out ... if you
 * have the real vector logo and want an exact match").
 */
function MugIllustration({ className }: MugIllustrationProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative aspect-square", className)}
    >
      <svg viewBox="0 0 440 440" className="h-full w-full">
        {/* Backdrop plate — matches the loading-skeleton classes so there's
            no visual jump once this content paints in. */}
        <rect
          x="6"
          y="6"
          width="428"
          height="428"
          rx="46"
          className="fill-surface-secondary dark:fill-white/5"
        />

        {/* ===================== PCB coaster ===================== */}
        <g>
          <rect
            x="108"
            y="298"
            width="224"
            height="74"
            rx="14"
            fill={NAVY_DEEP}
            stroke={GOLD}
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          {/* castellated-edge notches */}
          <rect x="150" y="364" width="14" height="10" fill={NAVY_DARK} />
          <rect x="276" y="364" width="14" height="10" fill={NAVY_DARK} />
          {/* copper-style traces */}
          <path
            d="M126 316 H168 V332 H206"
            fill="none"
            stroke={GOLD}
            strokeWidth="2.5"
            opacity="0.8"
          />
          <path
            d="M314 320 H280 V338 H244"
            fill="none"
            stroke={GOLD}
            strokeWidth="2.5"
            opacity="0.8"
          />
          <path
            d="M160 352 H196 V342"
            fill="none"
            stroke={GOLD}
            strokeWidth="2.5"
            opacity="0.55"
          />
          <circle cx="126" cy="316" r="3" fill={GOLD} opacity="0.9" />
          <circle cx="206" cy="332" r="3" fill={GOLD} opacity="0.9" />
          <circle cx="314" cy="320" r="3" fill={GOLD} opacity="0.9" />
          <circle cx="244" cy="338" r="3" fill={GOLD} opacity="0.9" />
          <circle cx="160" cy="352" r="3" fill={GOLD} opacity="0.55" />
        </g>

        {/* ===================== Tiny Arduino board ===================== */}
        <g transform="translate(65,368) rotate(-10)">
          <rect
            x="-47.5"
            y="-31"
            width="95"
            height="62"
            rx="7"
            fill={NAVY}
            stroke={GOLD}
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />
          {/* header pins */}
          <rect x="-40" y="-29" width="4.5" height="7" fill={GOLD} />
          <rect x="-31" y="-29" width="4.5" height="7" fill={GOLD} />
          <rect x="-22" y="-29" width="4.5" height="7" fill={GOLD} />
          <rect x="-13" y="-29" width="4.5" height="7" fill={GOLD} />
          <rect x="-4" y="-29" width="4.5" height="7" fill={GOLD} />
          {/* chip modules */}
          <rect
            x="-36"
            y="-8"
            width="26"
            height="16"
            rx="2"
            fill={NAVY_DEEP}
            stroke={GOLD}
            strokeWidth="1.3"
          />
          <rect
            x="-2"
            y="-8"
            width="15"
            height="16"
            rx="2"
            fill={NAVY_DEEP}
            stroke={GOLD}
            strokeWidth="1.3"
          />
          {/* usb notch */}
          <rect x="17" y="9" width="18" height="13" rx="2" fill={SILVER} />
          <path
            d="M-36 13 H-10 V20"
            fill="none"
            stroke={GOLD}
            strokeWidth="1.4"
            opacity="0.7"
          />
        </g>

        {/* ===================== Notebook with sketches ===================== */}
        <g transform="translate(372,358) rotate(9)">
          <rect
            x="-50"
            y="-38"
            width="100"
            height="76"
            rx="7"
            fill={NAVY_DARK}
            stroke={GOLD}
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <rect x="-43" y="-32" width="86" height="64" rx="4" fill={CREAM} />
          {/* spiral binding */}
          <circle cx="-43" cy="-24" r="2.8" fill={GOLD} />
          <circle cx="-43" cy="-12" r="2.8" fill={GOLD} />
          <circle cx="-43" cy="0" r="2.8" fill={GOLD} />
          <circle cx="-43" cy="12" r="2.8" fill={GOLD} />
          <circle cx="-43" cy="24" r="2.8" fill={GOLD} />
          {/* sketch doodles: a trace squiggle, a chip, a gear, two notes */}
          <path
            d="M-25 -17 q9 -9 17 0 t17 0"
            fill="none"
            stroke={INK}
            strokeWidth="1.5"
            opacity="0.8"
          />
          <rect
            x="-23"
            y="1"
            width="14"
            height="10"
            rx="1.5"
            fill="none"
            stroke={INK}
            strokeWidth="1.3"
            opacity="0.8"
          />
          <circle
            cx="8"
            cy="6"
            r="7"
            fill="none"
            stroke={INK}
            strokeWidth="1.3"
            opacity="0.8"
          />
          <path
            d="M-25 21 H16 M-25 26 H4"
            stroke={INK}
            strokeWidth="1.3"
            opacity="0.5"
          />
        </g>

        {/* ===================== Screwdriver ===================== */}
        <g transform="translate(195,378) rotate(-24)">
          <rect
            x="-55"
            y="-6"
            width="70"
            height="12"
            rx="4"
            fill={SILVER}
            stroke={NAVY_DARK}
            strokeWidth="1"
            strokeOpacity="0.25"
          />
          <rect x="10" y="-4" width="10" height="8" fill="#64748b" />
          <rect
            x="14"
            y="-11"
            width="44"
            height="22"
            rx="10"
            fill={GOLD}
            stroke={NAVY_DARK}
            strokeWidth="1"
            strokeOpacity="0.2"
          />
          <rect x="30" y="-11" width="4" height="22" fill={GOLD_MUTED} opacity="0.6" />
        </g>

        {/* ===================== Mug ===================== */}
        <g>
          <ellipse cx="225" cy="301" rx="72" ry="7" fill="#020817" opacity="0.18" />
          {/* handle */}
          <path
            d="M290,192 C332,192 336,258 292,262"
            fill="none"
            stroke={NAVY}
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* body */}
          <path
            d="M158,160 L292,160 L282,292 Q282,300 274,300 L176,300 Q168,300 168,292 Z"
            fill={NAVY}
            stroke={GOLD}
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          {/* glossy highlight */}
          <rect x="174" y="178" width="8" height="100" rx="4" fill={CREAM} opacity="0.15" />
          {/* rim */}
          <ellipse
            cx="225"
            cy="160"
            rx="68"
            ry="15"
            fill={NAVY}
            stroke={GOLD}
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          <ellipse cx="225" cy="159" rx="56" ry="10" fill={NAVY_DARK} />
        </g>

        {/* ===================== Steam: circuit traces + gears ===================== */}
        <g className="animate-drift motion-reduce:animate-none">
          <g
            fill="none"
            stroke={GOLD}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M205 150 V122 H182 V96 H205" strokeWidth="4" opacity="0.65" />
            <path
              d="M245 150 V128 H262 V100 H248 V70"
              strokeWidth="4"
              opacity="0.5"
            />
            <circle cx="182" cy="122" r="3.5" fill={GOLD} stroke="none" opacity="0.65" />
            <circle cx="205" cy="96" r="3.5" fill={GOLD} stroke="none" opacity="0.65" />
            <circle cx="262" cy="128" r="3.5" fill={GOLD} stroke="none" opacity="0.5" />
            <circle cx="248" cy="100" r="3.5" fill={GOLD} stroke="none" opacity="0.5" />
          </g>

          {/* rotating gear */}
          <g transform="translate(196,80)">
            <g
              className="animate-spin-slow motion-reduce:animate-none"
              style={{ transformOrigin: "0px 0px" }}
            >
              <circle r="16" fill={GOLD} opacity="0.8" />
              <rect x="-3" y="-20" width="6" height="8" fill={GOLD} opacity="0.8" />
              <rect x="-3" y="12" width="6" height="8" fill={GOLD} opacity="0.8" />
              <rect x="-20" y="-3" width="8" height="6" fill={GOLD} opacity="0.8" />
              <rect x="12" y="-3" width="8" height="6" fill={GOLD} opacity="0.8" />
              <circle r="6" fill={NAVY_DARK} />
            </g>
          </g>

          {/* small static gear */}
          <g transform="translate(248,58)">
            <circle r="10" fill={GOLD} opacity="0.55" />
            <rect x="-2" y="-13" width="4" height="5" fill={GOLD} opacity="0.55" />
            <rect x="-2" y="8" width="4" height="5" fill={GOLD} opacity="0.55" />
            <rect x="-13" y="-2" width="5" height="4" fill={GOLD} opacity="0.55" />
            <rect x="8" y="-2" width="5" height="4" fill={GOLD} opacity="0.55" />
            <circle r="4" fill={NAVY_DARK} />
          </g>
        </g>
      </svg>

      {/* Real brand mark, laid over the mug's front face. */}
      <Image
        src="/logo.png"
        alt=""
        width={212}
        height={219}
        className="pointer-events-none absolute left-[44.5%] top-[43%] h-auto w-[13%] object-contain"
      />
    </div>
  );
}

export { MugIllustration };
