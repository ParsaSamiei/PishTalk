import Image from "next/image";
import { cn } from "@/lib/utils";
interface MugIllustrationProps {
  readonly className?: string;
}

const NAVY = "#1e3a6b";
const NAVY_DEEP = "#11274a";
const NAVY_DARK = "#0b1830";
const GOLD = "#f4b942";
const GOLD_MUTED = "#d89e2e";
const CREAM = "#f8fafc";
const SILVER = "#cbd5e1";
const INK = "#475569";
const LED_GREEN = "#10b981"; // Added for interactivity

export function MugIllustration({ className }: MugIllustrationProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative aspect-square group/container", className)}
    >
      <svg viewBox="0 0 440 440" className="h-full w-full">
        <defs>
          {/* Subtle gold glow for traces and steam */}
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <style>{`
        @keyframes drawTrace {
          0% { stroke-dashoffset: 150; opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        .animate-draw {
          stroke-dasharray: 150;
          animation: drawTrace 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
        </defs>

        {/* Backdrop plate with a subtle gradient on hover */}
        {/* <rect
      x="6"
      y="6"
      width="428"
      height="428"
      rx="46"
      className="fill-surface-secondary transition-colors duration-700 group-hover/container:fill-slate-100 dark:fill-white/5 dark:group-hover/container:fill-white/10"
    /> */}

        {/* ===================== PCB coaster ===================== */}
        <g className="transition-transform duration-500 ease-out">
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

          {/* copper-style traces with draw animation */}
          <g filter="url(#gold-glow)">
            <path
              d="M126 316 H168 V332 H206"
              fill="none"
              stroke={GOLD}
              strokeWidth="2.5"
              className="animate-draw"
            />
            <path
              d="M314 320 H280 V338 H244"
              fill="none"
              stroke={GOLD}
              strokeWidth="2.5"
              className="animate-draw delay-100"
            />
            <path
              d="M160 352 H196 V342"
              fill="none"
              stroke={GOLD}
              strokeWidth="2.5"
              className="animate-draw delay-200"
            />
          </g>

          <circle cx="126" cy="316" r="3" fill={GOLD} opacity="0.9" />
          <circle cx="206" cy="332" r="3" fill={GOLD} opacity="0.9" />
          <circle cx="314" cy="320" r="3" fill={GOLD} opacity="0.9" />
          <circle cx="244" cy="338" r="3" fill={GOLD} opacity="0.9" />
          <circle cx="160" cy="352" r="3" fill={GOLD} opacity="0.55" />
        </g>

        {/* ===================== Tiny Arduino board ===================== */}
        <g
          transform="translate(130,368) rotate(-10)"
          className="cursor-crosshair group/board"
          style={{ transformOrigin: "20% 80%" }}
        >
          {/* Container scales slightly on hover */}
          <g className="transition-transform duration-300 group-hover/board:scale-105 group-hover/board:-rotate-3">
            <rect
              x="-57.5"
              y="-31"
              width="95"
              height="62"
              rx="7"
              fill={NAVY}
              stroke={GOLD}
              strokeWidth="1.5"
              strokeOpacity="0.45"
            />
            {/* Interactive LED - Turns on when hovering over the board */}
            <circle
              cx="-35"
              cy="20"
              r="2.5"
              fill={LED_GREEN}
              className="opacity-103 transition-opacity duration-300 group-hover/board:opacity-100 group-hover/board:animate-pulse"
              filter="url(#gold-glow)"
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
        </g>

        {/* ===================== Notebook with sketches ===================== */}
        <g
          transform="translate(372,358) rotate(9)"
          className="transition-transform duration-500 hover:rotate-6 cursor-pointer"
        >
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
          {[...Array(5)].map((_, i) => (
            <circle key={i} cx="-43" cy={-24 + i * 12} r="2.8" fill={GOLD} />
          ))}
          {/* sketch doodles */}
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
        <g
          transform="translate(195,378) rotate(-24)"
          className="cursor-grab hover:cursor-grabbing group/tool transition-transform duration-300 hover:translate-x-2 hover:-translate-y-1 hover:-rotate-12"
        >
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
          <rect
            x="30"
            y="-11"
            width="4"
            height="22"
            fill={GOLD_MUTED}
            opacity="0.6"
          />
        </g>

        {/* ===================== Steam: circuit traces + gears ===================== */}
        {/* Hovering the container makes the steam drift faster */}
        <g className="animate-drift motion-reduce:animate-none group-hover/container:animate-pulse">
          <g
            fill="none"
            stroke={GOLD}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#gold-glow)"
          >
            <path
              d="M205 150 V122 H182 V96 H205"
              strokeWidth="4"
              className="animate-draw delay-100"
            />
            <path
              d="M245 150 V128 H262 V100 H248 V70"
              strokeWidth="4"
              className="animate-draw delay-300"
            />
            <circle
              cx="182"
              cy="122"
              r="3.5"
              fill={GOLD}
              stroke="none"
              opacity="0.65"
            />
            <circle
              cx="205"
              cy="96"
              r="3.5"
              fill={GOLD}
              stroke="none"
              opacity="0.65"
            />
            <circle
              cx="262"
              cy="128"
              r="3.5"
              fill={GOLD}
              stroke="none"
              opacity="0.5"
            />
            <circle
              cx="248"
              cy="100"
              r="3.5"
              fill={GOLD}
              stroke="none"
              opacity="0.5"
            />
          </g>

          {/* rotating gear - Speeds up when container is hovered */}
          <g transform="translate(196,80)">
            <g
              className="animate-spin group-hover/container:[animation-duration:1.5s] motion-reduce:animate-none"
              style={{ transformOrigin: "0px 0px" }}
            >
              <circle r="16" fill={GOLD} opacity="0.8" />
              <rect
                x="-3"
                y="-20"
                width="6"
                height="8"
                fill={GOLD}
                opacity="0.8"
              />
              <rect
                x="-3"
                y="12"
                width="6"
                height="8"
                fill={GOLD}
                opacity="0.8"
              />
              <rect
                x="-20"
                y="-3"
                width="8"
                height="6"
                fill={GOLD}
                opacity="0.8"
              />
              <rect
                x="12"
                y="-3"
                width="8"
                height="6"
                fill={GOLD}
                opacity="0.8"
              />
              <circle r="6" fill={NAVY_DARK} />
            </g>
          </g>

          {/* small static gear - Rotates opposite direction on hover */}
          <g transform="translate(248,58)">
            <g
              className="transition-transform duration-1000 group-hover/container:-rotate-90"
              style={{ transformOrigin: "0px 0px" }}
            >
              <circle r="10" fill={GOLD} opacity="0.55" />
              <rect
                x="-2"
                y="-13"
                width="4"
                height="5"
                fill={GOLD}
                opacity="0.55"
              />
              <rect
                x="-2"
                y="8"
                width="4"
                height="5"
                fill={GOLD}
                opacity="0.55"
              />
              <rect
                x="-13"
                y="-2"
                width="5"
                height="4"
                fill={GOLD}
                opacity="0.55"
              />
              <rect
                x="8"
                y="-2"
                width="5"
                height="4"
                fill={GOLD}
                opacity="0.55"
              />
              <circle r="4" fill={NAVY_DARK} />
            </g>
          </g>
        </g>
      </svg>

      {/* Mug and Logo wrapper - Keeps them synced during hover scales */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative w-full h-full pointer-events-auto cursor-pointer transition-transform duration-500 ease-out hover:scale-105 hover:-translate-y-2 group/mug">
          <svg
            viewBox="0 0 440 440"
            className="absolute inset-0 h-full w-full pointer-events-none"
          >
            <g className="pointer-events-auto">
              <ellipse
                cx="225"
                cy="301"
                rx="72"
                ry="7"
                fill="#020817"
                opacity="0.18"
                className="transition-opacity duration-500 group-hover/mug:opacity-10"
              />
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
              <rect
                x="174"
                y="178"
                width="8"
                height="100"
                rx="4"
                fill={CREAM}
                opacity="0.15"
              />
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
          </svg>

          {/* Real brand mark */}
          <Image
            src="/logo.png"
            alt=""
            width={212}
            height={219}
            className="pointer-events-none absolute left-[44.5%] top-[43%] h-auto w-[13%] object-contain drop-shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
