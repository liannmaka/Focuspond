import type { TaskGroup } from "../types/task";

/**
 * When a task is planned for, and which list it therefore appears in.
 *
 * The whole of M2.5 rests on this file. `TaskGroup` used to be a stored string,
 * so "today" never changed meaning — a task filed under Today in March was
 * still under Today in October, and the promised "unfinished tasks roll over
 * automatically" was never true. The group is now *derived* from a date, so the
 * passage of time moves tasks by itself.
 *
 * Everything here is pure and takes `now` as an argument. Date bugs hide at
 * midnight boundaries and are miserable to reproduce against a real clock; this
 * way every edge is a unit test.
 */

/** How far ahead "this week" puts a task with no specific day. */
export const WEEK_AHEAD_DAYS = 7;

export const startOfDay = (date: Date): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const startOfToday = (now: Date = new Date()): Date => startOfDay(now);

export const startOfTomorrow = (now: Date = new Date()): Date =>
  startOfDay(addDays(now, 1));

/**
 * Which list a task belongs to, from its planned date.
 *
 * The three views are exhaustive — every task lands in exactly one, so nothing
 * can become invisible by having a date no view asks for:
 *
 *   backlog  no date at all; someday, no commitment
 *   today    dated today *or earlier* — the earlier ones have carried over
 *   week     dated after today
 *
 * "Week" therefore means *upcoming* rather than strictly this calendar week.
 * That is deliberate: a view bounded by Sunday would leave anything planned
 * further out with nowhere to appear.
 */
export const viewFor = (
  plannedFor: Date | null | undefined,
  now: Date = new Date()
): TaskGroup => {
  if (!plannedFor) return "backlog";
  return plannedFor < startOfTomorrow(now) ? "today" : "week";
};

/**
 * The date to store when a reader files a task under a view.
 *
 * "This week" lands a week out rather than at the end of the calendar week —
 * predictable regardless of which day you are planning on, and it rolls into
 * Today on its own when the date arrives.
 */
export const plannedForView = (
  view: TaskGroup,
  now: Date = new Date()
): Date | null => {
  switch (view) {
    case "today":
      return startOfToday(now);
    case "week":
      return startOfDay(addDays(now, WEEK_AHEAD_DAYS));
    case "backlog":
      return null;
  }
};

/**
 * True when an unfinished task was planned for a day that has already passed.
 *
 * Carrying over is the promised behaviour, but it has to be *visible* — silent
 * accumulation is what makes a Today list quietly stop meaning anything.
 * Completed tasks are never "carried": they are finished, not outstanding.
 */
export const isCarriedOver = (
  task: { plannedFor: Date | null; completed: boolean },
  now: Date = new Date()
): boolean =>
  !task.completed &&
  task.plannedFor !== null &&
  task.plannedFor < startOfToday(now);

/** Milliseconds in a day, for whole-day differences. */
const DAY_MS = 86_400_000;

/**
 * How many days an unfinished task has been waiting; `0` when it is not
 * carried over at all.
 *
 * The number is more useful than a generic "carried over" label: a task that
 * slipped once reads very differently from one dodged for a week, and that is
 * the only distinction the marker is there to draw.
 *
 * Rounded rather than floored because clocks shift — an hour lost to DST must
 * not turn three days into two.
 */
export const daysCarried = (
  task: { plannedFor: Date | null; completed: boolean },
  now: Date = new Date()
): number => {
  if (!isCarriedOver(task, now) || !task.plannedFor) return 0;
  const elapsed =
    startOfToday(now).getTime() - startOfDay(task.plannedFor).getTime();
  return Math.round(elapsed / DAY_MS);
};

/** Beyond this, weekday names repeat and stop identifying a day. */
export const WEEKDAY_NAMES_STAY_UNIQUE_FOR = 7;

/**
 * How a carried-over task should name the day it was meant for.
 *
 * Returns the shape rather than a string: weekday and date names have to come
 * from next-intl's formatter to be right in all six locales, so the decision
 * lives here (pure, testable) and the wording lives in the component.
 *
 * Why it switches at a week: weekday names repeat every 7 days, so on a
 * Wednesday "Wed" could mean yesterday-ish or last week. Past that point only
 * a real date identifies the day.
 */
export type CarriedLabel =
  | { kind: "none" }
  | { kind: "yesterday"; days: 1 }
  | { kind: "weekday"; date: Date; days: number }
  | { kind: "date"; date: Date; days: number };

export const carriedLabel = (
  task: { plannedFor: Date | null; completed: boolean },
  now: Date = new Date()
): CarriedLabel => {
  const days = daysCarried(task, now);
  if (days === 0 || !task.plannedFor) return { kind: "none" };

  const date = startOfDay(task.plannedFor);
  if (days === 1) return { kind: "yesterday", days: 1 };
  if (days < WEEKDAY_NAMES_STAY_UNIQUE_FOR)
    return { kind: "weekday", date, days };
  return { kind: "date", date, days };
};

/** True when `date` falls on the same calendar day as `now`. */
export const isSameDay = (
  date: Date | null | undefined,
  now: Date = new Date()
): boolean => {
  if (!date) return false;
  return date >= startOfToday(now) && date < startOfTomorrow(now);
};

/**
 * Whether a completed task counts as "done today".
 *
 * Keyed on `completedAt`, not `plannedFor`: finishing yesterday's carried-over
 * task is a win you earned *today*, and it should read that way. It also stops
 * old completions piling up in Today forever — a task planned and finished last
 * week is simply gone from the list, not sitting in its disclosure.
 */
export const wasCompletedToday = (
  task: { completed: boolean; completedAt?: Date },
  now: Date = new Date()
): boolean => task.completed && isSameDay(task.completedAt, now);
