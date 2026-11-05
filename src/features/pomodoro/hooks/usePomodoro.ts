"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { pomodoroDB } from "@/lib/db/indexedDB";
import {
  DEFAULT_DURATION_MINUTES,
  elapsedFraction,
  formatRemaining,
  remainingMs,
  resolveSession,
} from "../lib/timer";
import type { PomodoroSession } from "../types/pomodoro";

/**
 * What the focus screen should be showing.
 *
 * `busy` is the case a single boolean would have hidden: a session is running,
 * but for a *different* task. Rendering its clock under this task's title would
 * credit the wrong task when it finished, so it gets its own state and its own
 * copy rather than being folded into "running".
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
  | { kind: "finished" };

export type Pomodoro = {
  state: PomodoroState;
  start: (duration?: number) => Promise<void>;
  /** Ends the running session early. No focus block is credited. */
  abandon: () => Promise<void>;
};

/**
 * Drives one focus session for `taskId` (undefined = a free session).
 *
 * The running session is read from IndexedDB rather than held here, so a reload
 * resumes it and a second tab sees the same clock. The only state this hook
 * owns is `now` — a value that is *supposed* to be thrown away on reload, which
 * is exactly why it is the one thing not persisted.
 *
 * The tick only moves `now` forward; it never decrements a counter. Everything
 * on screen is recomputed from `startTime + duration` on each render, so a
 * throttled background tab, a sleeping laptop or a dropped interval costs
 * nothing but a stale pixel — the next tick lands on the correct time rather
 * than continuing from the wrong one.
 */
export function usePomodoro(taskId?: number): Pomodoro {
  const running = useLiveQuery(
    async () => (await pomodoroDB.getRunning()) ?? null,
    []
  );

  const [now, setNow] = useState(() => new Date());
  const [finished, setFinished] = useState(false);

  // Guards the close-out below against running twice: the effect re-fires on
  // every tick, and `complete` is not instant, so without this the second tick
  // after zero would credit a second focus block for the same session.
  const closing = useRef(false);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [running]);

  /**
   * Settles a session whose time is up — including one that ran out while the
   * tab was closed, which is why this is keyed on the row and the clock rather
   * than on a timer firing. The timer only decides *when* this is reconsidered.
   */
  useEffect(() => {
    if (!running?.id || closing.current) return;

    const outcome = resolveSession(running, now);
    if (outcome === "running") return;

    const id = running.id;
    closing.current = true;

    void (async () => {
      try {
        if (outcome === "complete") {
          await pomodoroDB.complete(id);
          setFinished(true);
        } else {
          await pomodoroDB.abandon(id);
        }
      } finally {
        closing.current = false;
      }
    })();
  }, [running, now]);

  const start = useCallback(
    async (duration: number = DEFAULT_DURATION_MINUTES) => {
      // One session at a time. The screen does not offer this while another is
      // running, but the rule belongs where it cannot be routed around.
      if (await pomodoroDB.getRunning()) return;

      setFinished(false);
      setNow(new Date());
      await pomodoroDB.start(taskId, duration);
    },
    [taskId]
  );

  const abandon = useCallback(async () => {
    const open = await pomodoroDB.getRunning();
    if (open?.id) await pomodoroDB.abandon(open.id);
  }, []);

  return { state: stateOf(running, taskId, now, finished), start, abandon };
}

function stateOf(
  running: PomodoroSession | null | undefined,
  taskId: number | undefined,
  now: Date,
  finished: boolean
): PomodoroState {
  // `undefined` is the live query still resolving — distinct from `null`, which
  // is a definite "nothing is running". Conflating them flashes the start
  // button over a session that is already counting down.
  if (running === undefined) return { kind: "loading" };
  if (running === null)
    return finished ? { kind: "finished" } : { kind: "idle" };
  if (running.taskId !== taskId) return { kind: "busy", session: running };

  return {
    kind: "running",
    session: running,
    display: formatRemaining(remainingMs(running, now)),
    remainingMs: remainingMs(running, now),
    fraction: elapsedFraction(running, now),
  };
}
