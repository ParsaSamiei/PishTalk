"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface RobotMascotProps {
  readonly className?: string;
}

/**
 * A friendly, custom-drawn robot mascot — flat, minimal and geometric per
 * docs/02_BRAND_IDENTITY.md's illustration rules (no stock art, no 3D
 * renders). It idles with a gentle float, blinks, and waves hello, all via
 * Framer Motion. Colours are fixed (not theme tokens) because the mascot
 * always sits on the hero's permanently-dark navy background regardless of
 * site-wide light/dark mode.
 */
function RobotMascot({ className }: RobotMascotProps) {
  const shouldReduceMotion = useReducedMotion();

  const floatAnimate = shouldReduceMotion ? { y: 0 } : { y: [0, -14, 0] };
  const floatTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 4, repeat: Infinity, ease: "easeInOut" as const };

  const shadowAnimate = shouldReduceMotion
    ? { scale: 1, opacity: 0.32 }
    : { scale: [1, 0.85, 1], opacity: [0.34, 0.2, 0.34] };

  const blinkAnimate = shouldReduceMotion
    ? { scaleY: 1 }
    : { scaleY: [1, 1, 0.08, 1, 1] };
  const blinkTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 4.6,
        repeat: Infinity,
        repeatDelay: 1.2,
        times: [0, 0.86, 0.9, 0.94, 1],
        ease: "easeInOut" as const,
      };

  const waveAnimate = shouldReduceMotion ? { rotate: -14 } : { rotate: [0, -24, -4, -24, 0] };
  const waveTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 1.9, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" as const };

  const antennaAnimate = shouldReduceMotion
    ? { opacity: 0.9, scale: 1 }
    : { opacity: [0.65, 1, 0.65], scale: [1, 1.2, 1] };
  const antennaTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const };

  const lightTransition = (delay: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { duration: 1.8, repeat: Infinity, ease: "easeInOut" as const, delay };
  const lightAnimate = shouldReduceMotion ? { opacity: 0.9 } : { opacity: [0.35, 1, 0.35] };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 360"
      className={cn("select-none", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="robot-antenna-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4B942" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F4B942" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow — shrinks as the mascot rises for a grounded float effect */}
      <motion.ellipse
        cx="150"
        cy="345"
        rx="62"
        ry="11"
        fill="#020817"
        animate={shadowAnimate}
        transition={floatTransition}
        style={{ transformOrigin: "150px 345px" }}
      />

      <motion.g animate={floatAnimate} transition={floatTransition}>
        {/* Antenna */}
        <line x1="150" y1="70" x2="150" y2="40" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <motion.circle
          cx="150"
          cy="34"
          r="17"
          fill="url(#robot-antenna-glow)"
          animate={antennaAnimate}
          transition={antennaTransition}
          style={{ transformOrigin: "150px 34px" }}
        />
        <motion.circle
          cx="150"
          cy="34"
          r="7"
          fill="#F4B942"
          animate={antennaAnimate}
          transition={antennaTransition}
          style={{ transformOrigin: "150px 34px" }}
        />

        {/* Left resting arm */}
        <path
          d="M97 196 Q80 222 91 252"
          stroke="#0F172A"
          strokeOpacity="0.85"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="91" cy="252" r="10" fill="#F4B942" />

        {/* Body */}
        <rect x="95" y="180" width="110" height="128" rx="32" fill="#F8FAFC" stroke="#0F172A" strokeOpacity="0.12" strokeWidth="2" />
        <rect x="118" y="204" width="64" height="46" rx="14" fill="#0F172A" fillOpacity="0.08" />
        <motion.circle cx="134" cy="227" r="4.5" fill="#F4B942" animate={lightAnimate} transition={lightTransition(0)} />
        <motion.circle cx="150" cy="227" r="4.5" fill="#38BDF8" animate={lightAnimate} transition={lightTransition(0.4)} />
        <motion.circle cx="166" cy="227" r="4.5" fill="#F8FAFC" animate={lightAnimate} transition={lightTransition(0.8)} />

        {/* Neck */}
        <rect x="138" y="158" width="24" height="24" fill="#F8FAFC" stroke="#0F172A" strokeOpacity="0.12" strokeWidth="2" />

        {/* Head */}
        <rect x="100" y="70" width="100" height="94" rx="30" fill="#F8FAFC" stroke="#0F172A" strokeOpacity="0.12" strokeWidth="2" />

        {/* Eyes (blink together) */}
        <motion.g animate={blinkAnimate} transition={blinkTransition} style={{ transformOrigin: "150px 112px" }}>
          <circle cx="128" cy="112" r="9" fill="#0F172A" />
          <circle cx="172" cy="112" r="9" fill="#0F172A" />
        </motion.g>

        {/* Smile */}
        <path d="M131 137 Q150 150 169 137" stroke="#0F172A" strokeOpacity="0.75" strokeWidth="4.5" strokeLinecap="round" fill="none" />

        {/* Right waving arm, pivoted at the shoulder */}
        <g transform="translate(203,196)">
          <motion.g animate={waveAnimate} transition={waveTransition} style={{ transformOrigin: "0px 0px" }}>
            <path d="M0 0 L38 -50" stroke="#0F172A" strokeOpacity="0.85" strokeWidth="14" strokeLinecap="round" />
            <circle cx="38" cy="-50" r="11" fill="#F4B942" />
          </motion.g>
        </g>
      </motion.g>
    </svg>
  );
}

export { RobotMascot };
