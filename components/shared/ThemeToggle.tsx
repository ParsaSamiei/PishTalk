"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/lib/i18n/client";

/**
 * Toggles between light and dark theme. Renders a stable placeholder until
 * mounted so the icon never mismatches between server and client render.
 */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const d = useDictionary();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount detection to avoid SSR/client theme mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="size-11" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isDark ? d.theme.toLight : d.theme.toDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}

export { ThemeToggle };
