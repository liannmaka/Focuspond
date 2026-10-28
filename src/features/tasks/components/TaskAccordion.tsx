"use client";

import { Plus, ChevronRight, Check } from "lucide-react";
import { useId, useState } from "react";
import { useTranslations, useFormatter } from "next-intl";
// Direct paths, not the `@/components/ui` barrel — the barrel drags Card,
// Input and next/link into every app route that renders a task row.
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import TaskComposer from "./TaskComposer";
import TaskRowMenu from "./TaskRowMenu";
import { carriedLabel } from "../lib/planning";
import { energyTagKey } from "../lib/taskDisplay";
import type { Task, TaskGroup } from "../types/task";

type TaskAccordionProps = {
  /**
   * Translation key for the group heading — copy lives in `tasks.groups`.
   * "completed" is a heading, not a planning group, which is why it sits
   * alongside `TaskGroup` rather than inside it.
   */
  group: TaskGroup | "completed";
  tasks: Task[];
  defaultOpen?: boolean;
  /**
   * Which group a task added here belongs to. Omit to hide the add affordances
   * entirely — which is what the Completed list wants, since you finish a task
   * rather than create a finished one.
   */
  addToGroup?: TaskGroup;
  /**
   * Tasks finished today that belong to this group, from `useDoneToday`. They
   * render behind a collapsed disclosure rather than vanishing to another tab:
   * the marketing promises "note your wins" and "see your completed Frogs", and
   * a different tab does not deliver that. Collapsed by default keeps the list
   * itself clean.
   */
  doneToday?: Task[];
  onToggleTask?: (id: number, completed: boolean) => void;
};

/**
 * The day a carried-over task was meant for.
 *
 * A weekday is calmer than a day count: "5d" is a score going up, which reads
 * more like an accusation each day, while "Friday" is a fact that does not
 * grow. Deliberately styled as quiet metadata rather than a warning — nothing
 * has gone wrong, and an app whose pitch is "no pressure, no hustle" states
 * this rather than scolds. It never escalates with age for the same reason.
 *
 * Weekday and date names come from the formatter, so they are correct in every
 * locale rather than hardcoded English.
 */
function CarriedPill({ task }: { task: Task }) {
  const t = useTranslations("tasks");
  const format = useFormatter();
  const label = carriedLabel(task);

  if (label.kind === "none") return null;

  const text =
    label.kind === "yesterday"
      ? t("list.carriedYesterday")
      : label.kind === "weekday"
        ? format.dateTime(label.date, { weekday: "short" })
        : format.dateTime(label.date, { day: "numeric", month: "short" });

  // The pill says *when*; the tooltip says *how long*. Complementary, so
  // hovering adds something rather than repeating the visible text.
  const full = t("list.carriedFor", { count: label.days });

  return (
    <span
      title={full}
      aria-label={full}
      className="shrink-0 rounded-full bg-surface-sunken px-1.5 py-0.5 font-sora text-[10px] font-semibold text-ink-subtle"
    >
      {text}
    </span>
  );
}

export function TaskAccordion({
  group,
  tasks,
  defaultOpen = true,
  addToGroup,
  doneToday = [],
  onToggleTask,
}: TaskAccordionProps) {
  const t = useTranslations("tasks");
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [showDone, setShowDone] = useState(false);
  const panelId = useId();
  const donePanelId = useId();

  const label = t(`groups.${group}`);
  const canAdd = addToGroup !== undefined;

  /**
   * The header counts what the list actually shows. A ratio against a different
   * number is how "4/4" ended up above an apparently empty group — the four
   * were real, but three of them were elsewhere.
   */
  const openCount = tasks.length;

  /**
   * Nothing open splits into two very different states: a group nobody has
   * filled in, and one that has been finished today. Treating them alike told a
   * reader who had just completed four tasks that there was "nothing here yet".
   */
  const isCleared = openCount === 0 && doneToday.length > 0;
  const isEmpty = openCount === 0 && !isCleared;

  /** Adding into a collapsed group would write into something unseen. */
  function startAdding() {
    setIsOpen(true);
    setIsAdding(true);
  }

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

        {openCount > 0 && (
          <span className="rounded-full bg-ambient-soft px-2 py-0.5 font-sora text-[11px] font-semibold tabular-nums text-ink-muted">
            {t("list.left", { count: openCount })}
          </span>
        )}

        {canAdd && (
          <Button
            variant="ghost"
            size="xs"
            onClick={startAdding}
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
        )}
      </div>

      <div
        id={panelId}
        hidden={!isOpen}
        className="pt-1"
      >
        {/* Finished, not empty. Deliberately compact — a cleared group is a
            small reward, not a call to action, and it should not push the
            groups below it off the screen. */}
        {isCleared && !isAdding && (
          <div className="flex items-center justify-center gap-2 px-6 py-5 text-center">
            <Check
              className="size-3.5 shrink-0 text-success"
              aria-hidden
            />
            <p className="text-sm text-ink-muted">
              {t("list.cleared", { count: doneToday.length })}
            </p>
          </div>
        )}

        {isEmpty && !isAdding && (
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
            {canAdd && (
              <Button
                variant="ghost"
                size="xs"
                onClick={startAdding}
                className="mt-2"
              >
                {t("list.empty.action")}
              </Button>
            )}
          </div>
        )}

        {!isEmpty && (
          <ul className="py-1">
            {tasks.map((task) =>
              /* Editing replaces the row in place rather than opening a modal,
                 so the list stays the thing you are working in. */
              editingId !== undefined && task.id === editingId ? (
                <li
                  key={task.id}
                  className="py-1"
                >
                  <TaskComposer
                    group={addToGroup ?? "today"}
                    task={task}
                    onDone={() => setEditingId(undefined)}
                  />
                </li>
              ) : (
                <li
                  key={task.id}
                  className="group -mx-2.5 flex items-center gap-3.5 rounded-lg px-2.5 py-2.5 transition-colors not-first:shadow-[inset_0_1px_0_var(--line-soft)] hover:bg-ambient-soft"
                >
                  <Checkbox
                    checked={task.completed}
                    label={task.title}
                    onChange={(next) =>
                      task.id !== undefined && onToggleTask?.(task.id, next)
                    }
                  />

                  <span
                    className={`flex-1 text-sm ${
                      task.completed
                        ? "text-ink-subtle line-through"
                        : "text-ink"
                    }`}
                  >
                    {task.title}
                  </span>

                  {/*
                  Carrying over has to be visible — silently blending
                  yesterday's leftovers into today is how a Today list stops
                  meaning anything. But it sits with the other metadata, not
                  against the title, and it is deliberately *not* `warning`:
                  nothing has gone wrong, and an app whose pitch is "no
                  pressure, no hustle" should state this rather than scold.
                */}
                  <CarriedPill task={task} />

                  {/* Energy read as a tag, so the day's fit is legible per row. */}
                  <span className="hidden font-sora text-[10.5px] font-semibold tracking-[0.04em] text-ink-subtle uppercase sm:inline">
                    {t(energyTagKey(task.energyRequired))}
                  </span>
                  {task.estimatedMinutes > 0 && (
                    <span className="text-xs tabular-nums text-ink-subtle">
                      {task.estimatedMinutes}m
                    </span>
                  )}

                  <TaskRowMenu
                    task={task}
                    onEdit={() => setEditingId(task.id)}
                  />
                </li>
              )
            )}
          </ul>
        )}

        {isAdding && addToGroup && (
          <div className="pt-1 pb-2">
            <TaskComposer
              group={addToGroup}
              onDone={() => setIsAdding(false)}
            />
          </div>
        )}

        {/* Today's wins, kept but folded away. Visible in one click, absent
            from the working list. */}
        {doneToday.length > 0 && !isCleared && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowDone((v) => !v)}
              aria-expanded={showDone}
              aria-controls={donePanelId}
              className="-ml-1.5 flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-ambient-soft"
            >
              <ChevronRight
                className={`size-3.5 shrink-0 text-ink-subtle transition-transform duration-200 ${
                  showDone ? "rotate-90" : ""
                }`}
                aria-hidden
              />
              <span className="font-sora text-xs font-semibold text-ink-subtle">
                {t("list.doneToday", { count: doneToday.length })}
              </span>
            </button>

            <ul
              id={donePanelId}
              hidden={!showDone}
              className="py-1"
            >
              {doneToday.map((task) => (
                <li
                  key={task.id}
                  className="-mx-2.5 flex items-center gap-3.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-ambient-soft"
                >
                  <Checkbox
                    checked
                    label={task.title}
                    onChange={() =>
                      task.id !== undefined && onToggleTask?.(task.id, false)
                    }
                  />
                  <span className="flex-1 text-sm text-ink-subtle line-through">
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
