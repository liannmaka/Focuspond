import { Plus, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

type TaskAccordionProps = {
  title: string;
  taskCount: number;
  totalTasks: number;
  tasks: Task[];
  defaultOpen?: boolean;
  onAddTask?: () => void;
};

export function TaskAccordion({
  title,
  taskCount,
  totalTasks,
  tasks,
  defaultOpen = true,
  onAddTask,
}: TaskAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isEmpty = tasks.length === 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between pt-4 pb-2 border-b border-dark-accent/10">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 transition-transform duration-200 hover:bg-light-background/20 rounded-lg cursor-pointer"
          >
            <ChevronRight
              className={`w-5 h-5 text-dark-accent/80 transition-transform duration-200 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="font-medium font-sora text-sm text-darker-accent"
          >
            {title} {tasks.length ? `(${taskCount} / ${totalTasks})` : ""}
          </button>
        </div>

        <button
          onClick={onAddTask}
          className="p-2 hover:bg-light-background/20 rounded-lg transition-colors flex items-center gap-2 text-dark-accent cursor-pointer"
        >
          <span className="font-sora text-[11px]">Add Task</span>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {isEmpty ? (
          // Empty State
          <div className="text-dark-accent/70 py-6 text-center">
            <p className="text-[13px] font-manrope">No task here</p>
          </div>
        ) : (
          // Task List
          <div className="pb-4 pt-4 space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 py-3 px-2 hover:bg-light-background/15 rounded-lg transition-colors group cursor-pointer"
              >
                <button
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    task.completed
                      ? "bg-accent-button border-accent-button"
                      : "border-dark-accent/30 group-hover:border-dark-accent/50"
                  }`}
                >
                  {task.completed && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                <span
                  className={`flex-1 text-[13px] font-manrope ${
                    task.completed
                      ? "text-dark-accent/40 line-through"
                      : "text-dark-accent"
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
