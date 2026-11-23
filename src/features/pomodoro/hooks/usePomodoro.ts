"use client";

import { useCallback } from "react";

import { pomodoroDB } from "@/lib/db/indexedDB";
import { breakRemainingMs, breakStatus } from "../lib/breaks";
import {
  DEFAULT_DURATION_MINUTES,
  elapsedFraction,
  formatRemaining,
  remainingMs,
} from "../lib/timer";
import { useSessionClock } from "./useSessionClock";
import type { PomodoroSession } from "../types/pomodoro";

/**
 * What the focus screen should be showing.
 *
 * `busy` is the case a single boolean would have hidden: a session is running,
 * but for a *different* task. Rendering its clock under this task's title would
 * credit the wrong task when it finished, so it gets its own state and its own
 * copy rather than being folded into "running".
 *
 * There is no `finished` state. Finishing a session *is* the start of a break,
 * and the break screen is where the win is reported — a separate "finished"
 * flag was a second way of saying the same thing, held in memory, where a
 * reload lost it.
 */
export type PomodoroState =
  | { kind: "loading" }
  | { kind: "idle" }
  | {
      kind: "running";
      session: PomodoroSession;
      /** `mm:ss`, already formatted. */
      display: string;
      remainingMs: number;
      /** 0 → 1, for the ring M4b draws. */
      fraction: number;
    }
  | { kind: "busy"; session: PomodoroSession }
  | {
      /** The five minutes after a completed session. */
      kind: "break";
      /** The session just finished — the break hangs off its `endTime`. */
      session: PomodoroSession;
      display: string;
      remainingMs: number;
    };

export type Pomodoro = {
  state: PomodoroState;
  start: (duration?: number) => Promise<void>;
  /** Ends the running session early. No focus block is credited. */
  abandon: () => Promise<void>;
  /** Ends the break early — "back to focus". */
  endBreak: () => Promise<void>;
};

/**
 * Drives one focus session for `taskId` (undefined = a free session), and the
 * break that follows it.
 *
 * Both clocks are read from IndexedDB rather than held here, so a reload
 * resumes them and a second tab sees the same time. The only state this hook
 * owns is `now` — a value that is *supposed* to be thrown away on reload, which
 * is exactly why it is the one thing not persisted.
 *
 * The tick only moves `now` forward; it never decrements a counter. Everything
 * on screen is recomputed from a stored date on each render, so a throttled
 * background tab, a sleeping laptop or a dropped interval costs nothing but a
 * stale pixel — the next tick lands on the correct time rather than continuing
 * from the wrong one.
 */
export function usePomodoro(taskId?: number): Pomodoro {
  // Rows, clock and settling are shared with every other session surface —
  // see useSessionClock for why they cannot each keep their own.
  const { running, lastCompleted, now } = useSessionClock();

  const endBreak = useCallback(async () => {
    const last = await pomodoroDB.getLastCompleted();
    if (last?.id && !last.breakEndedAt) await pomodoroDB.endBreak(last.id);
  }, []);

  const start = useCallback(
    async (duration: number = DEFAULT_DURATION_MINUTES) => {
      // One session at a time. The screen does not offer this while another is
      // running, but the rule belongs where it cannot be routed around.
      if (await pomodoroDB.getRunning()) return;

      // Going back to work ends the break, whether or not it was taken. Left
      // open, the record would claim a break that was skipped was still owed.
      await endBreak();

      await pomodoroDB.start(taskId, duration);
      // No clock nudge here: the shared tick may be up to a second behind the
      // row it is measuring, which would read as 25:01 on a 25-minute block.
      // `remainingMs` caps at the session's length precisely so this is safe.
    },
    [taskId, endBreak]
  );

  const abandon = useCallback(async () => {
    const open = await pomodoroDB.getRunning();
    if (open?.id) await pomodoroDB.abandon(open.id);
  }, []);

  return {
    state: stateOf(running, lastCompleted, taskId, now),
    start,
    abandon,
    endBreak,
  };
}

function stateOf(
  running: PomodoroSession | null | undefined,
  lastCompleted: PomodoroSession | null | undefined,
  taskId: number | undefined,
  now: Date
): PomodoroState {
  // `undefined` is a live query still resolving — distinct from `null`, which
  // is a definite "nothing". Conflating them flashes the start button over a
  // session that is already counting down.
  if (running === undefined) return { kind: "loading" };

  if (running) {
    if (running.taskId !== taskId) return { kind: "busy", session: running };

    return {
      kind: "running",
      session: running,
      display: formatRemaining(remainingMs(running, now)),
      remainingMs: remainingMs(running, now),
      fraction: elapsedFraction(running, now),
    };
  }

  // Only now does the break matter, so only now is it worth waiting for.
  if (lastCompleted === undefined) return { kind: "loading" };

  if (lastCompleted && breakStatus(lastCompleted, now) === "running") {
    return {
      kind: "break",
      session: lastCompleted,
      display: formatRemaining(breakRemainingMs(lastCompleted, now)),
      remainingMs: breakRemainingMs(lastCompleted, now),
    };
  }

  return { kind: "idle" };
}
