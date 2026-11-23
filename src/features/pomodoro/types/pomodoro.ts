import type { MoodLevel } from "@/features/mood/constants/moods";

/**
 * One focus session. Stored in the Dexie `pomodoros` table.
 *
 * `startTime` + `duration` are the source of truth for a running session's
 * remaining time — never a counter held in memory, so a backgrounded tab, a
 * throttled interval or a reload cannot make the clock drift.
 */
export interface PomodoroSession {
  id?: number;
  /** Optional: a session can be standalone rather than tied to a task. */
  taskId?: number;
  startTime: Date;
  /** Undefined while the session is still running. */
  endTime?: Date;
  /** Planned length in minutes. */
  duration: number;
  /** Did the reader see the full session through? */
  completed: boolean;
  /** Optional snapshot of how they felt during this session. */
  mood?: MoodLevel;
  /**
   * When the break that follows this session ended — skipped early, or run to
   * its full length.
   *
   * The break itself is not a row: it is the five minutes after `endTime`, so
   * its clock derives from a date already stored and survives a reload for the
   * same reason the session's does. This field exists only to record that the
   * break is *over*, which the clock alone cannot say — otherwise skipping a
   * break and reloading would drop the reader straight back into it.
   *
   * Unindexed and optional, so it needs no migration: Dexie stores whatever
   * shape the object has, and nothing queries `.where()` on this.
   */
  breakEndedAt?: Date;
  /** False = still needs to reach the backend. See docs/features/sync.md. */
  synced?: boolean;
}
