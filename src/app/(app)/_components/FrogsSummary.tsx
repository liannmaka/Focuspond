"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Flame } from "lucide-react";

import { useProgress } from "@/features/progress/hooks/useProgress";

/**
 * The streak, in the dashboard panel — a glance, not a page.
 *
 * It was `<div>Hello Frogs</div>` and commented out of `DashboardPanel`, which
 * was the right call while it said nothing. It earns its row now that there is
 * something true to put in it.
 *
 * Deliberately only two numbers and a link. The panel sits beside the task
 * list all day; anything more than a glance belongs on the Progress page, and
 * repeating the whole page here would be two places to keep in step.
 */
export default function FrogsSummary() {
  const t = useTranslations("progress");
  const progress = useProgress();

  return (
    <div className="px-6">
      <p className="mb-2.5 font-sora text-[10.5px] font-bold tracking-[0.1em] text-ink-subtle uppercase">
        {t("title")}
      </p>

      <Link
        href="/analytics"
        className="block rounded-lg border border-line bg-surface-raised px-3.5 py-3 transition-colors hover:bg-ambient-soft"
      >
        <p className="flex items-center gap-2 font-sora text-sm font-semibold text-ink">
          <Flame
            className="size-3.5 shrink-0 text-accent-text"
            aria-hidden
          />
          {progress ? (
            t("streak.count", { count: progress.streak })
          ) : (
            <span
              className="inline-block h-3.5 w-20 animate-pulse rounded bg-ambient-soft align-middle"
              aria-hidden
            />
          )}
        </p>

        <p className="mt-1 text-xs text-ink-subtle">
          {progress
            ? `${t("frogs.label")} · ${progress.frogsThisWeek}`
            : t("frogs.label")}
        </p>
      </Link>
    </div>
  );
}
