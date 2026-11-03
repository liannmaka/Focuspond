import Dexie, { Table } from "dexie";

import type { EnergyLevel } from "@/features/mood/constants/moods";
import type { MoodEntry } from "@/features/mood/types/mood";
import type { PomodoroSession } from "@/features/pomodoro/types/pomodoro";
import {
  plannedForView,
  startOfToday,
  startOfTomorrow,
  viewFor,
  wasCompletedToday,
} from "@/features/tasks/lib/planning";
import { focusBlocksFor } from "@/features/tasks/lib/taskDisplay";
import type {
  NewTaskInput,
  Task,
  TaskGroup,
} from "@/features/tasks/types/task";

export type { MoodEntry, PomodoroSession, Task };

/**
 * A task as actually stored. `synced` is bookkeeping for a backend that does
 * not exist yet (see docs/features/sync.md) and is deliberately kept out of the
 * app-facing `Task`, so components can't start depending on it.
 */
export type StoredTask = Task & { synced?: boolean };

/**
 * The v2 → v3 row mapping, lifted out of the Dexie callback so it can be tested
 * directly. Real data runs through this exactly once, and getting it wrong
 * loses someone's tasks — that is not a thing to leave to an untested closure.
 *
 * Intent is preserved rather than the literal label: "today" becomes due today
 * (so from tomorrow it reads as carried over, which is the truth), "week" lands
 * a week out, and "backlog" keeps no date at all. A row with no group is
 * treated as today — it was visible there before, and silently moving it to a
 * list nobody checks would be worse than a date that is slightly early.
 */
export function migrateToPlannedFor(
  task: Record<string, unknown>,
  now: Date = new Date()
): void {
  const group = task.group as TaskGroup | undefined;
  const known = group === "week" || group === "backlog" || group === "today";

  task.plannedFor = plannedForView(known ? group : "today", now);
  delete task.group;
}

/**
 * The v3 → v4 repair: **one frog per day**, applied to rows already written.
 *
 * Two entry points could promote a task, and only one of them checked whether
 * today's frog had already been eaten. `setFrog` also spares completed frogs on
 * purpose — a past win keeps its badge, which M6's streaks will read — so a
 * single day could end up holding two: the eaten one and a fresh open one. Both
 * buttons are guarded now, and `frogState` settles the tie, but the rows that
 * bug wrote are still on disk and nothing else will clear them.
 *
 * The eaten frog wins, because it is the day's record and a win is not
 * something to rewrite. The open pretender is demoted to an ordinary task,
 * keeping its date, notes and place in the list — it is only the badge that was
 * never really earned.
 *
 * Returns the ids to demote rather than writing, so the decision can be tested
 * without a database. Scoped to today: that is the only day on which "a frog
 * was eaten" and "a frog is still in play" are claims about the same day.
 */
export function staleFrogIds(
  tasks: readonly StoredTask[],
  now: Date = new Date()
): number[] {
  const eatenToday = tasks.some(
    (task) => task.isFrog && wasCompletedToday(task, now)
  );
  if (!eatenToday) return [];

  return tasks
    .filter((task) => task.isFrog && !task.completed && task.id !== undefined)
    .map((task) => task.id!);
}

/**
 * FocusPond's local-first store. IndexedDB is the source of truth for tasks,
 * moods and focus sessions; the `synced` flags exist so a future backend can
 * pick up where the device left off, and nothing reads them yet.
 *
 * Indexing note: IndexedDB keys may only be numbers, strings, Dates, arrays or
 * ArrayBuffers — **booleans are not valid keys**. So `completed` and `isFrog`
 * are deliberately not indexed, and every query over them uses `.filter()`
 * rather than `.where()`. Adding them to a `stores()` string would not error
 * loudly; it would just quietly never match. Row counts here are in the tens,
 * so the table scan costs nothing.
 */
export class FocusPondDB extends Dexie {
  moods!: Table<MoodEntry, number>;
  tasks!: Table<StoredTask, number>;
  pomodoros!: Table<PomodoroSession, number>;

  constructor() {
    super("FocusPondDB");

    this.version(1).stores({
      moods: "++id, level, createdAt",
      tasks: "++id, priority, energyRequired, createdAt",
      pomodoros: "++id, taskId, startTime",
    });

    /**
     * v2 — tasks gained a planning `group`, dropped `priority` (it overlapped
     * `isFrog` and `energyRequired`), and renamed its pomodoro counters to the
     * vocabulary the UI uses. In practice no task rows exist in the wild yet
     * (nothing ever wrote one), so the upgrade is insurance, not a migration.
     */
    this.version(2)
      .stores({
        moods: "++id, level, createdAt",
        tasks: "++id, group, energyRequired, createdAt",
        pomodoros: "++id, taskId, startTime",
      })
      .upgrade(async (tx) => {
        await tx
          .table("tasks")
          .toCollection()
          .modify((task: Record<string, unknown>) => {
            task.group ??= "today";
            task.isFrog = task.isFrogTask === true;
            task.focusBlocks =
              (task.pomodoroCount as number | undefined) ??
              focusBlocksFor((task.estimatedMinutes as number) ?? 25);
            task.focusBlocksDone =
              (task.pomodorosCompleted as number | undefined) ?? 0;

            delete task.isFrogTask;
            delete task.pomodoroCount;
            delete task.pomodorosCompleted;
            delete task.priority;
          });
      });

    /**
     * v3 — the planning `group` string becomes a `plannedFor` date.
     *
     * A stored group never changed, so "today" was permanent and nothing could
     * roll over. The lists are now derived from the date by `viewFor()`, which
     * means time moves tasks by itself.
     *
     * The upgrade preserves intent rather than the literal label: a task filed
     * under Today becomes due today (so it reads as carried over from tomorrow
     * on, which is the truth), "week" lands a week out, and "backlog" keeps no
     * date at all.
     */
    this.version(3)
      .stores({
        moods: "++id, level, createdAt",
        tasks: "++id, plannedFor, energyRequired, createdAt",
        pomodoros: "++id, taskId, startTime",
      })
      .upgrade(async (tx) => {
        const now = new Date();
        await tx
          .table("tasks")
          .toCollection()
          .modify((task: Record<string, unknown>) =>
            migrateToPlannedFor(task, now)
          );
      });

    /**
     * v4 — no schema change; a data repair. Days holding two frogs (one eaten,
     * one still open) are a leftover of promoting from the row menu after the
     * frog had been eaten. See `staleFrogIds` for why the eaten one wins.
     *
     * The stores string is unchanged from v3 and repeated deliberately: Dexie
     * diffs it, so saying it again documents that no index moved.
     */
    this.version(4)
      .stores({
        moods: "++id, level, createdAt",
        tasks: "++id, plannedFor, energyRequired, createdAt",
        pomodoros: "++id, taskId, startTime",
      })
      .upgrade(async (tx) => {
        const tasks = tx.table<StoredTask, number>("tasks");
        const stale = staleFrogIds(await tasks.toArray());

        await Promise.all(
          stale.map((id) => tasks.update(id, { isFrog: false, synced: false }))
        );
      });
  }
}

export const db = new FocusPondDB();

// ---------------------------------------------------------------------------
// Moods
// ---------------------------------------------------------------------------

export const moodDB = {
  async add(mood: Omit<MoodEntry, "id" | "createdAt" | "synced">) {
    return await db.moods.add({
      ...mood,
      createdAt: new Date(),
      synced: false,
    });
  },

  async getLatest(): Promise<MoodEntry | undefined> {
    return await db.moods.orderBy("createdAt").reverse().first();
  },

  /**
   * The day's *most recent* check-in, or undefined if they haven't checked in
   * today.
   *
   * Latest, not first: energy changes through a day, and re-checking in is the
   * reader telling us it has. Every check-in is still stored — the history is
   * what streaks and mood trends will read — but only the newest one describes
   * how they feel now.
   */
  async getToday(): Promise<MoodEntry | undefined> {
    return await db.moods
      .where("createdAt")
      .between(startOfToday(), startOfTomorrow(), true, false)
      .last();
  },

  async getTodayMoods(): Promise<MoodEntry[]> {
    return await db.moods
      .where("createdAt")
      .between(startOfToday(), startOfTomorrow(), true, false)
      .toArray();
  },

  async getUnsynced(): Promise<MoodEntry[]> {
    return await db.moods.filter((mood) => mood.synced === false).toArray();
  },

  async markAsSynced(id: number): Promise<number> {
    return await db.moods.update(id, { synced: true });
  },

  async getAll(): Promise<MoodEntry[]> {
    return await db.moods.toArray();
  },
};

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

const byCreatedAt = (a: Task, b: Task) =>
  a.createdAt.getTime() - b.createdAt.getTime();

/**
 * Oldest planned day first, undated last, then by creation.
 *
 * In Today this surfaces carried-over work above today's own — the thing you
 * meant to do yesterday deserves to be seen first.
 */
const byPlannedThenCreated = (a: Task, b: Task) => {
  const aTime = a.plannedFor?.getTime() ?? Infinity;
  const bTime = b.plannedFor?.getTime() ?? Infinity;
  if (aTime !== bTime) return aTime - bTime;
  return byCreatedAt(a, b);
};

export const taskDB = {
  /** Derives focus blocks and the bookkeeping fields from what the reader typed. */
  async add(input: NewTaskInput): Promise<number> {
    return await db.tasks.add({
      ...input,
      isFrog: input.isFrog ?? false,
      focusBlocks: focusBlocksFor(input.estimatedMinutes),
      focusBlocksDone: 0,
      completed: false,
      createdAt: new Date(),
      synced: false,
    } as Task);
  },

  /**
   * Open tasks in one view, carried-over first.
   *
   * Filtered in memory rather than queried by range because `plannedFor` is
   * nullable — IndexedDB simply omits rows with a null indexed value, so a
   * `.where("plannedFor")` range can never return the backlog. Row counts are
   * in the tens; `viewFor` on each is free and keeps one definition of what the
   * lists mean.
   */
  async getByGroup(group: TaskGroup, now: Date = new Date()): Promise<Task[]> {
    const tasks = await db.tasks.toArray();
    return tasks
      .filter(
        (task) => !task.completed && viewFor(task.plannedFor, now) === group
      )
      .sort(byPlannedThenCreated);
  },

  /**
   * Tasks finished *today* that belong to this view — the "Done today"
   * disclosure. Keyed on `completedAt`, so clearing yesterday's carried-over
   * task counts as today's win, and last week's completions do not linger.
   */
  async getDoneToday(
    group: TaskGroup,
    now: Date = new Date()
  ): Promise<Task[]> {
    const tasks = await db.tasks.toArray();
    return tasks
      .filter(
        (task) =>
          wasCompletedToday(task, now) &&
          viewFor(task.plannedFor, now) === group
      )
      .sort(
        (a, b) =>
          (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0)
      );
  },

  async getIncomplete(): Promise<Task[]> {
    const tasks = await db.tasks.toArray();
    return tasks.filter((task) => !task.completed).sort(byCreatedAt);
  },

  /** Completed tasks, most recently finished first. */
  async getCompleted(): Promise<Task[]> {
    const tasks = await db.tasks.toArray();
    return tasks
      .filter((task) => task.completed)
      .sort(
        (a, b) =>
          (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0)
      );
  },

  async getFrogTasks(): Promise<Task[]> {
    const tasks = await db.tasks.toArray();
    return tasks.filter((task) => task.isFrog && !task.completed);
  },

  async getByEnergy(energy: EnergyLevel): Promise<Task[]> {
    const tasks = await db.tasks
      .where("energyRequired")
      .equals(energy)
      .toArray();
    return tasks.filter((task) => !task.completed);
  },

  /**
   * Both directions — unchecking a task has to be possible, which the previous
   * one-way `complete()` could not express.
   */
  async setCompleted(id: number, completed: boolean): Promise<number> {
    return await db.tasks.update(id, {
      completed,
      completedAt: completed ? new Date() : undefined,
      synced: false,
    });
  },

  /** Promotes one task to frog and demotes any other, in a single transaction. */
  /**
   * Promotes one task to today's frog and demotes any other, in a single
   * transaction.
   *
   * It also dates the task to today, because **the frog is by definition a
   * today task** — "the one task that would make today count". Choosing
   * something as your frog *is* saying it is for today.
   *
   * Enforced here rather than at the call site so the invariant holds for every
   * caller. Promoting from Backlog or Upcoming used to set `isFrog` on a task
   * the Today card could not see: the flag was written, the previous frog was
   * demoted, and the card silently fell back to a different task. Destructive
   * and invisible.
   *
   * No-op for a task already dated today, which is every task the picker offers.
   */
  async setFrog(id: number, now: Date = new Date()): Promise<void> {
    await db.transaction("rw", db.tasks, async () => {
      const current = await db.tasks.toArray();
      await Promise.all(
        current
          // Only demote frogs still in play. A completed frog keeps its badge:
          // it *was* the frog, it got eaten, and that record is what the card's
          // "Frog eaten" state and M6's streaks both read.
          .filter((task) => task.isFrog && !task.completed && task.id !== id)
          .map((task) =>
            db.tasks.update(task.id!, { isFrog: false, synced: false })
          )
      );
      await db.tasks.update(id, {
        isFrog: true,
        plannedFor: startOfToday(now),
        synced: false,
      });
    });
  },

  /**
   * General-purpose patch, with one invariant enforced: **a frog is always a
   * today task.**
   *
   * `setFrog` guarantees that going in, but rescheduling could break it coming
   * out — moving the frog to Upcoming left `isFrog` set on a row the Today card
   * queries past, so the card fell back to promoting an unrelated task. Exactly
   * the failure that promoting *from* Backlog used to cause, from the other
   * direction.
   *
   * Enforced here rather than in the row menu so no future caller can
   * reintroduce it. Moving work off today is itself a statement that it is not
   * today's one task.
   */
  async update(
    id: number,
    updates: Partial<Task>,
    now: Date = new Date()
  ): Promise<number> {
    const leavesToday =
      "plannedFor" in updates &&
      viewFor(updates.plannedFor ?? null, now) !== "today";

    return await db.tasks.update(id, {
      ...updates,
      ...(leavesToday ? { isFrog: false } : {}),
      synced: false,
    });
  },

  async getUnsynced(): Promise<Task[]> {
    return await db.tasks.filter((task) => task.synced === false).toArray();
  },

  async markAsSynced(id: number): Promise<number> {
    return await db.tasks.update(id, { synced: true });
  },

  async getAll(): Promise<Task[]> {
    return await db.tasks.toArray();
  },

  async delete(id: number): Promise<void> {
    await db.tasks.delete(id);
  },
};

// ---------------------------------------------------------------------------
// Pomodoros
// ---------------------------------------------------------------------------

export const pomodoroDB = {
  async start(
    taskId: number | undefined,
    duration: number = 25
  ): Promise<number> {
    return await db.pomodoros.add({
      taskId,
      startTime: new Date(),
      duration,
      completed: false,
      synced: false,
    });
  },

  /** Closes the session and advances the linked task's focus-block count. */
  async complete(id: number): Promise<number> {
    const session = await db.pomodoros.get(id);

    if (session?.taskId) {
      const task = await db.tasks.get(session.taskId);
      if (task) {
        await db.tasks.update(session.taskId, {
          focusBlocksDone: (task.focusBlocksDone || 0) + 1,
          synced: false,
        });
      }
    }

    return await db.pomodoros.update(id, {
      endTime: new Date(),
      completed: true,
      synced: false,
    });
  },

  async getToday(): Promise<PomodoroSession[]> {
    return await db.pomodoros
      .where("startTime")
      .aboveOrEqual(startOfToday())
      .toArray();
  },

  async getUnsynced(): Promise<PomodoroSession[]> {
    return await db.pomodoros
      .filter((pomodoro) => pomodoro.synced === false)
      .toArray();
  },

  async markAsSynced(id: number): Promise<number> {
    return await db.pomodoros.update(id, { synced: true });
  },
};
