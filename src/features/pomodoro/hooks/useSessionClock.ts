"use client";

import { useEffect, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { pomodoroDB } from "@/lib/db/indexedDB";
import { breakEnd, breakRemainingMs } from "../lib/breaks";
import { resolveSession } from "../lib/timer";
import { useTick } from "../store/tick";
import type { PomodoroSession } from "../types/pomodoro";

export type SessionClock = {
  /** The open session, `null` for none, `undefined` while the query resolves. */
  running: PomodoroSession | null | undefined;
  /** The session a break would hang off, same three states. */
  lastCompleted: PomodoroSession | null | undefined;
  /** The shared instant everything on screen is measured against. */
  now: Date;
};

/**
 * The rows and the clock every session surface reads, plus the settling that
 * has to happen wherever a session is observed.
 *
 * Extracted from `usePomodoro` once the top bar started showing the same
 * session: the two would otherwise each keep their own `now` and their own
 * copy of "what should happen when this runs out". The second is the dangerous
 * one — a session that elapses while the reader is on another page has to be
 * closed out by whatever is watching, or the clock sits at 00:00 until someone
 * happens to open the focus screen again.
 *
 * Several components may mount this at once and all try to settle the same
 * session. That is safe by construction rather than by luck: `complete`,
 * `abandon` and `endBreak` are each once-only in the database, so the second
 * caller writes nothing and credits nothing.
 */
export function useSessionClock(): SessionClock {
  const running = useLiveQuery(
    async () => (await pomodoroDB.getRunning()) ?? null,
    []
  );

  const lastCompleted = useLiveQuery(
    async () => (await pomodoroDB.getLastCompleted()) ?? null,
    []
  );

  /*
    Whether the clock needs to move, decided without consulting the clock —
    asking "is a break still running?" would need a `now` we have not got yet.
    An unrecorded break on a completed session counts as maybe-running; the
    effect below settles it and the ticking stops on the next render.
  */
  const ticking =
    Boolean(running) ||
    Boolean(lastCompleted?.completed && !lastCompleted.breakEndedAt);

  const now = new Date(useTick(ticking));

  // Guards against the close-outs running twice from one component: the
  // effects re-fire on every tick and the writes are not instant.
  const closingSession = useRef(false);
  const closingBreak = useRef(false);

  /**
   * Settles a session whose time is up — including one that ran out while the
   * tab was closed, which is why this is keyed on the row and the clock rather
   * than on a timer firing. The timer only decides when this is reconsidered.
   */
  useEffect(() => {
    if (!running?.id || closingSession.current) return;

    const outcome = resolveSession(running, now);
    if (outcome === "running") return;

    const id = running.id;
    closingSession.current = true;

    void (async () => {
      try {
        if (outcome === "complete") await pomodoroDB.complete(id);
        else await pomodoroDB.abandon(id);
      } finally {
        closingSession.current = false;
      }
    })();
  }, [running, now]);

  /**
   * Closes out a break that has run its length. The clock already says it is
   * over; this records *that* it is over, so a reload does not drop the reader
   * back into a break they have already taken.
   */
  useEffect(() => {
    if (!lastCompleted?.id || closingBreak.current) return;
    if (lastCompleted.breakEndedAt) return;
    if (!lastCompleted.completed || !lastCompleted.endTime) return;
    if (breakRemainingMs(lastCompleted, now) > 0) return;

    const id = lastCompleted.id;
    // When the break *actually* ran out, not when this noticed.
    const ended = breakEnd(lastCompleted);
    closingBreak.current = true;

    void (async () => {
      try {
        await pomodoroDB.endBreak(id, ended);
      } finally {
        closingBreak.current = false;
      }
    })();
  }, [lastCompleted, now]);

  return { running, lastCompleted, now };
}
