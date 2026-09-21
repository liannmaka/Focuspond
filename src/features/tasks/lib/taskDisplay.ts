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
