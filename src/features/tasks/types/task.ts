/** A task group as it appears in the sidebar and on the task pages. */
export type TaskGroup = "today" | "week" | "backlog" | "completed" | "other";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  group?: TaskGroup;
  /** Short qualitative label shown at the end of the row, e.g. "Deep work". */
  tag?: string;
  /** Planned pomodoro count. Drives the Frog's "3 focus blocks" line. */
  focusBlocks?: number;
  estimateMinutes?: number;
}

/**
 * The one task that would make the day count. Carries an energy verdict so the
 * hero can say whether it suits how the reader checked in on /mood.
 */
export interface Frog extends Task {
  /** True when the task's demand matches today's mood check-in. */
  energyMatch?: boolean;
}
