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
  /** False = still needs to reach the backend. See docs/features/sync.md. */
  synced?: boolean;
}
