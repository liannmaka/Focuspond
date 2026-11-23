"use client";

import { breakRemainingMs, breakStatus } from "../lib/breaks";
import { formatRemaining, remainingMs } from "../lib/timer";
import { useSessionClock } from "./useSessionClock";

export type ChromeSession = {
  /** Working, or resting. */
  kind: "focus" | "break";
  /** `mm:ss`, already formatted. */
  display: string;
  /** Where clicking it goes — the session's own screen. */
  href: string;
  /** The task it belongs to, so a surface can tell whether it is *this* one. */
  taskId?: number;
};

/**
 * Whether anything is counting right now, for surfaces outside the focus
 * screen: the top bar, the frog card, a task row.
 *
 * Read-only on purpose. `usePomodoro` owns starting, abandoning and ending a
 * break, and it takes a task id because its answers are relative to one task.
 * The chrome has no task — it asks the simpler question, "is something running,
 * and how long is left" — so giving it the full state machine would mean every
 * surface deciding what `busy` means to it. They would not all decide the same.
 *
 * `undefined` while the queries resolve, `null` when nothing is counting.
 * Callers render nothing for both; the distinction exists so a surface can tell
 * "nothing is running" from "not known yet" if it ever needs to.
 */
export function useRunningSession(): ChromeSession | null | undefined {
  const { running, lastCompleted, now } = useSessionClock();

  if (running === undefined || lastCompleted === undefined) return undefined;

  if (running) {
    return {
      kind: "focus",
      display: formatRemaining(remainingMs(running, now)),
      href: `/home/timer/${running.taskId ?? "free"}`,
      taskId: running.taskId,
    };
  }

  // A break is as much "something is happening" as a session is — it has a
  // clock running down and a screen to go back to. Leaving it out of the
  // chrome would make the five minutes after a session feel like a dead end.
  if (lastCompleted && breakStatus(lastCompleted, now) === "running") {
    return {
      kind: "break",
      display: formatRemaining(breakRemainingMs(lastCompleted, now)),
      href: `/home/timer/${lastCompleted.taskId ?? "free"}`,
      taskId: lastCompleted.taskId,
    };
  }

  return null;
}
