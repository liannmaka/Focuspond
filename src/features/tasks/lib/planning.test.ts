import { describe, expect, it } from "vitest";

import {
  addDays,
  carriedLabel,
  daysCarried,
  isCarriedOver,
  isSameDay,
  plannedForView,
  startOfDay,
  startOfToday,
  startOfTomorrow,
  viewFor,
  wasCompletedToday,
} from "./planning";

/**
 * A fixed "now" in the middle of a day. Every assertion passes it explicitly —
 * nothing here reads the real clock, so these tests behave the same at 23:59 as
 * at noon, which is exactly the bug class they exist to catch.
 */
const NOW = new Date(2026, 9, 20, 14, 30); // 20 Oct 2026, 14:30 local
const TODAY = new Date(2026, 9, 20);
const YESTERDAY = new Date(2026, 9, 19);
const TOMORROW = new Date(2026, 9, 21);

describe("startOfDay", () => {
  it("strips the time without mutating its argument", () => {
    const original = new Date(2026, 9, 20, 14, 30, 45, 123);
    const result = startOfDay(original);

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
    expect(original.getHours()).toBe(14);
  });
});

describe("addDays", () => {
  it("rolls over a month boundary", () => {
    const result = addDays(new Date(2026, 9, 31), 1);
    expect(result.getMonth()).toBe(10);
    expect(result.getDate()).toBe(1);
  });

  it("does not mutate its argument", () => {
    const original = new Date(2026, 9, 20);
    addDays(original, 5);
    expect(original.getDate()).toBe(20);
  });
});

describe("startOfToday / startOfTomorrow", () => {
  it("brackets the current day", () => {
    expect(startOfToday(NOW)).toEqual(TODAY);
    expect(startOfTomorrow(NOW)).toEqual(TOMORROW);
  });

  /** The boundary the whole model turns on. */
  it("treats one minute before midnight as still today", () => {
    const lateNight = new Date(2026, 9, 20, 23, 59);
    expect(startOfToday(lateNight)).toEqual(TODAY);
    expect(startOfTomorrow(lateNight)).toEqual(TOMORROW);
  });

  it("treats one minute after midnight as a new day", () => {
    const justAfter = new Date(2026, 9, 21, 0, 1);
    expect(startOfToday(justAfter)).toEqual(TOMORROW);
  });
});

describe("viewFor", () => {
  it("files an undated task in the backlog", () => {
    expect(viewFor(null, NOW)).toBe("backlog");
    expect(viewFor(undefined, NOW)).toBe("backlog");
  });

  it("files today's date under today", () => {
    expect(viewFor(TODAY, NOW)).toBe("today");
  });

  /** The rollover rule: an older date surfaces in Today, it does not vanish. */
  it("files a past date under today, not somewhere forgotten", () => {
    expect(viewFor(YESTERDAY, NOW)).toBe("today");
    expect(viewFor(new Date(2026, 8, 1), NOW)).toBe("today");
  });

  it("files a future date under week", () => {
    expect(viewFor(TOMORROW, NOW)).toBe("week");
    expect(viewFor(addDays(TODAY, 30), NOW)).toBe("week");
  });

  /** Exhaustive: nothing can be dated into a gap no view asks for. */
  it("always returns one of the three views", () => {
    const dates = [null, YESTERDAY, TODAY, TOMORROW, addDays(TODAY, 365)];
    for (const date of dates) {
      expect(["today", "week", "backlog"]).toContain(viewFor(date, NOW));
    }
  });

  it("moves a task from week to today when its day arrives", () => {
    const thursday = addDays(TODAY, 3);

    expect(viewFor(thursday, NOW)).toBe("week");
    expect(viewFor(thursday, new Date(2026, 9, 23, 9, 0))).toBe("today");
  });
});

describe("plannedForView", () => {
  it("dates a today task to the start of today", () => {
    expect(plannedForView("today", NOW)).toEqual(TODAY);
  });

  it("dates a week task a week out", () => {
    expect(plannedForView("week", NOW)).toEqual(new Date(2026, 9, 27));
  });

  it("leaves a backlog task undated", () => {
    expect(plannedForView("backlog", NOW)).toBeNull();
  });

  /** Round trip: what we store must land back in the view it came from. */
  it("round-trips through viewFor", () => {
    for (const view of ["today", "week", "backlog"] as const) {
      expect(viewFor(plannedForView(view, NOW), NOW)).toBe(view);
    }
  });
});

describe("isCarriedOver", () => {
  it("marks an unfinished task from a past day", () => {
    expect(
      isCarriedOver({ plannedFor: YESTERDAY, completed: false }, NOW)
    ).toBe(true);
  });

  it("does not mark today's own work", () => {
    expect(isCarriedOver({ plannedFor: TODAY, completed: false }, NOW)).toBe(
      false
    );
  });

  /** Finished is finished — a completed task is not outstanding. */
  it("never marks a completed task, however old", () => {
    expect(isCarriedOver({ plannedFor: YESTERDAY, completed: true }, NOW)).toBe(
      false
    );
  });

  it("never marks an undated task", () => {
    expect(isCarriedOver({ plannedFor: null, completed: false }, NOW)).toBe(
      false
    );
  });
});

describe("daysCarried", () => {
  it("counts whole days since the planned day", () => {
    expect(daysCarried({ plannedFor: YESTERDAY, completed: false }, NOW)).toBe(
      1
    );
    expect(
      daysCarried({ plannedFor: new Date(2026, 9, 17), completed: false }, NOW)
    ).toBe(3);
  });

  it("is zero for work planned today", () => {
    expect(daysCarried({ plannedFor: TODAY, completed: false }, NOW)).toBe(0);
  });

  it("is zero for anything not carried over", () => {
    expect(daysCarried({ plannedFor: YESTERDAY, completed: true }, NOW)).toBe(
      0
    );
    expect(daysCarried({ plannedFor: null, completed: false }, NOW)).toBe(0);
    expect(daysCarried({ plannedFor: TOMORROW, completed: false }, NOW)).toBe(
      0
    );
  });

  /** Rounding, not flooring — an hour lost to DST must not eat a whole day. */
  it("is unaffected by a clock shift within the day", () => {
    const lateEvening = new Date(2026, 9, 20, 23, 30);
    const earlyMorning = new Date(2026, 9, 20, 0, 30);

    expect(
      daysCarried({ plannedFor: YESTERDAY, completed: false }, lateEvening)
    ).toBe(1);
    expect(
      daysCarried({ plannedFor: YESTERDAY, completed: false }, earlyMorning)
    ).toBe(1);
  });
});

describe("carriedLabel", () => {
  const carried = (days: number) =>
    carriedLabel(
      { plannedFor: new Date(2026, 9, 20 - days), completed: false },
      NOW
    );

  it("says nothing for work that is not carried over", () => {
    expect(carriedLabel({ plannedFor: TODAY, completed: false }, NOW)).toEqual({
      kind: "none",
    });
    expect(
      carriedLabel({ plannedFor: YESTERDAY, completed: true }, NOW)
    ).toEqual({ kind: "none" });
  });

  it("names yesterday rather than its weekday", () => {
    expect(carried(1)).toEqual({ kind: "yesterday", days: 1 });
  });

  it("uses a weekday while weekday names are still unambiguous", () => {
    for (const days of [2, 3, 4, 5, 6]) {
      expect(carried(days).kind).toBe("weekday");
    }
  });

  /**
   * The boundary that matters. At 7 days the weekday is the *same as today's*,
   * so "Wed" could mean this week or last — only a date identifies it.
   */
  it("switches to a date once weekday names would repeat", () => {
    expect(carried(7).kind).toBe("date");
    expect(carried(8).kind).toBe("date");
    expect(carried(30).kind).toBe("date");
  });

  it("carries the planned day itself, at midnight", () => {
    const label = carried(3);
    expect(label.kind).toBe("weekday");
    if (label.kind === "weekday") {
      expect(label.date).toEqual(new Date(2026, 9, 17));
      expect(label.days).toBe(3);
    }
  });

  /** Each task names its own day — they do not collapse to one label. */
  it("gives different days different weekdays", () => {
    const labels = [2, 3, 5].map((d) => carried(d));
    const dates = labels.map((l) =>
      l.kind === "weekday" ? l.date.getDay() : -1
    );
    expect(new Set(dates).size).toBe(3);
  });
});

describe("wasCompletedToday", () => {
  it("counts a task finished today", () => {
    expect(
      wasCompletedToday(
        { completed: true, completedAt: new Date(2026, 9, 20, 9, 0) },
        NOW
      )
    ).toBe(true);
  });

  /**
   * Keyed on when it was finished, not when it was planned — clearing
   * yesterday's carried-over task is a win earned today.
   */
  it("counts yesterday's task finished today", () => {
    expect(
      wasCompletedToday(
        { completed: true, completedAt: new Date(2026, 9, 20, 10, 0) },
        NOW
      )
    ).toBe(true);
  });

  /** Stops old completions piling up in Today forever. */
  it("ignores a task finished on an earlier day", () => {
    expect(
      wasCompletedToday({ completed: true, completedAt: YESTERDAY }, NOW)
    ).toBe(false);
  });

  it("ignores an unfinished task", () => {
    expect(wasCompletedToday({ completed: false }, NOW)).toBe(false);
  });

  it("ignores a completed task with no timestamp", () => {
    expect(wasCompletedToday({ completed: true }, NOW)).toBe(false);
  });
});

describe("isSameDay", () => {
  it("is true across the whole of one day and false outside it", () => {
    expect(isSameDay(new Date(2026, 9, 20, 0, 0), NOW)).toBe(true);
    expect(isSameDay(new Date(2026, 9, 20, 23, 59, 59), NOW)).toBe(true);
    expect(isSameDay(new Date(2026, 9, 21, 0, 0), NOW)).toBe(false);
    expect(isSameDay(new Date(2026, 9, 19, 23, 59), NOW)).toBe(false);
  });

  it("is false for a missing date", () => {
    expect(isSameDay(null, NOW)).toBe(false);
    expect(isSameDay(undefined, NOW)).toBe(false);
  });
});
