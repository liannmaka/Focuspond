"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { moodIdForLevel } from "@/features/mood/constants/moods";
import { useTodayMood } from "@/features/mood/hooks/useMood";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { energyFits, energyTagKey } from "@/features/tasks/lib/taskDisplay";

/**
 * Today's energy, and how much of today's work actually suits it.
 *
 * The "fits" count is the quiet payoff of the whole mood feature: it turns a
 * check-in from a diary entry into a statement about the day ahead.
 */
export default function EnergyOverview() {
  const t = useTranslations("tasks.energyPanel");
  // energyTagKey() returns keys rooted at `tasks`, not at the panel.
  const tTasks = useTranslations("tasks");
  const tMood = useTranslations("mood");
  const mood = useTodayMood();
  const tasks = useTasks("today") ?? [];

  // Still resolving the first query — render nothing rather than flash "no mood".
  if (mood === undefined && tasks.length === 0) return null;

  if (!mood) {
    return (
      <section className="px-6">
        <h3 className="mb-2 font-sora text-[10.5px] font-bold tracking-[0.1em] text-ink-subtle uppercase">
          {t("heading")}
        </h3>
        <p className="mb-2 text-sm text-ink-muted">{t("noMood")}</p>
        <Link
          href="/mood"
          className="font-sora text-xs font-semibold text-accent-text hover:underline"
        >
          {t("checkIn")}
        </Link>
      </section>
    );
  }

  const moodId = moodIdForLevel(mood.level);
  const fitting = tasks.filter((task) =>
    energyFits(task.energyRequired, mood.energyLevel)
  ).length;

  return (
    <section className="px-6">
      <h3 className="mb-2 font-sora text-[10.5px] font-bold tracking-[0.1em] text-ink-subtle uppercase">
        {t("heading")}
      </h3>

      <p className="font-sora text-sm font-semibold text-ink">
        {moodId ? tMood(`moods.${moodId}.label`) : mood.label}
        <span className="ml-2 font-manrope text-xs font-normal text-ink-subtle">
          {tTasks(energyTagKey(mood.energyLevel))}
        </span>
      </p>

      <p className="mt-1 text-sm text-ink-muted">
        {tasks.length === 0
          ? t("noTasks")
          : t("fits", { count: fitting, total: tasks.length })}
      </p>
    </section>
  );
}
