"use client";

import { useTranslations } from "next-intl";
import { Flame, Timer } from "lucide-react";

import PageHeader from "@/features/tasks/components/PageHeader";
import ReflectionField from "@/features/progress/components/ReflectionField";
import { useProgress } from "@/features/progress/hooks/useProgress";

/**
 * `/analytics` — the Progress page.
 *
 * It was `<h1>Analytics</h1>`, linked from the side rail: a visible control
 * that went nowhere, which is the same defect as the Bell and Search buttons
 * deleted from the top bar, only quieter because an empty page does not look
 * broken.
 *
 * It is **Progress, not analytics**. Nothing was ever promised called
 * "analytics" — the copy says "see your streaks and completed Frogs", twice —
 * and the dashboard that word implies would have been some twenty hours of
 * charts nobody asked for. The route keeps its name because renaming it is a
 * redirect and a nav change for no reader's benefit.
 *
 * Every number here is derived from stored rows on each render. Nothing
 * accumulates a count, so nothing can drift out of step with what happened.
 */
export default function ProgressPage() {
  const t = useTranslations("progress");
  const progress = useProgress();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title={t("title")} />

      <div className="grid gap-4 sm:grid-cols-2">
        {/* The streak, given the weight it is promised with. */}
        <section className="relative overflow-hidden rounded-xl border border-line bg-surface-raised p-6 shadow-e2 sm:col-span-2">
          <div
            className="ripple-field pointer-events-none absolute inset-0"
            aria-hidden
          />
          <div className="relative">
            <p className="mb-3 flex items-center gap-2 font-sora text-[10px] font-bold tracking-[0.13em] text-accent-text uppercase">
              <span
                className="h-px w-3.5 bg-accent-text"
                aria-hidden
              />
              {t("streak.label")}
            </p>

            <p className="font-sora text-4xl leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums md:text-5xl">
              {progress ? (
                t("streak.count", { count: progress.streak })
              ) : (
                <span
                  className="inline-block h-8 w-40 animate-pulse rounded bg-ambient-soft align-middle"
                  aria-hidden
                />
              )}
            </p>

            {/*
              The number never has to be read as a warning: an unspent day says
              so in words. A streak that holds until midnight is the rule
              (`currentStreak`), and this is where the reader is told.
            */}
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-ink-muted">
              {!progress
                ? ""
                : progress.streak === 0
                  ? t("streak.none")
                  : progress.today
                    ? t("streak.counted")
                    : t("streak.open")}
            </p>
          </div>
        </section>

        <Stat
          icon={
            <Flame
              className="size-3.5"
              aria-hidden
            />
          }
          label={t("frogs.label")}
          caption={t("frogs.week")}
          value={progress?.frogsThisWeek}
          note={
            progress ? t("frogs.allTime", { count: progress.frogsAllTime }) : ""
          }
        />

        <Stat
          icon={
            <Timer
              className="size-3.5"
              aria-hidden
            />
          }
          label={t("blocks.label")}
          value={progress?.blocksToday}
          note={progress && progress.blocksToday === 0 ? t("blocks.none") : ""}
        />
      </div>

      <div className="mt-4">
        <ReflectionField />
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  caption,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  caption?: string;
  /** `undefined` while the query resolves — rendered as a dash, not a zero. */
  value: number | undefined;
  note?: string;
}) {
  return (
    <section className="rounded-xl border border-line bg-surface-raised p-5 md:p-6">
      <p className="flex items-center gap-2 font-sora text-[10px] font-bold tracking-[0.1em] text-ink-subtle uppercase">
        {icon}
        {label}
      </p>

      <p className="mt-2 font-sora text-3xl leading-none font-semibold tracking-[-0.02em] text-ink tabular-nums">
        {value ?? (
          <span
            className="inline-block h-6 w-12 animate-pulse rounded bg-ambient-soft align-middle"
            aria-hidden
          />
        )}
      </p>

      {caption && <p className="mt-1.5 text-xs text-ink-subtle">{caption}</p>}
      {note && <p className="mt-2 text-sm text-ink-muted">{note}</p>}
    </section>
  );
}
