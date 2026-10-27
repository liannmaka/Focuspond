"use client";

import { useTranslations } from "next-intl";
import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";
import PageHeader from "@/features/tasks/components/PageHeader";
import {
  useTasks,
  useDoneToday,
  toggleTask,
} from "@/features/tasks/hooks/useTasks";

export default function WeekPage() {
  const t = useTranslations("tasks.page");

  const tasks = useTasks("week") ?? [];
  const doneToday = useDoneToday("week");

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title={t("week")} />

      <TaskAccordion
        group="week"
        tasks={tasks}
        addToGroup="week"
        doneToday={doneToday}
        onToggleTask={toggleTask}
      />
    </div>
  );
}
