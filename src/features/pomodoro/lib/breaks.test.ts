import { describe, expect, it } from "vitest";

import {
  BREAK_CATEGORIES_FOR_ENERGY,
  BREAK_PROMPTS,
} from "../constants/breakPrompts";
import type { PomodoroSession } from "../types/pomodoro";
import { MINUTE_MS } from "./timer";
import {
  BREAK_MINUTES,
  breakEnd,
  breakRemainingMs,
  breakStatus,
  promptFor,
} from "./breaks";

const START = new Date(2026, 10, 3, 12, 0, 0);
/** A 25-minute session that ran its full length. */
const ENDED = new Date(START.getTime() + 25 * MINUTE_MS);

const finished = (over: Partial<PomodoroSession> = {}): PomodoroSession => ({
  id: 1,
  taskId: 7,
  startTime: START,
  endTime: ENDED,
  duration: 25,
  completed: true,
  ...over,
});

/** `minutes` after the session ended. */
const after = (minutes: number) =>
  new Date(ENDED.getTime() + minutes * MINUTE_MS);

describe("breakEnd", () => {
  it("is five minutes after the session actually ended", () => {
    expect(breakEnd(finished())).toEqual(after(BREAK_MINUTES));
  });

  /** A session with no end has no break to place. */
  it("is undefined for a session still running", () => {
    expect(
      breakEnd(finished({ endTime: undefined, completed: false }))
    ).toBeUndefined();
  });
});

describe("breakRemainingMs", () => {
  it("is the full break the moment the session ends", () => {
    expect(breakRemainingMs(finished(), ENDED)).toBe(BREAK_MINUTES * MINUTE_MS);
  });

  /**
   * Derived from the stored `endTime`, so a tab reopened two minutes into a
   * break shows three left — nothing had to survive in memory.
   */
  it("is computed from the clock, not from elapsed ticks", () => {
    expect(breakRemainingMs(finished(), after(2))).toBe(3 * MINUTE_MS);
  });

  it("floors at zero rather than going negative", () => {
    expect(breakRemainingMs(finished(), after(90))).toBe(0);
  });
});

describe("breakStatus", () => {
  it("is running for the five minutes after a completed session", () => {
    expect(breakStatus(finished(), after(1))).toBe("running");
    expect(breakStatus(finished(), after(4.9))).toBe("running");
  });

  it("is over once the five minutes have passed", () => {
    expect(breakStatus(finished(), after(BREAK_MINUTES))).toBe("over");
  });

  /**
   * "Undo" of a sort: skipping writes `breakEndedAt`, and that has to outrank
   * the clock — otherwise a reload would drop the reader back into a break
   * they had already left.
   */
  it("is over for a break that was skipped, even with time left", () => {
    expect(breakStatus(finished({ breakEndedAt: after(1) }), after(2))).toBe(
      "over"
    );
  });

  /** An abandoned session ended early. There is nothing to recover from. */
  it("gives no break for an abandoned session", () => {
    expect(breakStatus(finished({ completed: false }), after(1))).toBe("none");
  });

  it("gives no break when nothing has finished yet", () => {
    expect(breakStatus(null, after(1))).toBe("none");
    expect(breakStatus(undefined, after(1))).toBe("none");
  });
});

describe("promptFor", () => {
  /**
   * The same break always shows the same prompt: a reload mid-break must not
   * swap the suggestion out from under someone halfway through following it.
   */
  it("is stable for a given session", () => {
    const session = finished({ id: 4 });

    expect(promptFor(session, "low")).toBe(promptFor(session, "low"));
  });

  it("steps through the pool across consecutive sessions", () => {
    const ids = [1, 2, 3, 4].map((id) => promptFor(finished({ id }), "low").id);

    expect(new Set(ids).size).toBeGreaterThan(1);
  });

  /**
   * Telling someone who has just said they are drained to go for a brisk walk
   * is the opposite of what this product promises.
   */
  it("offers a drained reader breathing or rest, never exercise", () => {
    for (let id = 1; id <= 24; id++) {
      const prompt = promptFor(finished({ id }), "low");
      expect(BREAK_CATEGORIES_FOR_ENERGY.low).toContain(prompt.category);
    }
  });

  it("offers movement on a high-energy day", () => {
    for (let id = 1; id <= 24; id++) {
      const prompt = promptFor(finished({ id }), "high");
      expect(BREAK_CATEGORIES_FOR_ENERGY.high).toContain(prompt.category);
    }
  });

  /** Unknown energy means unknown, never low. The whole pool stays eligible. */
  it("draws on everything when there is no check-in", () => {
    const ids = new Set(
      Array.from(
        { length: BREAK_PROMPTS.length },
        (_, i) => promptFor(finished({ id: i }), undefined).id
      )
    );

    expect(ids.size).toBe(BREAK_PROMPTS.length);
  });

  it("always returns a prompt, whatever the energy", () => {
    for (const energy of ["low", "medium", "high"] as const) {
      expect(promptFor(finished(), energy)).toBeDefined();
    }
  });
});

describe("break prompt data", () => {
  it("has no duplicate ids", () => {
    const ids = BREAK_PROMPTS.map((prompt) => prompt.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  /** A category no energy level can reach is a prompt nobody will ever see. */
  it("keeps every category reachable from some energy level", () => {
    const reachable = new Set(
      Object.values(BREAK_CATEGORIES_FOR_ENERGY).flat()
    );

    for (const prompt of BREAK_PROMPTS) {
      expect(reachable).toContain(prompt.category);
    }
  });

  it("suggests nothing longer than the break itself", () => {
    for (const prompt of BREAK_PROMPTS) {
      expect(prompt.minutes).toBeLessThanOrEqual(BREAK_MINUTES);
    }
  });
});

describe("a break clock that is a hair early", () => {
  /** Same cap as the session clock, for the same reason: 05:01 is not a thing. */
  it("never reports more break left than a break is long", () => {
    const early = new Date(ENDED.getTime() - 1);

    expect(breakRemainingMs(finished(), early)).toBe(BREAK_MINUTES * MINUTE_MS);
  });
});
