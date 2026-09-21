"use client";

import { useTranslations } from "next-intl";
import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";
import PageHeader from "@/features/tasks/components/PageHeader";
import { useCompletedTasks, toggleTask } from "@/features/tasks/hooks/useTasks";

export default function CompletedPage() {
  const t = useTranslations("tasks.page");

  const tasks = useCompletedTasks() ?? [];

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title={t("completed")} />

      {/*
        No `addToGroup` — you finish a task rather than create a finished one,
        so this list has no add affordance. Unchecking is still allowed, which
        moves the task back into its original group.
      */}
      <TaskAccordion
        group="completed"
        tasks={tasks}
        onToggleTask={toggleTask}
      />
    </div>
  );
}
