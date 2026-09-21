"use client";

import { useTranslations } from "next-intl";
import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";
import PageHeader from "@/features/tasks/components/PageHeader";
import { useTasks, toggleTask } from "@/features/tasks/hooks/useTasks";

export default function WeekPage() {
  const t = useTranslations("tasks.page");

  const tasks = useTasks("week") ?? [];
  const done = tasks.filter((task) => task.completed).length;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title={t("week")}
        done={done}
        total={tasks.length}
      />

      <TaskAccordion
        group="week"
        tasks={tasks}
        addToGroup="week"
        onToggleTask={toggleTask}
      />
    </div>
  );
}
