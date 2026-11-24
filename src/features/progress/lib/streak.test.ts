import { describe, expect, it } from "vitest";

import { addDays, startOfDay } from "@/features/tasks/lib/planning";
import { activeDays, countsToday, currentStreak } from "./streak";

/** Midday, so nothing sits on a midnight boundary by accident. */
const NOW = new Date(2026, 10, 18, 12, 0);

/** Midday, `n` days before NOW. */
const daysAgo = (n: number) => addDays(NOW, -n);

/** The same local day as NOW, but late in the evening. */
const tonight = (hour: number) => new Date(2026, 10, 18, hour, 30);

describe("activeDays", () => {
  it("collapses several things on one day into one day", () => {
    const days = activeDays([tonight(9), tonight(14), tonight(22)]);

    expect(days.size).toBe(1);
  });

  it("keeps separate days separate", () => {
    expect(activeDays([daysAgo(0), daysAgo(1), daysAgo(2)]).size).toBe(3);
  });

  /**
   * Local midnight, not UTC. East of Greenwich a 23:30 session has a UTC date
   * of *tomorrow*, so a UTC key would file it under a day the reader had not
   * reached yet — and quietly break the streak they were in the middle of.
   */
  it("files a late-evening session under that evening", () => {
    const days = activeDays([tonight(23)]);

    expect(days.has(startOfDay(NOW).getTime())).toBe(true);
  });
});

describe("currentStreak", () => {
  it("is zero with nothing to count", () => {
    expect(currentStreak([], NOW)).toBe(0);
  });

  it("counts a single day today", () => {
    expect(currentStreak([daysAgo(0)], NOW)).toBe(1);
  });

  it("counts consecutive days", () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(3)];

    expect(currentStreak(dates, NOW)).toBe(4);
  });

  it("counts a day once however much happened on it", () => {
    const dates = [tonight(9), tonight(13), tonight(21), daysAgo(1)];

    expect(currentStreak(dates, NOW)).toBe(2);
  });

  it("stops at the first gap", () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(3), daysAgo(4)];

    expect(currentStreak(dates, NOW)).toBe(2);
  });

  it("ignores older activity entirely once the chain is broken", () => {
    const dates = [
      daysAgo(0),
      ...Array.from({ length: 20 }, (_, i) => daysAgo(i + 5)),
    ];

    expect(currentStreak(dates, NOW)).toBe(1);
  });

  /**
   * The decision that matters most on this page. A day that has not finished
   * cannot have been missed: with yesterday counted and today still empty, the
   * streak stands until midnight.
   *
   * Counting strictly back from today would show a `0` over breakfast after
   * twelve honest days — discouraging, and not true yet.
   */
  it("holds a streak open while today is still unspent", () => {
    const dates = [daysAgo(1), daysAgo(2), daysAgo(3)];

    expect(currentStreak(dates, NOW)).toBe(3);
  });

  it("counts today on top once today does count", () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(3)];

    expect(currentStreak(dates, NOW)).toBe(4);
  });

  /** Two days of silence is a real gap, not a grace period. */
  it("is over when neither today nor yesterday counts", () => {
    const dates = [daysAgo(2), daysAgo(3), daysAgo(4)];

    expect(currentStreak(dates, NOW)).toBe(0);
  });

  /**
   * A day is 23 or 25 hours across a daylight-saving boundary, so stepping by
   * a fixed 24 hours lands at 23:00 of the right day or 01:00 of the wrong
   * one — and the streak silently loses or doubles a day once or twice a year.
   *
   * **Where this actually bites:** only in a timezone that observes DST. This
   * project is developed in Africa/Lagos, where every day is 24 hours and a
   * 24-hour step looks correct, so locally this case passes either way. CI
   * runs the suite under `TZ=Europe/London` for exactly this reason — 25
   * October 2026 is the day the clocks go back there.
   */
  it("steps calendar days, not 24-hour blocks", () => {
    // Europe/London: clocks went back on 25 October 2026.
    const after = new Date(2026, 9, 27, 12, 0);
    const dates = [
      new Date(2026, 9, 27, 12, 0),
      new Date(2026, 9, 26, 12, 0),
      new Date(2026, 9, 25, 12, 0),
      new Date(2026, 9, 24, 12, 0),
    ];

    expect(currentStreak(dates, after)).toBe(4);
  });

  it("survives a chain that crosses a month end", () => {
    const after = new Date(2026, 11, 2, 12, 0);
    const dates = [
      new Date(2026, 11, 2, 9, 0),
      new Date(2026, 11, 1, 9, 0),
      new Date(2026, 10, 30, 9, 0),
      new Date(2026, 10, 29, 9, 0),
    ];

    expect(currentStreak(dates, after)).toBe(4);
  });

  /** A clock set forward, or a row from another device, must not inflate it. */
  it("is not extended by activity dated in the future", () => {
    const dates = [daysAgo(-3), daysAgo(-1), daysAgo(0)];

    expect(currentStreak(dates, NOW)).toBe(1);
  });

  it("takes dates in any order", () => {
    const dates = [daysAgo(2), daysAgo(0), daysAgo(3), daysAgo(1)];

    expect(currentStreak(dates, NOW)).toBe(4);
  });
});

describe("countsToday", () => {
  it("is true once something has happened today", () => {
    expect(countsToday([daysAgo(0)], NOW)).toBe(true);
  });

  it("is false on a day nothing has happened yet", () => {
    expect(countsToday([daysAgo(1)], NOW)).toBe(false);
  });

  it("is false with nothing at all", () => {
    expect(countsToday([], NOW)).toBe(false);
  });
});
