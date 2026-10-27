"use client";

import { useTranslations } from "next-intl";
import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";
import PageHeader from "@/features/tasks/components/PageHeader";
import {
  useTasks,
  useDoneToday,
  toggleTask,
} from "@/features/tasks/hooks/useTasks";

export default function BacklogPage() {
  const t = useTranslations("tasks.page");

  const tasks = useTasks("backlog") ?? [];
  const doneToday = useDoneToday("backlog");

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title={t("backlog")} />

      <TaskAccordion
        group="backlog"
        tasks={tasks}
        addToGroup="backlog"
        doneToday={doneToday}
        onToggleTask={toggleTask}
      />
    </div>
  );
}
