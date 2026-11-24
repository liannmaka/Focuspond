"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { pomodoroDB, reflectionDB, taskDB } from "@/lib/db/indexedDB";
import { guardWrite } from "@/lib/db/writeGuard";
import {
  addDays,
  startOfDay,
  startOfToday,
} from "@/features/tasks/lib/planning";
import { countsToday, currentStreak } from "../lib/streak";

/** The window "this week" means here: today and the six days before it. */
export const WEEK_WINDOW_DAYS = 7;

export type Progress = {
  /** Days in a row with a session finished or the frog eaten. */
  streak: number;
  /** Whether today is already one of them. */
  today: boolean;
  /** Frogs eaten in the last seven days. */
  frogsThisWeek: number;
  /** Frogs eaten, ever. */
  frogsAllTime: number;
  /** Focus blocks finished today. */
  blocksToday: number;
};

/**
 * What the Progress page reports, from rows already on disk.
 *
 * Everything here is derived, nothing is accumulated: there is no "streak"
 * field being incremented anywhere, no counter to drift, and no migration to
 * write when the rule changes. A day either has a completed session or an
 * eaten frog in it, or it does not — and the answer is recomputed from the
 * same rows every time, including rows written on another device later.
 *
 * `undefined` while the queries resolve.
 */
export function useProgress(): Progress | undefined {
  return useLiveQuery(async () => {
    const [sessions, frogs] = await Promise.all([
      pomodoroDB.getAllCompleted(),
      taskDB.getEatenFrogs(),
    ]);

    const now = new Date();

    /*
      A session is credited to the day it *finished*, which is also the day
      `complete()` stamped into `endTime`. For a block that runs past midnight
      that is the following day — the day the work ended, not the day it was
      begun, which is the same answer the focus screen gave at the time.
    */
    const sessionDays = sessions
      .map((session) => session.endTime)
      .filter((date): date is Date => date !== undefined);

    const frogDays = frogs
      .map((task) => task.completedAt)
      .filter((date): date is Date => date !== undefined);

    const activity = [...sessionDays, ...frogDays];

    // Rolling seven days, not a calendar week: a calendar week would need a
    // locale's idea of which day it starts on, and would tell someone on a
    // Monday morning that they have done nothing this week.
    const weekStart = startOfDay(addDays(now, -(WEEK_WINDOW_DAYS - 1)));
    const today = startOfToday(now);

    return {
      streak: currentStreak(activity, now),
      today: countsToday(activity, now),
      frogsThisWeek: frogDays.filter((date) => date >= weekStart).length,
      frogsAllTime: frogDays.length,
      blocksToday: sessionDays.filter((date) => date >= today).length,
    };
  }, []);
}

/**
 * Today's reflection, and the one way to write it.
 *
 * Returns `undefined` while loading, `""` for a day with nothing written —
 * which the page needs to tell apart, or a textarea seeded from a loading
 * state would overwrite the real note with an empty string on first blur.
 */
export function useReflection(): {
  note: string | undefined;
  save: (note: string) => Promise<void>;
} {
  const note = useLiveQuery(async () => {
    const reflection = await reflectionDB.getForDay();
    return reflection?.note ?? "";
  }, []);

  return {
    note,
    save: async (next: string) => {
      await guardWrite("reflection.save", () => reflectionDB.save(next));
    },
  };
}
