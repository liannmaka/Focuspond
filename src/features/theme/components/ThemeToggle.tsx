"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, Monitor, Moon, Sun } from "lucide-react";

type ThemeOption = "light" | "dark" | "system";

const OPTIONS: { value: ThemeOption; Icon: typeof Sun }[] = [
  { value: "light", Icon: Sun },
  { value: "dark", Icon: Moon },
  { value: "system", Icon: Monitor },
];

type ThemeToggleProps = {
  /** Vertical direction the menu opens. Defaults to "down". */
  align?: "up" | "down";
  className?: string;
};

/**
 * Light / dark / system picker. Deliberately shaped like the Vibe Switcher
 * (`src/features/i18n/components/LanguageSwitcher.tsx`) so the two controls
 * read as a pair wherever they sit together.
 */
export default function ThemeToggle({
  align = "down",
  className,
}: ThemeToggleProps) {
  const t = useTranslations("common.theme");
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // The server has no way to know the stored theme, so the trigger icon can
  // only be resolved after hydration.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const TriggerIcon = !mounted || resolvedTheme !== "dark" ? Sun : Moon;

  return (
    <div
      ref={containerRef}
      className={clsx("relative font-sora", className)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("choosePrompt")}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface-raised px-3 py-1.5 text-sm text-ink transition-colors hover:border-accent/50 hover:text-accent-text"
      >
        <TriggerIcon className="size-4" />
        <ChevronDown
          className={clsx(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <ul
        role="listbox"
        aria-label={t("label")}
        className={clsx(
          "absolute right-0 z-50 min-w-52 origin-top rounded-xl border border-line bg-surface-raised p-1.5 shadow-e3 transition-all duration-150",
          align === "up" ? "bottom-full mb-2" : "top-full mt-2",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <li className="px-2.5 pt-1 pb-1.5 text-[11px] font-medium tracking-wide text-ink-subtle uppercase">
          {t("choosePrompt")}
        </li>
        {OPTIONS.map(({ value, Icon }) => {
          const isActive = mounted && theme === value;
          return (
            <li key={value}>
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  isActive
                    ? "bg-accent-soft text-accent-text"
                    : "text-ink hover:bg-ambient-soft"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex flex-col">
                  <span className="font-medium">{t(`${value}.label`)}</span>
                  <span className="text-xs text-ink-subtle">
                    {t(`${value}.hint`)}
                  </span>
                </span>
                {isActive && <Check className="ml-auto size-4 shrink-0" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
