"use client";

import { useTranslations } from "next-intl";
import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";
import FrogOfTheDay from "@/features/tasks/components/FrogOfTheDay";
import PageHeader from "@/features/tasks/components/PageHeader";
import type { Task } from "@/features/tasks/types/task";

export default function TodayPage() {
  const t = useTranslations("tasks.page");

  // No task store yet (src/features/tasks/store/taskStore.ts is unwritten), so
  // both surfaces render their empty states — which is what a new reader sees
  // on day one anyway.
  const tasks: Task[] = [];
  const done = tasks.filter((task) => task.completed).length;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title={t("today")}
        done={done}
        total={tasks.length}
      />

      <FrogOfTheDay frog={null} />

      <div className="mt-10">
        <TaskAccordion
          group="other"
          tasks={tasks}
        />
      </div>
    </div>
  );
}
