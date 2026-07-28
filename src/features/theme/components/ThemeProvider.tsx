"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Puts `.dark` on <html> so the token layer in globals.css can switch.
 *
 * next-themes injects a blocking script that reads localStorage before first
 * paint, which is what prevents a flash of the wrong theme — that only works
 * if <html> carries `suppressHydrationWarning` (see src/app/layout.tsx).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
