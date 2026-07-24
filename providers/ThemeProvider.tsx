"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * Wraps next-themes so the rest of the app never imports it directly.
 * Keeps light / dark / system theme logic in one place.
 */
export function ThemeProvider({ children, ...props }: Readonly<ThemeProviderProps>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
