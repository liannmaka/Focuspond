"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

/**
 * sonner renders its own surface outside our token layer, so it has to be told
 * the theme explicitly — otherwise toasts stay light while the app goes dark.
 */
export function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-center"
      closeButton
      richColors
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
