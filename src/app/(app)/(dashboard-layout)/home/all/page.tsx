"use client";

import { useTranslations } from "next-intl";
import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";
import PageHeader from "@/features/tasks/components/PageHeader";
import type { Task } from "@/features/tasks/types/task";

export default function AllPage() {
  const t = useTranslations("tasks.page");

  // See TodayPage — no task store yet, so every group renders empty.
  const tasks: Task[] = [];

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title={t("all")} />

      <div className="space-y-8">
        <TaskAccordion
          group="today"
          tasks={tasks}
        />
        <TaskAccordion
          group="week"
          tasks={tasks}
          defaultOpen={false}
        />
        <TaskAccordion
          group="backlog"
          tasks={tasks}
          defaultOpen={false}
        />
      </div>
    </div>
  );
}
