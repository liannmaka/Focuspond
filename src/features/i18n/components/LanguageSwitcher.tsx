"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES, type Locale } from "@/i18n/config";
import { setLocaleCookie } from "../lib/locale-cookie";

type LanguageSwitcherProps = {
  /** Vertical direction the menu opens. Defaults to "down". */
  align?: "up" | "down";
  /**
   * Square icon-button trigger for the 56px side rail: no label, no chevron,
   * and the menu flies out to the right rather than hanging below — a
   * right-aligned menu opened from a 56px column runs off the screen.
   *
   * Shows the locale code rather than a bare globe, so the current language is
   * legible without opening anything.
   */
  compact?: boolean;
  className?: string;
};

/**
 * The "Vibe Switcher": lets the reader pick the language/tone FocusPond speaks
 * in. Writes the locale cookie and refreshes so server components re-render with
 * the new messages.
 */
export default function LanguageSwitcher({
  align = "down",
  compact = false,
  className,
}: LanguageSwitcherProps) {
  const t = useTranslations("common.language");
  const activeLocale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const active =
    SUPPORTED_LANGUAGES.find((l) => l.code === activeLocale) ??
    SUPPORTED_LANGUAGES[0];

  // Close on outside click / Escape.
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

  const selectLocale = (locale: Locale) => {
    setOpen(false);
    if (locale === activeLocale) return;
    setLocaleCookie(locale);
    startTransition(() => router.refresh());
  };

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
        disabled={isPending}
        className={clsx(
          "cursor-pointer text-ink transition-colors",
          compact
            ? "flex size-10 items-center justify-center rounded-lg text-ink-muted hover:bg-ambient-soft hover:text-ink"
            : "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-raised px-3 py-1.5 text-sm hover:border-accent/50 hover:text-accent-text",
          isPending && "opacity-70"
        )}
      >
        {compact ? (
          <span className="font-sora text-[11px] font-bold tracking-wide uppercase">
            {active.code}
          </span>
        ) : (
          <>
            <Globe className="size-4" />
            <span className="font-medium">{active.nativeName}</span>
            <ChevronDown
              className={clsx(
                "size-3.5 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </>
        )}
      </button>

      <ul
        role="listbox"
        aria-label={t("label")}
        className={clsx(
          "absolute z-50 min-w-52 rounded-xl border border-line bg-surface-raised p-1.5 shadow-e3 transition-all duration-150",
          compact
            ? "bottom-0 left-full ml-2 origin-bottom-left"
            : clsx(
                "right-0 origin-top",
                align === "up" ? "bottom-full mb-2" : "top-full mt-2"
              ),
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <li className="px-2.5 pt-1 pb-1.5 text-[11px] font-medium tracking-wide text-ink-subtle uppercase">
          {t("choosePrompt")}
        </li>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = lang.code === activeLocale;
          return (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => selectLocale(lang.code)}
                className={clsx(
                  "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  isActive
                    ? "bg-accent-soft text-accent-text"
                    : "text-ink hover:bg-ambient-soft"
                )}
              >
                <span className="flex flex-col">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-ink-subtle">
                    {lang.name}
                    {lang.vibeLabel ? ` · ${lang.vibeLabel}` : ""}
                  </span>
                </span>
                {isActive && <Check className="size-4 shrink-0" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
