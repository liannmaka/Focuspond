"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { deleteTask, updateTask } from "../hooks/useTasks";
import { plannedForView, viewFor } from "../lib/planning";
import type { Task, TaskGroup } from "../types/task";

const DESTINATIONS: TaskGroup[] = ["today", "week", "backlog"];

/**
 * Per-row actions: edit, move to another day, delete.
 *
 * This is the escape hatch M2.5 left open. `plannedFor` was written once at
 * creation and never again, so a task that landed in Today stayed there for
 * good with its carried count climbing, and nothing could be removed at all.
 *
 * Rescheduling is a plain `plannedFor` write — "Someday" is simply `null`,
 * which needs no new concept. Nothing here expires or moves tasks on its own;
 * every move is the reader's decision.
 */
export default function TaskRowMenu({
  task,
  onEdit,
}: {
  task: Task;
  onEdit: () => void;
}) {
  const t = useTranslations("tasks");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (task.id === undefined) return null;
  const id = task.id;
  const currentView = viewFor(task.plannedFor);

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("row.actions", { title: task.title })}
        // Hidden until the row is hovered or this button has focus, so a list
        // at rest stays calm. `focus-visible:` keeps it reachable by keyboard.
        className="flex size-7 cursor-pointer items-center justify-center rounded-md text-ink-subtle opacity-0 transition-opacity group-hover:opacity-100 hover:bg-ambient-soft hover:text-ink focus-visible:opacity-100 aria-expanded:opacity-100"
      >
        <MoreHorizontal
          className="size-4"
          aria-hidden
        />
      </button>

      <div
        role="menu"
        hidden={!open}
        className="absolute right-0 z-50 mt-1 min-w-44 rounded-xl border border-line bg-surface-raised p-1.5 shadow-e3"
      >
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onEdit();
          }}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-ambient-soft"
        >
          <Pencil
            className="size-3.5 shrink-0"
            aria-hidden
          />
          {t("row.edit")}
        </button>

        <p className="px-2.5 pt-2 pb-1 font-sora text-[10px] font-bold tracking-[0.1em] text-ink-subtle uppercase">
          {t("row.moveTo")}
        </p>

        {DESTINATIONS.map((destination) => (
          <button
            key={destination}
            type="button"
            role="menuitem"
            disabled={destination === currentView}
            onClick={async () => {
              setOpen(false);
              await updateTask(id, { plannedFor: plannedForView(destination) });
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-ambient-soft disabled:cursor-default disabled:text-ink-subtle disabled:hover:bg-transparent"
          >
            {t(`groups.${destination}`)}
            {destination === currentView && (
              <span className="font-sora text-[10px] text-ink-subtle">
                {t("row.current")}
              </span>
            )}
          </button>
        ))}

        <div
          className="my-1 h-px bg-line"
          aria-hidden
        />

        <button
          type="button"
          role="menuitem"
          onClick={async () => {
            setOpen(false);
            await deleteTask(id);
          }}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-danger transition-colors hover:bg-danger/10"
        >
          <Trash2
            className="size-3.5 shrink-0"
            aria-hidden
          />
          {t("row.delete")}
        </button>
      </div>
    </div>
  );
}
