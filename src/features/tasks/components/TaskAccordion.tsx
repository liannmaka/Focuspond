"use client";

import { Plus, ChevronRight } from "lucide-react";
import { useId, useState } from "react";
import { useTranslations } from "next-intl";
// Direct paths, not the `@/components/ui` barrel — the barrel drags Card,
// Input and next/link into every app route that renders a task row.
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import type { Task, TaskGroup } from "../types/task";

type TaskAccordionProps = {
  /** Translation key for the group heading — copy lives in `tasks.groups`. */
  group: TaskGroup;
  tasks: Task[];
  defaultOpen?: boolean;
  onAddTask?: () => void;
  onToggleTask?: (id: string, completed: boolean) => void;
};

export function TaskAccordion({
  group,
  tasks,
  defaultOpen = true,
  onAddTask,
  onToggleTask,
}: TaskAccordionProps) {
  const t = useTranslations("tasks");
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();

  const label = t(`groups.${group}`);
  const done = tasks.filter((task) => task.completed).length;
  const isEmpty = tasks.length === 0;

  return (
    <section aria-label={label}>
      <div className="flex items-center gap-2.5 border-b border-line pb-3">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="-ml-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-ambient-soft"
        >
          <ChevronRight
            className={`size-4 shrink-0 text-ink-subtle transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
            aria-hidden
          />
          <span className="font-sora text-sm font-semibold text-ink">
            {label}
          </span>
          <span className="sr-only">
            {t("list.toggleGroup", { group: label })}
          </span>
        </button>

        {!isEmpty && (
          <span className="rounded-full bg-ambient-soft px-2 py-0.5 font-sora text-[11px] font-semibold tabular-nums text-ink-muted">
            {done}/{tasks.length}
          </span>
        )}

        <Button
          variant="ghost"
          size="xs"
          onClick={onAddTask}
          className="ml-auto"
          rightIcon={
            <Plus
              className="size-3.5"
              aria-hidden
            />
          }
        >
          {t("list.addTask")}
        </Button>
      </div>

      <div
        id={panelId}
        hidden={!isOpen}
        className="pt-1"
      >
        {isEmpty ? (
          <div className="flex flex-col items-center gap-1 px-6 py-10 text-center">
            {/* A still pond: concentric rings with nothing dropped in yet. */}
            <span
              className="mb-2 block size-10 rounded-full border border-line ring-6 ring-ambient-soft"
              aria-hidden
            />
            <p className="font-sora text-sm font-semibold text-ink">
              {t("list.empty.title")}
            </p>
            <p className="text-sm text-ink-subtle">{t("list.empty.body")}</p>
            <Button
              variant="ghost"
              size="xs"
              onClick={onAddTask}
              className="mt-2"
            >
              {t("list.empty.action")}
            </Button>
          </div>
        ) : (
          <ul className="py-1">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="group -mx-2.5 flex items-center gap-3.5 rounded-lg px-2.5 py-2.5 transition-colors not-first:shadow-[inset_0_1px_0_var(--line-soft)] hover:bg-ambient-soft"
              >
                <Checkbox
                  checked={task.completed}
                  label={task.title}
                  onChange={(next) => onToggleTask?.(task.id, next)}
                />

                <span
                  className={`flex-1 text-sm ${
                    task.completed ? "text-ink-subtle line-through" : "text-ink"
                  }`}
                >
                  {task.title}
                </span>

                {task.tag && (
                  <span className="hidden font-sora text-[10.5px] font-semibold tracking-[0.04em] text-ink-subtle uppercase sm:inline">
                    {task.tag}
                  </span>
                )}
                {task.estimateMinutes && (
                  <span className="text-xs tabular-nums text-ink-subtle">
                    {task.estimateMinutes}m
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
