"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";
import FrogOfTheDay from "@/features/tasks/components/FrogOfTheDay";
import FrogPicker from "@/features/tasks/components/FrogPicker";
import PageHeader from "@/features/tasks/components/PageHeader";
import { useTodayEnergy } from "@/features/mood/hooks/useMood";
import { useRunningSession } from "@/features/pomodoro/hooks/useRunningSession";
import {
  useTasks,
  useDoneToday,
  toggleTask,
  setFrog,
} from "@/features/tasks/hooks/useTasks";
import { energyFits, frogState } from "@/features/tasks/lib/taskDisplay";
import type { FrogState } from "@/features/tasks/lib/taskDisplay";
import type { Frog } from "@/features/tasks/types/task";

export default function TodayPage() {
  const t = useTranslations("tasks.page");
  const router = useRouter();
  const [picking, setPicking] = useState(false);

  // Both shapes, deliberately: the frog logic needs an array to rank, while
  // the list needs to know the difference between "loading" and "empty".
  const todayTasks = useTasks("today");
  const tasks = todayTasks ?? [];
  const doneToday = useDoneToday("today");
  const energy = useTodayEnergy();
  const session = useRunningSession();

  const state = frogState(tasks, doneToday ?? [], energy);

  /**
   * `energyMatch` stays undefined until a mood exists — FrogOfTheDay hides the
   * verdict row rather than claiming a task suits a day we know nothing about.
   */
  const cardState: FrogState<Frog> =
    state.kind === "none"
      ? state
      : {
          ...state,
          frog: {
            ...state.frog,
            energyMatch: energy
              ? energyFits(state.frog.energyRequired, energy)
              : undefined,
          },
        };

  const frogId = state.kind === "none" ? undefined : state.frog.id;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title={t("today")} />

      {/* Both entry points open the same picker — "Choose your frog" from the
          empty card and "Pick another" from a card that already has one are the
          same question asked twice. */}
      <FrogOfTheDay
        state={cardState}
        // The card reads both lists, so it is only honest once both have
        // answered — otherwise it asks you to pick a frog you already have.
        loading={todayTasks === undefined || doneToday === undefined}
        // Only when the running session is this frog's: a session on another
        // task is that task's business, and the card saying "Resume" would
        // send the reader somewhere they did not mean to go.
        runningTime={
          session?.kind === "focus" && session.taskId === frogId
            ? session.display
            : undefined
        }
        onStart={() => frogId && router.push(`/home/timer/${frogId}`)}
        onAccept={() => frogId && setFrog(frogId)}
        onChoose={() => setPicking(true)}
        onSwap={() => setPicking(true)}
      />

      <FrogPicker
        open={picking}
        tasks={tasks}
        energy={energy}
        onClose={() => setPicking(false)}
      />

      <div className="mt-10">
        <TaskAccordion
          group="today"
          tasks={todayTasks}
          addToGroup="today"
          doneToday={doneToday}
          onToggleTask={toggleTask}
        />
      </div>
    </div>
  );
}
