import { describe, expect, it } from "vitest";

import type { EnergyLevel } from "@/features/mood/constants/moods";
import {
  eatenFrog,
  energyFits,
  energyRank,
  energyTagKey,
  focusBlocksFor,
  frogState,
  rankCandidates,
  suggestFrog,
} from "./taskDisplay";

/** Minimal rankable task. Day N of an arbitrary month, for stable ordering. */
const task = (
  title: string,
  energyRequired: EnergyLevel,
  estimatedMinutes: number,
  day: number,
  isFrog = false
) => ({
  title,
  energyRequired,
  estimatedMinutes,
  isFrog,
  createdAt: new Date(2026, 8, day),
});

const titles = (tasks: { title: string }[]) => tasks.map((t) => t.title);

describe("focusBlocksFor", () => {
  it("rounds a partial block up — a 30-minute task needs two sittings", () => {
    expect(focusBlocksFor(30)).toBe(2);
    expect(focusBlocksFor(26)).toBe(2);
  });

  it("maps exact multiples without inflating them", () => {
    expect(focusBlocksFor(25)).toBe(1);
    expect(focusBlocksFor(50)).toBe(2);
  });

  it("never returns zero — a five-minute task is still one sitting", () => {
    expect(focusBlocksFor(5)).toBe(1);
    expect(focusBlocksFor(0)).toBe(1);
  });
});

describe("energyTagKey", () => {
  it("namespaces under `energy.` so the catalog owns the copy", () => {
    expect(energyTagKey("high")).toBe("energy.high");
    expect(energyTagKey("low")).toBe("energy.low");
  });
});

describe("energyRank", () => {
  it("orders low < medium < high", () => {
    expect(energyRank("low")).toBeLessThan(energyRank("medium"));
    expect(energyRank("medium")).toBeLessThan(energyRank("high"));
  });

  /**
   * A task fits when it demands no more than the reader has. Pinned here so the
   * ordering can't silently flip.
   */
  it("lets a lighter task fit a higher energy, but not the reverse", () => {
    expect(energyRank("low") <= energyRank("high")).toBe(true);
    expect(energyRank("high") <= energyRank("low")).toBe(false);
  });
});

describe("energyFits", () => {
  it("accepts a task that demands the same or less than the reader has", () => {
    expect(energyFits("low", "low")).toBe(true);
    expect(energyFits("low", "high")).toBe(true);
    expect(energyFits("medium", "high")).toBe(true);
  });

  it("rejects deep work on a tired day", () => {
    expect(energyFits("high", "low")).toBe(false);
    expect(energyFits("medium", "low")).toBe(false);
  });
});

describe("rankCandidates", () => {
  it("puts tasks that fit today's energy ahead of ones that don't", () => {
    const tasks = [
      task("deep thing", "high", 50, 1),
      task("light thing", "low", 15, 2),
    ];

    expect(titles(rankCandidates(tasks, "low"))).toEqual([
      "light thing",
      "deep thing",
    ]);
  });

  it("prefers shorter tasks on a low-energy day", () => {
    const tasks = [
      task("long errand", "low", 50, 1),
      task("quick errand", "low", 15, 2),
    ];

    expect(titles(rankCandidates(tasks, "low"))).toEqual([
      "quick errand",
      "long errand",
    ]);
  });

  it("prefers the heaviest work on a high-energy day", () => {
    const tasks = [
      task("light thing", "low", 15, 1),
      task("deep thing", "high", 50, 2),
    ];

    expect(titles(rankCandidates(tasks, "high"))).toEqual([
      "deep thing",
      "light thing",
    ]);
  });

  it("falls back to oldest-first when energy demand ties", () => {
    const tasks = [
      task("newer", "medium", 25, 5),
      task("older", "medium", 25, 1),
    ];

    expect(titles(rankCandidates(tasks, "high"))).toEqual(["older", "newer"]);
  });

  /** No mood recorded is not the same as low energy — it means don't guess. */
  it("does not apply the fit rule when no mood is recorded", () => {
    const tasks = [
      task("light thing", "low", 15, 1),
      task("deep thing", "high", 50, 2),
    ];

    expect(titles(rankCandidates(tasks))).toEqual([
      "deep thing",
      "light thing",
    ]);
  });

  it("does not mutate the array it is given", () => {
    const tasks = [task("b", "low", 15, 2), task("a", "high", 50, 1)];
    const before = titles(tasks);

    rankCandidates(tasks, "high");

    expect(titles(tasks)).toEqual(before);
  });
});

describe("frogState", () => {
  const done = (title: string) => ({
    ...task(title, "high", 50, 1),
    completed: true,
  });
  const open = (title: string, isFrog = false) => ({
    ...task(title, "high", 50, 1, isFrog),
    completed: false,
  });

  it("says nothing when today is empty", () => {
    expect(frogState([], [], "high")).toEqual({ kind: "none" });
  });

  /**
   * The bug this type exists to prevent: with no explicit pick, the card used
   * to render the top-ranked task exactly like a chosen one.
   */
  it("marks an unchosen task as a suggestion, not a choice", () => {
    const state = frogState([open("Write the proposal")], [], "high");

    expect(state.kind).toBe("suggested");
    if (state.kind === "suggested") {
      expect(state.frog.title).toBe("Write the proposal");
    }
  });

  it("marks an explicitly picked task as chosen", () => {
    const state = frogState(
      [open("Not picked"), open("Picked", true)],
      [],
      "high"
    );

    expect(state.kind).toBe("chosen");
    if (state.kind === "chosen") expect(state.frog.title).toBe("Picked");
  });

  /**
   * Finishing the frog is the day's win. The card must not quietly hand over
   * the next task as a replacement — that turns a win into a treadmill.
   */
  it("reports the win when today's frog has been eaten", () => {
    const eaten = { ...done("Ate this"), isFrog: true };
    const state = frogState([open("Something else")], [eaten], "high");

    expect(state.kind).toBe("eaten");
    if (state.kind === "eaten") expect(state.frog.title).toBe("Ate this");
  });

  it("does not suggest a replacement once the frog is eaten", () => {
    const eaten = { ...done("Ate this"), isFrog: true };
    const state = frogState([open("Tempting")], [eaten], "high");

    expect(state.kind).not.toBe("suggested");
  });

  /**
   * The disagreement behind the row-menu bug. A day can hold both an eaten
   * frog and an open one — the pre-guard build could promote after eating, and
   * `setFrog` spares completed frogs so a win keeps its badge. This used to
   * answer "chosen", while every surface asking "was a frog eaten today?"
   * answered yes, so the card offered a swap that no list would honour.
   *
   * The eaten frog wins: it is the day's record, and the day is settled.
   */
  it("stays eaten when a stale open pick sits beside the finished frog", () => {
    const eaten = { ...done("Ate this"), isFrog: true };
    const state = frogState([open("Stale pick", true)], [eaten], "high");

    expect(state.kind).toBe("eaten");
    if (state.kind === "eaten") expect(state.frog.title).toBe("Ate this");
  });

  /**
   * The cross-surface check. Four of the last six frog bugs were one rule read
   * two ways, so this asserts the two readings agree on every combination: the
   * card is in its terminal state exactly when the promote affordances are
   * hidden. Neither surface can change its mind alone.
   */
  it("agrees with the promote affordances about whether the day is settled", () => {
    const eaten = { ...done("Ate this"), isFrog: true };
    const cases = [
      { open: [], doneToday: [] },
      { open: [open("Just a task")], doneToday: [] },
      { open: [open("Picked", true)], doneToday: [] },
      { open: [], doneToday: [eaten] },
      { open: [open("Tempting")], doneToday: [eaten] },
      { open: [open("Stale pick", true)], doneToday: [eaten] },
      { open: [open("Something")], doneToday: [done("Not the frog")] },
    ];

    for (const { open: openTasks, doneToday } of cases) {
      const settled = frogState(openTasks, doneToday, "high").kind === "eaten";
      expect(settled).toBe(eatenFrog(doneToday) !== undefined);
    }
  });

  it("falls back to a suggestion when a completed task was never the frog", () => {
    const state = frogState(
      [open("Still open")],
      [done("Just a task")],
      "high"
    );

    expect(state.kind).toBe("suggested");
  });
});

describe("suggestFrog", () => {
  it("returns undefined when there is nothing to suggest", () => {
    expect(suggestFrog([], "high")).toBeUndefined();
  });

  /** The reader's own choice outranks any suggestion we would make. */
  it("honours an explicitly chosen frog over a better-fitting task", () => {
    const tasks = [
      task("light thing", "low", 15, 2),
      task("chosen deep thing", "high", 50, 1, true),
    ];

    expect(suggestFrog(tasks, "low")?.title).toBe("chosen deep thing");
  });

  it("suggests an energy-appropriate task when nothing is chosen", () => {
    const tasks = [
      task("deep thing", "high", 50, 1),
      task("light thing", "low", 15, 2),
    ];

    expect(suggestFrog(tasks, "low")?.title).toBe("light thing");
    expect(suggestFrog(tasks, "high")?.title).toBe("deep thing");
  });
});
