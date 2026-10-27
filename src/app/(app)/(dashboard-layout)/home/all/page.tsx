"use client";

import { useTranslations } from "next-intl";
import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";
import PageHeader from "@/features/tasks/components/PageHeader";
import {
  useTasks,
  useDoneToday,
  toggleTask,
} from "@/features/tasks/hooks/useTasks";

export default function AllPage() {
  const t = useTranslations("tasks.page");

  // Three live queries, one per horizon. Each re-runs on any write to the
  // tasks table — including writes from another tab.
  const today = useTasks("today");
  const week = useTasks("week");
  const backlog = useTasks("backlog");

  const todayDone = useDoneToday("today");
  const weekDone = useDoneToday("week");
  const backlogDone = useDoneToday("backlog");

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title={t("all")} />

      <div className="space-y-8">
        <TaskAccordion
          group="today"
          tasks={today ?? []}
          addToGroup="today"
          doneToday={todayDone}
          onToggleTask={toggleTask}
        />
        <TaskAccordion
          group="week"
          tasks={week ?? []}
          addToGroup="week"
          doneToday={weekDone}
          defaultOpen={false}
          onToggleTask={toggleTask}
        />
        <TaskAccordion
          group="backlog"
          tasks={backlog ?? []}
          addToGroup="backlog"
          doneToday={backlogDone}
          defaultOpen={false}
          onToggleTask={toggleTask}
        />
      </div>
    </div>
  );
}
