"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

interface RobotMascotProps {
  readonly className?: string;
}

export function RobotMascot({ className }: RobotMascotProps) {
  const shouldReduceMotion = useReducedMotion();

  // --- Interactive Cursor Tracking (Global) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out mouse movements with a spring for natural momentum
  const springConfig = { stiffness: 100, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Constrained head movement so it stays naturally attached to the neck
  const headX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const headY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const headRotate = useTransform(smoothX, [-1, 1], [-5, 5]);

  // Constrained eye movement — max 10px travel ensures they never leave the navy screen
  const eyeX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const eyeY = useTransform(smoothY, [-1, 1], [-6, 6]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleWindowMouseMove = (event: MouseEvent) => {
      // Calculate cursor position as a normalized value between -1 and 1
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth) * 2 - 1;
      const y = (event.clientY / innerHeight) * 2 - 1;

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, [mouseX, mouseY, shouldReduceMotion]);

  // --- Animation Variants & Sequences ---

  // Organic, multi-axis floating sequence (balanced travel)
  const floatAnimate = shouldReduceMotion
    ? { y: 0, x: 0, rotate: 0 }
    : {
        y: [0, -16, -4, -16, 0],
        x: [0, 4, -4, 2, 0],
        rotate: [0, 1.5, -1.5, 1, 0],
      };
  const floatTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 5.5, repeat: Infinity, ease: "easeInOut" as const };

  const shadowAnimate = shouldReduceMotion
    ? { scale: 1, opacity: 0.3 }
    : {
        scale: [1, 0.8, 0.92, 0.8, 1],
        opacity: [0.35, 0.18, 0.28, 0.18, 0.35],
      };

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

  // Friendly bounce for the wave
  const waveAnimate = shouldReduceMotion
    ? { y: -3 }
    : { y: [0, -14, -2, -14, 0] };
  const waveTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 1.6,
        repeat: Infinity,
        repeatDelay: 1.2,
        ease: "easeInOut" as const,
      };

  const antennaAnimate = shouldReduceMotion
    ? { opacity: 0.9, scale: 1 }
    : { opacity: [0.65, 1, 0.65], scale: [1, 1.25, 1] };
  const antennaTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const };

  const dotTransition = (delay: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { duration: 1.4, repeat: Infinity, ease: "easeInOut" as const, delay };
  const dotAnimate = shouldReduceMotion
    ? { opacity: 0.9 }
    : { opacity: [0.3, 1, 0.3], y: [0, -2.5, 0] };

  const SCREEN = "#0F172A";
  const EYE = "#E2E8F0";
  const BODY = "#D5A844";
  const BODY_SHADE = "#AD832D";
  const HIGHLIGHT = "#E5C477";

  const ANTENNA_STEM = "stroke-[#0F172A]/30 dark:stroke-white/40";

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 280 300"
      className={cn("select-none cursor-pointer", className)}
      xmlns="http://www.w3.org/2000/svg"
      // Pleasant pop on hover without being too aggressive
      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <defs>
        <radialGradient id="robot-antenna-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={BODY} stopOpacity="0.55" />
          <stop offset="100%" stopColor={BODY} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <motion.ellipse
        cx="140"
        cy="286"
        rx="56"
        ry="9"
        fill="#020817"
        animate={shadowAnimate}
        transition={floatTransition}
        style={{ transformOrigin: "140px 286px" }}
      />

      {/* Main floating body container */}
      <motion.g animate={floatAnimate} transition={floatTransition}>
        {/* Left resting shoulder nub */}
        <circle cx="85" cy="196" r="12" fill={BODY_SHADE} />

        {/* Body Base */}
        <rect x="90" y="170" width="100" height="100" rx="30" fill={BODY} />
        <ellipse
          cx="120"
          cy="184"
          rx="22"
          ry="8"
          fill={HIGHLIGHT}
          opacity="0.35"
        />

        {/* Chest screen with animated typing indicator */}
        <rect x="110" y="196" width="60" height="30" rx="10" fill={SCREEN} />
        <motion.circle
          cx="128"
          cy="211"
          r="3.2"
          fill={EYE}
          animate={dotAnimate}
          transition={dotTransition(0)}
        />
        <motion.circle
          cx="140"
          cy="211"
          r="3.2"
          fill={EYE}
          animate={dotAnimate}
          transition={dotTransition(0.2)}
        />
        <motion.circle
          cx="152"
          cy="211"
          r="3.2"
          fill={EYE}
          animate={dotAnimate}
          transition={dotTransition(0.4)}
        />

        {/* Neck */}
        <rect x="128" y="150" width="24" height="22" rx="8" fill={BODY} />

        {/* Interactive Right Arm / Shoulder Waving Nub */}
        <motion.circle
          cx="195"
          cy="196"
          r="12"
          fill={BODY_SHADE}
          animate={waveAnimate}
          transition={waveTransition}
        />

        {/* --- Interactive Head & Antenna Assembly --- */}
        <motion.g
          style={{
            x: headX,
            y: headY,
            rotate: headRotate,
            transformOrigin: "140px 140px",
          }}
        >
          {/* Antenna Stem */}
          <line
            x1="140"
            y1="76"
            x2="140"
            y2="50"
            className={ANTENNA_STEM}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Antenna Light & Glow */}
          <motion.circle
            cx="140"
            cy="44"
            r="15"
            fill="url(#robot-antenna-glow)"
            animate={antennaAnimate}
            transition={antennaTransition}
            style={{ transformOrigin: "140px 44px" }}
          />
          <motion.circle
            cx="140"
            cy="44"
            r="6"
            fill={BODY}
            animate={antennaAnimate}
            transition={antennaTransition}
            style={{ transformOrigin: "140px 44px" }}
          />

          {/* Head Base */}
          <rect x="85" y="76" width="110" height="86" rx="28" fill={BODY} />
          <ellipse
            cx="115"
            cy="90"
            rx="26"
            ry="8"
            fill={HIGHLIGHT}
            opacity="0.35"
          />

          {/* Face Screen */}
          <rect x="101" y="92" width="78" height="56" rx="18" fill={SCREEN} />

          {/* Eyes & Smile — Tightly constrained so they never clip out of the screen */}
          <motion.g style={{ x: eyeX, y: eyeY }}>
            {/* Eyes (blink sequence) */}
            <motion.g
              animate={blinkAnimate}
              transition={blinkTransition}
              style={{ transformOrigin: "140px 119px" }}
            >
              <rect x="114" y="110" width="14" height="18" rx="7" fill={EYE} />
              <rect x="152" y="110" width="14" height="18" rx="7" fill={EYE} />
            </motion.g>

            {/* Smile */}
            <path
              d="M120 138 Q140 148 160 138"
              stroke={EYE}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}
