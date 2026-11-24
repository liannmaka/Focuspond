"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { moodIdForLevel } from "@/features/mood/constants/moods";
import { useTodayEnergyState } from "@/features/mood/hooks/useMood";
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
  const energy = useTodayEnergyState();
  const tasks = useTasks("today");

  /*
    Nothing until both answers are in. The old guard checked
    `mood === undefined && tasks.length === 0`, which could not tell a mood
    still loading from a day with no check-in, and counted "0 of 0 tasks suit
    your energy" while the task list was still on its way.
  */
  if (energy.status === "loading" || tasks === undefined) return null;

  if (energy.status === "unknown") {
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

  const { mood } = energy;
  const moodId = moodIdForLevel(mood.level);
  const fitting = tasks.filter((task) =>
    energyFits(task.energyRequired, energy.energy)
  ).length;

  return (
    <section className="px-6">
      <h3 className="mb-2 font-sora text-[10.5px] font-bold tracking-[0.1em] text-ink-subtle uppercase">
        {t("heading")}
      </h3>

      <p className="font-sora text-sm font-semibold text-ink">
        {moodId ? tMood(`moods.${moodId}.label`) : mood.label}
        <span className="ml-2 font-manrope text-xs font-normal text-ink-subtle">
          {tTasks(energyTagKey(energy.energy))}
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
