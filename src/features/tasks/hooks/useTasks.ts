"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { taskDB } from "@/lib/db/indexedDB";
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

/** Incomplete tasks in one group, oldest first. Live. */
export function useTasks(group: TaskGroup): Task[] | undefined {
  return useLiveQuery(() => taskDB.getByGroup(group), [group]);
}

/** Every incomplete task, across all groups. Live. */
export function useAllTasks(): Task[] | undefined {
  return useLiveQuery(() => taskDB.getIncomplete(), []);
}

/** Completed tasks, most recently finished first. Live. */
export function useCompletedTasks(): Task[] | undefined {
  return useLiveQuery(() => taskDB.getCompleted(), []);
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

    return {
      all: open.length,
      today: open.filter((task) => task.group === "today").length,
      week: open.filter((task) => task.group === "week").length,
      backlog: open.filter((task) => task.group === "backlog").length,
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
