"use client";

import { useTranslations } from "next-intl";
import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";
import PageHeader from "@/features/tasks/components/PageHeader";
import type { Task } from "@/features/tasks/types/task";

export default function WeekPage() {
  const t = useTranslations("tasks.page");

  // See TodayPage — no task store yet.
  const tasks: Task[] = [];

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title={t("week")} />

      <TaskAccordion
        group="week"
        tasks={tasks}
      />
    </div>
  );
}
