"use client";

import { useTranslations } from "next-intl";
import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";
import FrogOfTheDay from "@/features/tasks/components/FrogOfTheDay";
import PageHeader from "@/features/tasks/components/PageHeader";
import { useTasks, toggleTask } from "@/features/tasks/hooks/useTasks";

export default function TodayPage() {
  const t = useTranslations("tasks.page");

  const tasks = useTasks("today") ?? [];
  const done = tasks.filter((task) => task.completed).length;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title={t("today")}
        done={done}
        total={tasks.length}
      />

      {/*
        Still null: choosing a frog needs today's mood to compute the energy
        verdict, which lands with `useTodayEnergy()` in M2. The card renders its
        "Pick your frog" empty state until then.
      */}
      <FrogOfTheDay frog={null} />

      <div className="mt-10">
        <TaskAccordion
          group="today"
          tasks={tasks}
          addToGroup="today"
          onToggleTask={toggleTask}
        />
      </div>
    </div>
  );
}
