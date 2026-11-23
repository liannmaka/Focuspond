import { describe, expect, it } from "vitest";

import type { PomodoroSession } from "../types/pomodoro";
import {
  COMPLETION_GRACE_MINUTES,
  DEFAULT_DURATION_MINUTES,
  elapsedFraction,
  formatRemaining,
  MINUTE_MS,
  plannedEnd,
  remainingMs,
  resolveSession,
} from "./timer";

/** Midday, so nothing sits on a midnight boundary. */
const START = new Date(2026, 10, 3, 12, 0, 0);

const session = (over: Partial<PomodoroSession> = {}): PomodoroSession => ({
  id: 1,
  taskId: 7,
  startTime: START,
  duration: DEFAULT_DURATION_MINUTES,
  completed: false,
  ...over,
});

/** `minutes` after the session started. */
const at = (minutes: number) => new Date(START.getTime() + minutes * MINUTE_MS);

describe("plannedEnd", () => {
  it("is the start plus the planned duration", () => {
    expect(plannedEnd(session())).toEqual(at(25));
  });
});

describe("remainingMs", () => {
  it("is the full duration at the moment it starts", () => {
    expect(remainingMs(session(), START)).toBe(25 * MINUTE_MS);
  });

  /**
   * The point of the whole feature. Nothing counts down in memory, so the
   * answer is the same whether the tab watched all ten minutes or was closed
   * for them — which is what makes a reload mid-session safe.
   */
  it("is computed from the clock, not from elapsed ticks", () => {
    expect(remainingMs(session(), at(10))).toBe(15 * MINUTE_MS);
  });

  it("floors at zero rather than going negative", () => {
    expect(remainingMs(session(), at(90))).toBe(0);
  });
});

describe("formatRemaining", () => {
  it("reads as the full duration the instant a session starts", () => {
    expect(formatRemaining(25 * MINUTE_MS)).toBe("25:00");
  });

  /** Rounding down would show 24:59 immediately, which reads as a lost second. */
  it("rounds up, so a part-second still shows as a whole one", () => {
    expect(formatRemaining(25 * MINUTE_MS - 1)).toBe("25:00");
    expect(formatRemaining(1)).toBe("00:01");
  });

  it("pads both halves so the digits do not jump", () => {
    expect(formatRemaining(5 * MINUTE_MS)).toBe("05:00");
    expect(formatRemaining(9_000)).toBe("00:09");
  });

  it("shows zero when the time is up", () => {
    expect(formatRemaining(0)).toBe("00:00");
  });
});

describe("elapsedFraction", () => {
  it("runs from nothing to everything", () => {
    expect(elapsedFraction(session(), START)).toBe(0);
    expect(elapsedFraction(session(), at(25))).toBe(1);
  });

  it("is half way at half time", () => {
    expect(elapsedFraction(session(), at(12.5))).toBeCloseTo(0.5);
  });

  it("never exceeds one, however long the tab was away", () => {
    expect(elapsedFraction(session(), at(500))).toBe(1);
  });
});

describe("resolveSession", () => {
  it("leaves a session alone while it is still running", () => {
    expect(resolveSession(session(), at(24))).toBe("running");
  });

  /** The watched case: the clock reaches zero with someone looking at it. */
  it("completes a session the moment its time is up", () => {
    expect(resolveSession(session(), at(25))).toBe("complete");
  });

  /**
   * The unwatched case. The tab was shut at minute 3 and reopened at minute 40;
   * the 25 minutes still passed, so the block counts.
   */
  it("completes a session that finished while the tab was closed", () => {
    expect(resolveSession(session(), at(40))).toBe("complete");
  });

  /**
   * A session reopened days later is not evidence of focus. Crediting it would
   * put a block on the board nobody did, so it closes as abandoned instead.
   */
  it("abandons a session left open far past its grace window", () => {
    expect(
      resolveSession(session(), at(25 + COMPLETION_GRACE_MINUTES + 1))
    ).toBe("abandon");
    expect(resolveSession(session(), at(60 * 48))).toBe("abandon");
  });

  it("still completes one sitting exactly on the edge of the window", () => {
    expect(resolveSession(session(), at(25 + COMPLETION_GRACE_MINUTES))).toBe(
      "complete"
    );
  });
});

describe("a clock that is a hair early", () => {
  /**
   * `now` can sit just before `startTime`: the instant a session is created,
   * or when a second tab or a corrected system clock is involved. Because the
   * display rounds up, one millisecond early used to read 25:01 on a
   * 25-minute block — a clock claiming more time than the session has.
   */
  it("never reports more time left than the session is long", () => {
    const early = new Date(START.getTime() - 1);

    expect(remainingMs(session(), early)).toBe(25 * MINUTE_MS);
    expect(formatRemaining(remainingMs(session(), early))).toBe("25:00");
  });

  it("holds even for a clock badly out of step", () => {
    const wayEarly = new Date(START.getTime() - 60 * MINUTE_MS);

    expect(formatRemaining(remainingMs(session(), wayEarly))).toBe("25:00");
  });

  it("reports nothing elapsed rather than negative progress", () => {
    const early = new Date(START.getTime() - 5 * MINUTE_MS);

    expect(elapsedFraction(session(), early)).toBe(0);
  });
});
