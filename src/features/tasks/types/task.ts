import type { EnergyLevel } from "@/features/mood/constants/moods";

/**
 * A task group. This is a *planning horizon*, not a status — completion is the
 * `completed` boolean, which is why there is no "completed" member here.
 */
export type TaskGroup = "today" | "week" | "backlog";

/**
 * The canonical task. This is both the stored record (Dexie `tasks` table) and
 * what components receive; there is deliberately no separate view model, since
 * the two previously drifted into incompatible shapes.
 *
 * `id` is optional only because Dexie assigns it on insert — every task that
 * has been read back from the database has one.
 */
export interface Task {
  id?: number;
  title: string;
  notes?: string;
  group: TaskGroup;
  /** How much energy this demands. Matched against the day's mood check-in. */
  energyRequired: EnergyLevel;
  estimatedMinutes: number;
  /** Planned focus blocks, derived from `estimatedMinutes`. */
  focusBlocks: number;
  focusBlocksDone: number;
  /** The one task that would make the day count. At most one should be true. */
  isFrog: boolean;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * A task promoted to the day's frog, carrying the energy verdict the hero
 * renders. Never stored — `energyMatch` is computed per render from today's
 * mood, so a task's suitability changes as the reader's energy does.
 */
export interface Frog extends Task {
  /**
   * True when the task's demand fits today's energy. Left `undefined` when no
   * mood has been recorded, which makes FrogOfTheDay hide the verdict row
   * rather than guess.
   */
  energyMatch?: boolean;
}

/** The fields a reader actually supplies when adding a task. */
export type NewTaskInput = {
  title: string;
  group: TaskGroup;
  energyRequired: EnergyLevel;
  estimatedMinutes: number;
  notes?: string;
  isFrog?: boolean;
};
