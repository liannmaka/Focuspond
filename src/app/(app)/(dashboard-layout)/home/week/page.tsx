"use client";

import { TaskAccordion } from "@/features/tasks/components/TaskAccordion";

export default function WeekPage() {
  return (
    <div className="max-w-4xl mx-auto md:mx-0">
      <TaskAccordion
        title="This week"
        taskCount={0}
        totalTasks={0}
        tasks={[]}
        onAddTask={() => console.log("Add task")}
      />
    </div>
  );
}
