"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  type LucideProps,
} from "lucide-react";

import { useOptionalLocale } from "@/lib/i18n/client";

/**
 * Arrows and chevrons that mean "forward" or "back" have to flip with the
 * writing direction: in Persian (RTL) forward points left, in English (LTR)
 * it points right. The codebase previously hardcoded the RTL choice, which
 * pointed every arrow backwards once English was added.
 *
 * These wrappers take the *semantic* direction and pick the glyph, so call
 * sites never mention left or right.
 */

type IconProps = Omit<LucideProps, "ref">;

/** Arrow meaning "forward" / "next" / "continue". */
export function ForwardArrow(props: IconProps) {
  const { dir } = useOptionalLocale();
  const Icon = dir === "rtl" ? ArrowLeft : ArrowRight;
  return <Icon {...props} />;
}

/** Arrow meaning "back" / "previous". */
export function BackArrow(props: IconProps) {
  const { dir } = useOptionalLocale();
  const Icon = dir === "rtl" ? ArrowRight : ArrowLeft;
  return <Icon {...props} />;
}

/** Chevron meaning "forward" / "next". */
export function ForwardChevron(props: IconProps) {
  const { dir } = useOptionalLocale();
  const Icon = dir === "rtl" ? ChevronLeft : ChevronRight;
  return <Icon {...props} />;
}

/** Chevron meaning "back" / "previous". */
export function BackChevron(props: IconProps) {
  const { dir } = useOptionalLocale();
  const Icon = dir === "rtl" ? ChevronRight : ChevronLeft;
  return <Icon {...props} />;
}
