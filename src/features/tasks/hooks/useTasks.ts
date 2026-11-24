"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { taskDB } from "@/lib/db/indexedDB";
import { guardWrite } from "@/lib/db/writeGuard";
import { eatenFrog } from "../lib/taskDisplay";
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

/**
 * One task by id. Live.
 *
 * Three states, kept apart on purpose: `undefined` while the query resolves,
 * `null` for a task that is not on this device, and the task itself. A screen
 * routed to by id has to tell "still loading" from "deleted" — collapsing them
 * either flashes a not-found message over a task that exists, or leaves a
 * spinner up forever for one that does not.
 */
export function useTask(id: number | undefined): Task | null | undefined {
  return useLiveQuery(
    async () => (id === undefined ? null : ((await taskDB.get(id)) ?? null)),
    [id]
  );
}

/** Every incomplete task, across all groups. Live. */
export function useAllTasks(): Task[] | undefined {
  return useLiveQuery(() => taskDB.getIncomplete(), []);
}

/** Completed tasks, most recently finished first. Live. */
export function useCompletedTasks(): Task[] | undefined {
  return useLiveQuery(() => taskDB.getCompleted(), []);
}

/**
 * Whether today's frog has already been eaten.
 *
 * One frog per day is the method, so every surface that can promote a task has
 * to respect it — not just the card. Removing "Pick another" from the eaten
 * card while the row menu still offered "Make this the frog" enforced the rule
 * in one place and left the other open, which is how a second frog could still
 * appear and relabel the card "Frog of the day".
 *
 * Answered by `eatenFrog`, the same function the card's state machine calls, so
 * the two cannot disagree about whether the day is settled. They did: asked
 * separately, the card said "a frog is still in play" and this said "a frog was
 * eaten", both truthfully, on a day that held one of each.
 *
 * `undefined` while the query resolves. Callers hide the affordance only on a
 * definite `true`, so it does not flicker into view on first paint.
 */
export function useFrogEatenToday(): boolean | undefined {
  return useLiveQuery(async () => {
    const done = await taskDB.getDoneToday("today");
    return eatenFrog(done) !== undefined;
  }, []);
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
//
// All of them go through `guardWrite`: storage can refuse (a full disk, an
// origin over quota, site data blocked), and a write that fails silently in a
// local-first app does not degrade into a stale screen — the work is simply
// gone at the next reload, with no moment at which anyone was told.

export async function addTask(
  input: NewTaskInput
): Promise<number | undefined> {
  return guardWrite("task.add", () => taskDB.add(input));
}

export async function toggleTask(
  id: number,
  completed: boolean
): Promise<void> {
  await guardWrite("task.complete", () => taskDB.setCompleted(id, completed));
}

/**
 * Deletes a task. **Final** — no trash, no server copy, nothing to restore
 * from, which is why the row menu asks before calling this.
 *
 * This briefly returned the deleted row so the caller could offer an undo
 * toast instead of asking. The toast was the wrong guard: it is only as good
 * as the reader's chance of noticing and reaching it before it disappears, and
 * on something that cannot be recovered that is not a guard at all.
 */
export async function deleteTask(id: number): Promise<void> {
  await guardWrite("task.delete", () => taskDB.delete(id));
}

/** Promotes one task to the day's frog, demoting any other. */
export async function setFrog(id: number): Promise<void> {
  await guardWrite("task.frog", () => taskDB.setFrog(id));
}

export async function updateTask(
  id: number,
  updates: Partial<Task>
): Promise<void> {
  await guardWrite("task.update", () => taskDB.update(id, updates));
}
