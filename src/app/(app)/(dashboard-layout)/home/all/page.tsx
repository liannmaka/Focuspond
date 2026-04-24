"use client";

import { TaskAccordion } from "@/components/ui/TaskAccordion";

export default function AllPage() {
  // const todayTasks = [
  //   { id: "1", title: "Check in with mood", completed: false },
  //   { id: "2", title: "Use mood suggestion to work or not", completed: false },
  //   { id: "3", title: "Explore pomodoro timer", completed: true },
  // ];

  return (
    <div className="max-w-4xl mx-auto space-y-0 md:mx-0">
      <TaskAccordion
        title="Today"
        taskCount={0}
        totalTasks={0}
        tasks={[]}
        defaultOpen={true}
        onAddTask={() => console.log("Add today task")}
      />

      <TaskAccordion
        title="This week"
        taskCount={0}
        totalTasks={0}
        tasks={[]}
        defaultOpen={false}
        onAddTask={() => console.log("Add week task")}
      />

      <TaskAccordion
        title="Backlog"
        taskCount={0}
        totalTasks={0}
        tasks={[]}
        defaultOpen={false}
        onAddTask={() => console.log("Add backlog task")}
      />
    </div>
  );
}
