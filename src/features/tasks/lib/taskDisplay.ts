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
 *   2. on a low-energy day, shorter tasks first — lighter work when there is
 *      less to spend, which is a sort order rather than a feature
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
 * What the Frog card should be saying right now.
 *
 * The card used to render a *suggestion* exactly like a *decision*, which made
 * two different bugs look the same: promoting a task the card could not see,
 * and — after finishing your frog — the next-ranked task silently appearing as
 * though you had picked it. Naming the states separately is what stops a
 * suggestion wearing the costume of a choice.
 *
 * Precedence is deliberate: **an eaten frog is terminal.** One frog per day is
 * the method, so finishing it settles the day rather than reopening it.
 *
 * This used to be the other way round — an open pick outranked a finished one —
 * and that is how the card and the row menu came to contradict each other. The
 * card asked "is a frog still in play?" first; every other surface asked "was a
 * frog eaten today?". On a day holding both, the card offered a swap while no
 * list would offer to promote anything. Same rule, two readings, two answers.
 */
export type FrogState<T> =
  | { kind: "none" }
  | { kind: "suggested"; frog: T }
  | { kind: "chosen"; frog: T }
  | { kind: "eaten"; frog: T };

/**
 * Today's frog, if it has already been eaten.
 *
 * Both the card and every promote affordance turn on this one question, so it
 * is one function rather than the same `find` written twice. Writing it twice
 * is how they drifted: the card checked the open list first and the row menu
 * checked this, and on a day holding both they gave opposite answers.
 */
export function eatenFrog<T extends { isFrog: boolean }>(
  doneToday: readonly T[]
): T | undefined {
  return doneToday.find((task) => task.isFrog);
}

export function frogState<T extends RankableTask & { completed: boolean }>(
  open: readonly T[],
  doneToday: readonly T[],
  energy?: EnergyLevel
): FrogState<T> {
  const eaten = eatenFrog(doneToday);
  if (eaten) return { kind: "eaten", frog: eaten };

  const chosen = open.find((task) => task.isFrog);
  if (chosen) return { kind: "chosen", frog: chosen };

  const suggestion = rankCandidates(open, energy)[0];
  return suggestion
    ? { kind: "suggested", frog: suggestion }
    : { kind: "none" };
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
