import type { EnergyLevel } from "@/features/mood/constants/moods";

/**
 * Which list a task appears in.
 *
 * **Derived, never stored.** It is computed from `plannedFor` by `viewFor()` in
 * `../lib/planning`, so the passage of time moves tasks between lists on its
 * own. Storing it as a string is what made "today" permanent — a task filed
 * under Today in March was still under Today in October.
 *
 * Still a planning horizon rather than a status: completion is the `completed`
 * boolean, which is why there is no "completed" member here.
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
  /**
   * The day this is meant for, at local midnight. `null` means the backlog —
   * wanted, but not committed to a day.
   *
   * A past date on an unfinished task is not an error: it has carried over, and
   * still shows in Today (flagged as carried). This single field is what the
   * three lists are derived from.
   */
  plannedFor: Date | null;
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
  /** Local midnight of the intended day, or null for the backlog. */
  plannedFor: Date | null;
  energyRequired: EnergyLevel;
  estimatedMinutes: number;
  notes?: string;
  isFrog?: boolean;
};
