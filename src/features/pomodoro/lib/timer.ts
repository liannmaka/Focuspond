import type { PomodoroSession } from "../types/pomodoro";

/**
 * Focus-session arithmetic. Pure, and every function takes `now` as an
 * argument — the clock is never read in here, so these are testable without
 * faking time and the UI can be driven from any instant.
 *
 * The rule the whole feature rests on: **remaining time is derived from
 * `startTime + duration`, never counted down in memory.** A tab that gets
 * backgrounded has its intervals throttled, a sleeping laptop stops firing them
 * altogether, and a reload loses them entirely. A decremented counter silently
 * drifts in all three; a subtraction cannot.
 */

export const MINUTE_MS = 60_000;

/** One focus block. The number the marketing site has been promising. */
export const DEFAULT_DURATION_MINUTES = 25;

/**
 * How long after its planned end a session can still be closed as completed.
 *
 * Sessions are not watched. If the tab was shut at minute 3 and reopened at
 * minute 26, the 25 minutes still passed and the block counts. But a session
 * reopened two days later is not evidence of anything, and crediting it would
 * put a focus block on the board that nobody did — so past this window the
 * session is closed as abandoned instead, with no credit.
 */
export const COMPLETION_GRACE_MINUTES = 60;

/** The instant a session is due to finish. */
export function plannedEnd(session: PomodoroSession): Date {
  return new Date(session.startTime.getTime() + session.duration * MINUTE_MS);
}

/**
 * Milliseconds left, floored at zero and **capped at the session's length**.
 *
 * A finished session is never negative, and a 25-minute session never has more
 * than 25 minutes left. The cap is not hypothetical: `now` can sit a hair
 * *before* `startTime` — the instant a session is created, or when a second tab
 * or a corrected system clock is involved — and because the display rounds up,
 * being one millisecond early showed `25:01` on a 25-minute block.
 */
export function remainingMs(
  session: PomodoroSession,
  now: Date = new Date()
): number {
  const left = plannedEnd(session).getTime() - now.getTime();

  return Math.min(session.duration * MINUTE_MS, Math.max(0, left));
}

/**
 * `mm:ss`, rounded **up**, so a 25-minute session reads `25:00` the instant it
 * starts and `00:01` through its final second. Rounding down would show `24:59`
 * immediately and `00:00` for a whole second before the session was over, which
 * reads as a stalled clock.
 */
export function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** 0 → 1 elapsed, for the progress ring M4b draws. */
export function elapsedFraction(
  session: PomodoroSession,
  now: Date = new Date()
): number {
  const total = session.duration * MINUTE_MS;
  if (total <= 0) return 1;

  return Math.min(1, Math.max(0, 1 - remainingMs(session, now) / total));
}

/** What should happen to a session found open in the database. */
export type SessionOutcome = "running" | "complete" | "abandon";

/**
 * Resolves an open session against the clock.
 *
 * Called on every tick *and* on load, so the same rule settles a session that
 * finishes while you watch it and one that finished while the tab was closed.
 * That is deliberate: the two are the same event, and only one of them has
 * anyone present to witness it.
 */
export function resolveSession(
  session: PomodoroSession,
  now: Date = new Date()
): SessionOutcome {
  const end = plannedEnd(session).getTime();
  if (now.getTime() < end) return "running";

  return now.getTime() <= end + COMPLETION_GRACE_MINUTES * MINUTE_MS
    ? "complete"
    : "abandon";
}
