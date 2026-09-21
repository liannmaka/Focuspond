import Dexie, { Table } from "dexie";

import type { EnergyLevel } from "@/features/mood/constants/moods";
import type { MoodEntry } from "@/features/mood/types/mood";
import type { PomodoroSession } from "@/features/pomodoro/types/pomodoro";
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
  }
}

export const db = new FocusPondDB();

// ---------------------------------------------------------------------------
// Moods
// ---------------------------------------------------------------------------

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const startOfTomorrow = () => {
  const tomorrow = startOfToday();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

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

  /** The day's first check-in, or undefined if they haven't checked in today. */
  async getToday(): Promise<MoodEntry | undefined> {
    return await db.moods
      .where("createdAt")
      .between(startOfToday(), startOfTomorrow(), true, false)
      .first();
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

  /** Incomplete tasks in one group, oldest first. */
  async getByGroup(group: TaskGroup): Promise<Task[]> {
    const tasks = await db.tasks.where("group").equals(group).toArray();
    return tasks.filter((task) => !task.completed).sort(byCreatedAt);
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
  async setFrog(id: number): Promise<void> {
    await db.transaction("rw", db.tasks, async () => {
      const current = await db.tasks.toArray();
      await Promise.all(
        current
          .filter((task) => task.isFrog && task.id !== id)
          .map((task) =>
            db.tasks.update(task.id!, { isFrog: false, synced: false })
          )
      );
      await db.tasks.update(id, { isFrog: true, synced: false });
    });
  },

  async update(id: number, updates: Partial<Task>): Promise<number> {
    return await db.tasks.update(id, { ...updates, synced: false });
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
