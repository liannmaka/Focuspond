"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { taskDB } from "@/lib/db/indexedDB";
import { viewFor } from "../lib/planning";
import type { NewTaskInput, Task, TaskGroup } from "../types/task";

/**
 * Task reads and writes, local-first.
 *
 * There is deliberately no in-memory store. IndexedDB is already the durable
 * source of truth, so a Zustand mirror would be a second copy needing manual
 * invalidation on every write. `useLiveQuery` re-runs on any write to the
 * observed tables — including writes from *another tab*, which matters for an
 * installed PWA. Queries here are tens of indexed rows.
 *
 * Every hook returns `undefined` on the first render (the query hasn't resolved
 * yet) and an array thereafter. Callers treat `undefined` as "still loading"
 * and fall back to `[]` so the accordions render their empty state rather than
 * flashing.
 */

/** Open tasks in one view, carried-over first. Live. */
export function useTasks(group: TaskGroup): Task[] | undefined {
  return useLiveQuery(() => taskDB.getByGroup(group), [group]);
}

/** Tasks finished today that belong to this view — the disclosure. Live. */
export function useDoneToday(group: TaskGroup): Task[] | undefined {
  return useLiveQuery(() => taskDB.getDoneToday(group), [group]);
}

/** Every incomplete task, across all groups. Live. */
export function useAllTasks(): Task[] | undefined {
  return useLiveQuery(() => taskDB.getIncomplete(), []);
}

/** Completed tasks, most recently finished first. Live. */
export function useCompletedTasks(): Task[] | undefined {
  return useLiveQuery(() => taskDB.getCompleted(), []);
}

export type GroupProgress = { open: number; done: number; total: number };

/**
 * What a view's header can truthfully say.
 *
 * `open` is what the list actually shows, which is why the header reads
 * "N left" rather than a fraction — a ratio next to a list of a different
 * length is how `4/4` ended up above an apparently empty group.
 *
 * `done` counts only today's completions, matching the disclosure beneath, so
 * `done`/`total` describes exactly the rows on screen and nothing else.
 */
export function useGroupProgress(group: TaskGroup): GroupProgress | undefined {
  return useLiveQuery(async () => {
    const [open, done] = await Promise.all([
      taskDB.getByGroup(group),
      taskDB.getDoneToday(group),
    ]);

    return {
      open: open.length,
      done: done.length,
      total: open.length + done.length,
    };
  }, [group]);
}

export type TaskCounts = Record<TaskGroup | "all" | "completed", number>;

/**
 * Open-task counts per nav tab, plus how many are done. One pass over the table
 * rather than five separate live queries.
 */
export function useTaskCounts(): TaskCounts | undefined {
  return useLiveQuery(async () => {
    const tasks = await taskDB.getAll();
    const open = tasks.filter((task) => !task.completed);

    const now = new Date();
    const inView = (group: TaskGroup) =>
      open.filter((task) => viewFor(task.plannedFor, now) === group).length;

    return {
      all: open.length,
      today: inView("today"),
      week: inView("week"),
      backlog: inView("backlog"),
      completed: tasks.length - open.length,
    };
  }, []);
}

// --- Mutations ---------------------------------------------------------------
// Thin wrappers so pages never import `taskDB` directly. Every live query
// observing the tasks table re-runs on its own after these resolve.

export async function addTask(input: NewTaskInput): Promise<number> {
  return taskDB.add(input);
}

export async function toggleTask(
  id: number,
  completed: boolean
): Promise<void> {
  await taskDB.setCompleted(id, completed);
}

export async function deleteTask(id: number): Promise<void> {
  await taskDB.delete(id);
}

/** Promotes one task to the day's frog, demoting any other. */
export async function setFrog(id: number): Promise<void> {
  await taskDB.setFrog(id);
}

export async function updateTask(
  id: number,
  updates: Partial<Task>
): Promise<void> {
  await taskDB.update(id, updates);
}
