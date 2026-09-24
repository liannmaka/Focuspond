import type { EnergyLevel } from "@/features/mood/constants/moods";

/** One focus block is 25 minutes. */
export const FOCUS_BLOCK_MINUTES = 25;

/** The estimates offered when adding a task, in minutes. */
export const MINUTE_PRESETS = [15, 25, 50] as const;

export const ENERGY_LEVELS: readonly EnergyLevel[] = [
  "high",
  "medium",
  "low",
] as const;

/**
 * Planned focus blocks for an estimate. Always at least one — a five-minute
 * task is still one sitting.
 */
export const focusBlocksFor = (minutes: number) =>
  Math.max(1, Math.ceil(minutes / FOCUS_BLOCK_MINUTES));

/**
 * Translation key for a task's energy demand, rendered as the small uppercase
 * tag at the end of each row. This is what makes the energy model visible on
 * every task rather than only on the frog — copy lives in `tasks.energy.*`.
 */
export const energyTagKey = (energy: EnergyLevel) =>
  `energy.${energy}` as const;

/**
 * Rank for comparing energy levels. A task fits when what it demands is no more
 * than what the reader has: `energyRank(required) <= energyRank(available)`.
 */
export const energyRank = (energy: EnergyLevel): number =>
  ({ low: 0, medium: 1, high: 2 })[energy];

/**
 * Whether a task suits the day: it may demand no more energy than the reader
 * reported. A light task always fits; deep work only fits a high-energy day.
 *
 * Deliberately not symmetric. Doing something easy on a good day is fine; doing
 * something heavy on a tired day is the thing FocusPond exists to talk you out of.
 */
export const energyFits = (
  required: EnergyLevel,
  available: EnergyLevel
): boolean => energyRank(required) <= energyRank(available);

/**
 * Orders candidate tasks for the day, best first.
 *
 * The rules, in order of precedence:
 *   1. tasks that fit today's energy come before tasks that don't
 *   2. on a low-energy day, shorter tasks first — the "mini-frog" idea, which
 *      is a sort order rather than a feature
 *   3. otherwise heavier work first, since a good day is for the hard thing
 *   4. oldest first, so nothing rots at the bottom forever
 *
 * With no mood recorded, only rules 3 and 4 apply — no guessing.
 */
export function rankCandidates<T extends RankableTask>(
  tasks: readonly T[],
  energy?: EnergyLevel
): T[] {
  return [...tasks].sort((a, b) => {
    if (energy) {
      const aFits = energyFits(a.energyRequired, energy);
      const bFits = energyFits(b.energyRequired, energy);
      if (aFits !== bFits) return aFits ? -1 : 1;

      if (energy === "low") {
        const byShortest = a.estimatedMinutes - b.estimatedMinutes;
        if (byShortest !== 0) return byShortest;
      }
    }

    const byHeaviest =
      energyRank(b.energyRequired) - energyRank(a.energyRequired);
    if (byHeaviest !== 0) return byHeaviest;

    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

/**
 * The task to put forward as today's frog.
 *
 * An explicitly chosen frog always wins — the reader's own decision outranks
 * any suggestion. Only when nothing is marked does this fall back to ranking.
 * Returns `undefined` when there is nothing to suggest.
 */
export function suggestFrog<T extends RankableTask>(
  tasks: readonly T[],
  energy?: EnergyLevel
): T | undefined {
  const chosen = tasks.find((task) => task.isFrog);
  if (chosen) return chosen;

  return rankCandidates(tasks, energy)[0];
}

/**
 * The shape the ranking rules actually need. Kept structural rather than
 * importing `Task` so these stay trivially testable with literals.
 */
type RankableTask = {
  energyRequired: EnergyLevel;
  estimatedMinutes: number;
  isFrog: boolean;
  createdAt: Date;
};
