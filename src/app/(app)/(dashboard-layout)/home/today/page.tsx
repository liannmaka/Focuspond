"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";
import FrogOfTheDay from "@/features/tasks/components/FrogOfTheDay";
import PageHeader from "@/features/tasks/components/PageHeader";
import { useTodayEnergy } from "@/features/mood/hooks/useMood";
import {
  useTasks,
  useGroupProgress,
  toggleTask,
} from "@/features/tasks/hooks/useTasks";
import { energyFits, suggestFrog } from "@/features/tasks/lib/taskDisplay";
import type { Frog } from "@/features/tasks/types/task";

export default function TodayPage() {
  const t = useTranslations("tasks.page");
  const router = useRouter();

  const tasks = useTasks("today") ?? [];
  const progress = useGroupProgress("today");
  const energy = useTodayEnergy();

  const suggested = suggestFrog(tasks, energy);

  /**
   * `energyMatch` stays undefined until a mood exists — FrogOfTheDay hides the
   * verdict row rather than claiming a task suits a day we know nothing about.
   */
  const frog: Frog | null = suggested
    ? {
        ...suggested,
        energyMatch: energy
          ? energyFits(suggested.energyRequired, energy)
          : undefined,
      }
    : null;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title={t("today")}
        done={progress?.done}
        total={progress?.total}
      />

      <FrogOfTheDay
        frog={frog}
        onStart={() => frog?.id && router.push(`/home/timer/${frog.id}`)}
      />

      <div className="mt-10">
        <TaskAccordion
          group="today"
          tasks={tasks}
          addToGroup="today"
          progress={progress}
          onToggleTask={toggleTask}
        />
      </div>
    </div>
  );
}
