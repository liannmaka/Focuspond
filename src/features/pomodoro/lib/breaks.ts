import type { EnergyLevel } from "@/features/mood/constants/moods";
import {
  BREAK_CATEGORIES_FOR_ENERGY,
  BREAK_PROMPTS,
  type BreakPrompt,
} from "../constants/breakPrompts";
import { MINUTE_MS } from "./timer";
import type { PomodoroSession } from "../types/pomodoro";

/**
 * The break that follows a finished session. Pure, `now` as an argument.
 *
 * A break is **not stored as its own thing**. It is the five minutes after a
 * completed session's `endTime`, so its clock is a subtraction over a date
 * already on disk — reload-safe for exactly the reason the session clock is,
 * with no row, no table and no migration. `breakEndedAt` records only that it
 * is over, which a clock cannot say on its own.
 */

/** One break. Long enough to leave the chair, short enough to come back. */
export const BREAK_MINUTES = 5;

export function breakEnd(session: PomodoroSession): Date | undefined {
  return session.endTime
    ? new Date(session.endTime.getTime() + BREAK_MINUTES * MINUTE_MS)
    : undefined;
}

/**
 * Milliseconds of break left, floored at zero and capped at the break's length.
 *
 * Capped for the same reason the session clock is: `now` can sit just before
 * the moment the break began, and a rounded-up display then reads `05:01` on a
 * five-minute break.
 */
export function breakRemainingMs(
  session: PomodoroSession,
  now: Date = new Date()
): number {
  const end = breakEnd(session);
  if (!end) return 0;

  return Math.min(
    BREAK_MINUTES * MINUTE_MS,
    Math.max(0, end.getTime() - now.getTime())
  );
}

/**
 * Whether a break is owed, running or done.
 *
 * `"over"` covers both ways a break ends — run to the end, or skipped — so the
 * caller does not have to know which. Only a session that was *completed* earns
 * one: an abandoned session has nothing to recover from.
 */
export type BreakStatus = "none" | "running" | "over";

export function breakStatus(
  session: PomodoroSession | null | undefined,
  now: Date = new Date()
): BreakStatus {
  if (!session?.completed || !session.endTime) return "none";
  if (session.breakEndedAt) return "over";

  return breakRemainingMs(session, now) > 0 ? "running" : "over";
}

/**
 * The prompt to offer after `session`, given today's energy.
 *
 * Deterministic, keyed on the session id: the same break always shows the same
 * prompt, so a reload mid-break does not swap the suggestion out from under
 * someone halfway through following it. Consecutive sessions step through the
 * pool rather than repeating.
 *
 * Energy narrows the pool (see `BREAK_CATEGORIES_FOR_ENERGY`). Unknown energy
 * means *unknown*, never low, so the whole pool stays eligible — guessing would
 * quietly offer a drained reader a brisk walk, or hide one from someone who
 * never checked in.
 */
export function promptFor(
  session: PomodoroSession,
  energy?: EnergyLevel
): BreakPrompt {
  const allowed = energy ? BREAK_CATEGORIES_FOR_ENERGY[energy] : undefined;
  const pool = allowed
    ? BREAK_PROMPTS.filter((prompt) => allowed.includes(prompt.category))
    : BREAK_PROMPTS;

  // Every category appears in at least one energy pool, so this cannot empty —
  // but a future category added to the data and not to the map would, and a
  // break screen with no prompt is worse than a slightly off suggestion.
  const prompts = pool.length > 0 ? pool : BREAK_PROMPTS;

  return prompts[(session.id ?? 0) % prompts.length];
}
