import {
  addDays,
  startOfDay,
  startOfToday,
} from "@/features/tasks/lib/planning";

/**
 * Streaks, as a pure function over the days something happened.
 *
 * No database, no clock of its own — `now` arrives as an argument like every
 * other date function in this codebase. A streak is the most gap-prone thing
 * in the plan (midnight, missed days, daylight saving, two sessions in one
 * evening), and all of those are boundary cases that only stay honest if they
 * can be tested without seeding a database.
 *
 * **A day counts if anything happened on it**: a focus session completed, or
 * the frog eaten. Callers decide what qualifies and pass the dates in; this
 * only knows about days.
 */

/** Local midnight, as a comparable number. Local, so a 23:30 session is that
 *  evening's — not tomorrow's, which is what a UTC key would make it east of
 *  Greenwich. */
const dayKey = (date: Date): number => startOfDay(date).getTime();

/** The distinct local days represented in `dates`. */
export function activeDays(dates: readonly Date[]): Set<number> {
  return new Set(dates.map(dayKey));
}

/**
 * Days in a row, counting back from today.
 *
 * **A day that has not finished yet does not break a streak.** If yesterday
 * counted and today is still empty, the streak stands — you have until midnight
 * to keep it. Counting strictly back from today would show someone a `0` over
 * breakfast after twelve honest days, which is both discouraging and untrue; an
 * app whose pitch is "no pressure, no hustle" does not get to do that.
 *
 * So the walk starts at today when today counts, and at yesterday otherwise.
 * Only when neither counts is the streak actually over.
 *
 * Steps a day at a time with `addDays` rather than subtracting 24 hours:
 * across a daylight-saving boundary a day is 23 or 25 hours, and fixed-width
 * arithmetic lands at 23:00 of the right day or 01:00 of the wrong one.
 */
export function currentStreak(
  dates: readonly Date[],
  now: Date = new Date()
): number {
  const active = activeDays(dates);
  if (active.size === 0) return 0;

  const today = startOfToday(now);
  let cursor = active.has(today.getTime()) ? today : addDays(today, -1);

  let streak = 0;
  while (active.has(dayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

/**
 * Whether today is already counted — the difference between "your streak is
 * safe" and "today is still open", which the page says out loud so the number
 * never has to be read as a warning.
 */
export function countsToday(
  dates: readonly Date[],
  now: Date = new Date()
): boolean {
  return activeDays(dates).has(startOfToday(now).getTime());
}
