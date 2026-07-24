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
  className?: string;
};

/**
 * The "Vibe Switcher": lets the reader pick the language/tone FocusPond speaks
 * in. Writes the locale cookie and refreshes so server components re-render with
 * the new messages.
 */
export default function LanguageSwitcher({
  align = "down",
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
          "inline-flex items-center gap-1.5 rounded-full border border-dark-accent/20 bg-white/80 px-3 py-1.5 text-sm text-dark-accent transition-colors hover:border-accent-button/50 hover:text-accent-button focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-button/40 cursor-pointer",
          isPending && "opacity-70"
        )}
      >
        <Globe className="size-4" />
        <span className="font-medium">{active.nativeName}</span>
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
          "absolute right-0 z-50 min-w-52 rounded-xl border border-dark-accent/10 bg-white p-1.5 shadow-lg transition-all duration-150 origin-top",
          align === "up" ? "bottom-full mb-2" : "top-full mt-2",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <li className="px-2.5 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-wide text-dark-accent/50">
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
                  "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors cursor-pointer",
                  isActive
                    ? "bg-accent-button/10 text-accent-button"
                    : "text-dark-accent hover:bg-secondary-accent/10"
                )}
              >
                <span className="flex flex-col">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-dark-accent/50">
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
