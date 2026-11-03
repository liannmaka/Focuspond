// A real IndexedDB implementation for Node — jsdom ships none, and mocking
// Dexie would test the mock rather than the schema.
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";

import {
  plannedForView,
  startOfToday,
  viewFor,
} from "@/features/tasks/lib/planning";
import type { StoredTask } from "./indexedDB";
import {
  db,
  taskDB,
  moodDB,
  migrateToPlannedFor,
  staleFrogIds,
} from "./indexedDB";

/** Fixed clock — midday, so no assertion sits on a midnight boundary. */
const NOW = new Date(2026, 9, 20, 12, 0);

beforeEach(async () => {
  await db.tasks.clear();
  await db.moods.clear();
  await db.pomodoros.clear();
});

/** Local midnight, `days` ago. */
const daysAgo = (days: number) => {
  const date = startOfToday();
  date.setDate(date.getDate() - days);
  return date;
};

describe("migrateToPlannedFor (v2 → v3)", () => {
  /** Real data runs through this once. Getting it wrong loses tasks. */
  it("dates a Today task to today and drops the group", () => {
    const row: Record<string, unknown> = { title: "x", group: "today" };
    migrateToPlannedFor(row, NOW);

    expect(row.plannedFor).toEqual(startOfToday(NOW));
    expect(row.group).toBeUndefined();
  });

  it("dates a Week task a week out", () => {
    const row: Record<string, unknown> = { title: "x", group: "week" };
    migrateToPlannedFor(row, NOW);

    expect(row.plannedFor).toEqual(plannedForView("week", NOW));
  });

  it("leaves a Backlog task undated", () => {
    const row: Record<string, unknown> = { title: "x", group: "backlog" };
    migrateToPlannedFor(row, NOW);

    expect(row.plannedFor).toBeNull();
  });

  /**
   * A row with a missing or unrecognised group lands in Today rather than the
   * backlog: it was visible before, and quietly filing it somewhere nobody
   * checks would be a worse failure than a date that is slightly early.
   */
  it("keeps an unrecognised or missing group visible in Today", () => {
    for (const group of [undefined, "other", "completed", ""]) {
      const row: Record<string, unknown> = { title: "x", group };
      migrateToPlannedFor(row, NOW);
      expect(row.plannedFor).toEqual(startOfToday(NOW));
    }
  });

  it("preserves every other field on the row", () => {
    const row: Record<string, unknown> = {
      id: 7,
      title: "Ship it",
      group: "today",
      energyRequired: "high",
      estimatedMinutes: 50,
      focusBlocks: 2,
      completed: true,
      synced: false,
    };
    migrateToPlannedFor(row, NOW);

    expect(row.id).toBe(7);
    expect(row.title).toBe("Ship it");
    expect(row.energyRequired).toBe("high");
    expect(row.focusBlocks).toBe(2);
    expect(row.completed).toBe(true);
    expect(row.synced).toBe(false);
  });

  /** The migrated row must land in the list its label promised. */
  it("round-trips every group through viewFor", () => {
    for (const group of ["today", "week", "backlog"] as const) {
      const row: Record<string, unknown> = { group };
      migrateToPlannedFor(row, NOW);
      expect(viewFor(row.plannedFor as Date | null, NOW)).toBe(group);
    }
  });
});

describe("staleFrogIds (v3 → v4)", () => {
  const row = (over: Partial<StoredTask> = {}): StoredTask =>
    ({
      id: 1,
      title: "Task",
      completed: false,
      isFrog: false,
      plannedFor: startOfToday(NOW),
      createdAt: NOW,
      ...over,
    }) as StoredTask;

  it("leaves a day with one eaten frog alone", () => {
    const eaten = row({
      id: 1,
      isFrog: true,
      completed: true,
      completedAt: NOW,
    });

    expect(staleFrogIds([eaten, row({ id: 2 })], NOW)).toEqual([]);
  });

  it("leaves a frog that is still in play alone", () => {
    expect(staleFrogIds([row({ id: 1, isFrog: true })], NOW)).toEqual([]);
  });

  /** The state the row-menu bug wrote: eaten and open, same day. */
  it("demotes the open pretender when a frog was already eaten", () => {
    const eaten = row({
      id: 1,
      isFrog: true,
      completed: true,
      completedAt: NOW,
    });
    const open = row({ id: 2, isFrog: true });

    expect(staleFrogIds([eaten, open], NOW)).toEqual([2]);
  });

  /** A win is never rewritten — only the badge that was not earned. */
  it("never demotes the eaten frog itself", () => {
    const eaten = row({
      id: 1,
      isFrog: true,
      completed: true,
      completedAt: NOW,
    });

    expect(
      staleFrogIds([eaten, row({ id: 2, isFrog: true })], NOW)
    ).not.toContain(1);
  });

  /** Yesterday's win does not settle today. */
  it("ignores a frog eaten on an earlier day", () => {
    const yesterday = row({
      id: 1,
      isFrog: true,
      completed: true,
      completedAt: new Date(2026, 9, 19, 12, 0),
    });

    expect(
      staleFrogIds([yesterday, row({ id: 2, isFrog: true })], NOW)
    ).toEqual([]);
  });

  it("runs on real rows and clears the flag", async () => {
    const eatenId = await taskDB.add({
      title: "Ate this",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 50,
    });
    await taskDB.setFrog(eatenId);
    await taskDB.setCompleted(eatenId, true);

    // Written directly: the guarded UI can no longer reach this state.
    const staleId = await taskDB.add({
      title: "Stale pick",
      plannedFor: startOfToday(),
      energyRequired: "medium",
      estimatedMinutes: 25,
    });
    await db.tasks.update(staleId, { isFrog: true });

    const stale = staleFrogIds(await db.tasks.toArray());
    expect(stale).toEqual([staleId]);

    await Promise.all(
      stale.map((id) => db.tasks.update(id, { isFrog: false }))
    );

    expect((await db.tasks.get(staleId))!.isFrog).toBe(false);
    expect((await db.tasks.get(eatenId))!.isFrog).toBe(true);
  });
});

describe("taskDB — planning by date", () => {
  /**
   * The point of M2.5. A stored `group` string never changed, so an unfinished
   * task filed under Today in March was still under Today in October without
   * anything having "rolled over". A past date surfaces in Today instead.
   */
  it("carries an unfinished task from an earlier day into Today", async () => {
    await taskDB.add({
      title: "Yesterday's leftover",
      plannedFor: daysAgo(1),
      energyRequired: "medium",
      estimatedMinutes: 25,
    });

    const today = await taskDB.getByGroup("today");
    expect(today).toHaveLength(1);
    expect(today[0].title).toBe("Yesterday's leftover");
  });

  it("puts carried-over work above today's own", async () => {
    await taskDB.add({
      title: "Planned today",
      plannedFor: startOfToday(),
      energyRequired: "low",
      estimatedMinutes: 15,
    });
    await taskDB.add({
      title: "From three days ago",
      plannedFor: daysAgo(3),
      energyRequired: "low",
      estimatedMinutes: 15,
    });

    const today = await taskDB.getByGroup("today");
    expect(today.map((task) => task.title)).toEqual([
      "From three days ago",
      "Planned today",
    ]);
  });

  /**
   * Without this, every completion ever would accumulate in Today, because a
   * past date always matches "today or earlier".
   */
  it("does not let old completions pile up in Today", async () => {
    const id = await taskDB.add({
      title: "Finished last week",
      plannedFor: daysAgo(7),
      energyRequired: "low",
      estimatedMinutes: 15,
    });
    await taskDB.setCompleted(id, true);
    await db.tasks.update(id, { completedAt: daysAgo(7) });

    expect(await taskDB.getByGroup("today")).toHaveLength(0);
    expect(await taskDB.getDoneToday("today")).toHaveLength(0);
  });

  /** Clearing yesterday's leftover is a win earned *today*. */
  it("counts a carried-over task finished today as done today", async () => {
    const id = await taskDB.add({
      title: "Yesterday's leftover",
      plannedFor: daysAgo(1),
      energyRequired: "low",
      estimatedMinutes: 15,
    });
    await taskDB.setCompleted(id, true);

    const doneToday = await taskDB.getDoneToday("today");
    expect(doneToday).toHaveLength(1);
    expect(doneToday[0].title).toBe("Yesterday's leftover");
    expect(await taskDB.getByGroup("today")).toHaveLength(0);
  });

  /**
   * Regression. Promoting a task from Backlog or Upcoming used to set `isFrog`
   * on a row the Today card queries past — so the flag was written, the real
   * frog was demoted, and the card silently showed something else instead.
   */
  it("brings a backlog task into Today when it becomes the frog", async () => {
    const id = await taskDB.add({
      title: "Someday thing",
      plannedFor: null,
      energyRequired: "high",
      estimatedMinutes: 50,
    });
    expect(await taskDB.getByGroup("backlog")).toHaveLength(1);

    await taskDB.setFrog(id);

    const today = await taskDB.getByGroup("today");
    expect(today).toHaveLength(1);
    expect(today[0].title).toBe("Someday thing");
    expect(today[0].isFrog).toBe(true);
    expect(await taskDB.getByGroup("backlog")).toHaveLength(0);
  });

  it("brings an upcoming task into Today when it becomes the frog", async () => {
    const id = await taskDB.add({
      title: "Next week thing",
      plannedFor: plannedForView("week"),
      energyRequired: "high",
      estimatedMinutes: 50,
    });

    await taskDB.setFrog(id);

    expect(await taskDB.getByGroup("week")).toHaveLength(0);
    expect(await taskDB.getByGroup("today")).toHaveLength(1);
  });

  /** The frog the card shows must be the frog the database holds. */
  it("leaves exactly one frog, and it is always in Today", async () => {
    const todayTask = await taskDB.add({
      title: "Planned today",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 50,
    });
    const backlogTask = await taskDB.add({
      title: "From the backlog",
      plannedFor: null,
      energyRequired: "high",
      estimatedMinutes: 50,
    });

    await taskDB.setFrog(todayTask);
    await taskDB.setFrog(backlogTask);

    const frogs = await taskDB.getFrogTasks();
    expect(frogs).toHaveLength(1);
    expect(frogs[0].title).toBe("From the backlog");
    expect(await taskDB.getByGroup("today")).toHaveLength(2);
  });

  /**
   * A completed frog keeps its badge. It *was* the frog and it got eaten —
   * that record is what the card's "Frog eaten" state reads, and what M6's
   * streaks will count.
   */
  it("does not demote a frog that has already been eaten", async () => {
    const eaten = await taskDB.add({
      title: "Ate this",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 50,
    });
    await taskDB.setFrog(eaten);
    await taskDB.setCompleted(eaten, true);

    const next = await taskDB.add({
      title: "Picked after",
      plannedFor: startOfToday(),
      energyRequired: "low",
      estimatedMinutes: 15,
    });
    await taskDB.setFrog(next);

    expect((await db.tasks.get(eaten))!.isFrog).toBe(true);
    expect((await db.tasks.get(next))!.isFrog).toBe(true);
    // getFrogTasks only reports frogs still in play.
    expect(await taskDB.getFrogTasks()).toHaveLength(1);
  });

  /**
   * The invariant from the other direction. `setFrog` pulls a task into Today;
   * rescheduling could push it back out while leaving `isFrog` set, and the
   * card would then promote an unrelated task — the same failure as promoting
   * from Backlog, mirrored.
   */
  it("demotes the frog when it is moved off today", async () => {
    const id = await taskDB.add({
      title: "My frog",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 50,
    });
    await taskDB.setFrog(id);

    await taskDB.update(id, { plannedFor: plannedForView("week") });

    expect((await db.tasks.get(id))!.isFrog).toBe(false);
    expect(await taskDB.getFrogTasks()).toHaveLength(0);
  });

  it("demotes the frog when it is sent to the backlog", async () => {
    const id = await taskDB.add({
      title: "My frog",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 50,
    });
    await taskDB.setFrog(id);

    await taskDB.update(id, { plannedFor: null });

    expect((await db.tasks.get(id))!.isFrog).toBe(false);
  });

  /** Editing a title must not quietly un-frog the task. */
  it("leaves the frog alone when the patch does not touch the date", async () => {
    const id = await taskDB.add({
      title: "My frog",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 50,
    });
    await taskDB.setFrog(id);

    await taskDB.update(id, { title: "Renamed", estimatedMinutes: 15 });

    expect((await db.tasks.get(id))!.isFrog).toBe(true);
  });

  /** "Twice": moving it away and back must not silently restore the badge. */
  it("does not restore the frog badge on the way back to today", async () => {
    const id = await taskDB.add({
      title: "My frog",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 50,
    });
    await taskDB.setFrog(id);

    await taskDB.update(id, { plannedFor: plannedForView("week") });
    await taskDB.update(id, { plannedFor: startOfToday() });

    // Back in Today, but no longer the frog — the reader has to pick it again.
    expect((await db.tasks.get(id))!.isFrog).toBe(false);
    expect(await taskDB.getByGroup("today")).toHaveLength(1);
  });

  it("does not move a task already dated today", async () => {
    const id = await taskDB.add({
      title: "Planned today",
      plannedFor: startOfToday(),
      energyRequired: "low",
      estimatedMinutes: 15,
    });

    await taskDB.setFrog(id);

    expect((await db.tasks.get(id))!.plannedFor).toEqual(startOfToday());
  });

  it("keeps an undated task in the backlog, never in Today", async () => {
    await taskDB.add({
      title: "Someday",
      plannedFor: null,
      energyRequired: "low",
      estimatedMinutes: 15,
    });

    expect(await taskDB.getByGroup("backlog")).toHaveLength(1);
    expect(await taskDB.getByGroup("today")).toHaveLength(0);
    expect(await taskDB.getByGroup("week")).toHaveLength(0);
  });

  it("files a future date under week until its day arrives", async () => {
    await taskDB.add({
      title: "Next week",
      plannedFor: plannedForView("week"),
      energyRequired: "high",
      estimatedMinutes: 50,
    });

    expect(await taskDB.getByGroup("week")).toHaveLength(1);
    expect(await taskDB.getByGroup("today")).toHaveLength(0);
  });

  /** Every task lands in exactly one list — nothing can become invisible. */
  it("places every task in exactly one view", async () => {
    await taskDB.add({
      title: "a",
      plannedFor: daysAgo(2),
      energyRequired: "low",
      estimatedMinutes: 15,
    });
    await taskDB.add({
      title: "b",
      plannedFor: startOfToday(),
      energyRequired: "low",
      estimatedMinutes: 15,
    });
    await taskDB.add({
      title: "c",
      plannedFor: plannedForView("week"),
      energyRequired: "low",
      estimatedMinutes: 15,
    });
    await taskDB.add({
      title: "d",
      plannedFor: null,
      energyRequired: "low",
      estimatedMinutes: 15,
    });

    const counts = await Promise.all(
      (["today", "week", "backlog"] as const).map(
        async (view) => (await taskDB.getByGroup(view)).length
      )
    );

    expect(counts.reduce((a, b) => a + b, 0)).toBe(4);
  });
});

describe("taskDB", () => {
  it("round-trips a task through storage", async () => {
    const id = await taskDB.add({
      title: "Ship the plan",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 50,
    });

    const [task] = await taskDB.getByGroup("today");

    expect(task.id).toBe(id);
    expect(task.title).toBe("Ship the plan");
    expect(task.completed).toBe(false);
    expect(task.createdAt).toBeInstanceOf(Date);
  });

  it("derives focus blocks from the estimate", async () => {
    await taskDB.add({
      title: "Long one",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 50,
    });

    const [task] = await taskDB.getByGroup("today");
    expect(task.focusBlocks).toBe(2);
    expect(task.focusBlocksDone).toBe(0);
  });

  it("keeps groups separate", async () => {
    await taskDB.add({
      title: "Today thing",
      plannedFor: startOfToday(),
      energyRequired: "low",
      estimatedMinutes: 15,
    });
    await taskDB.add({
      title: "Backlog thing",
      plannedFor: null,
      energyRequired: "low",
      estimatedMinutes: 15,
    });

    expect(await taskDB.getByGroup("today")).toHaveLength(1);
    expect(await taskDB.getByGroup("backlog")).toHaveLength(1);
    expect((await taskDB.getByGroup("today"))[0].title).toBe("Today thing");
  });

  /**
   * The previous one-way `complete()` could not express unchecking, which the
   * Completed list needs.
   */
  it("moves a task between open and completed, in both directions", async () => {
    const id = await taskDB.add({
      title: "Ship the plan",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 25,
    });

    await taskDB.setCompleted(id, true);

    expect(await taskDB.getByGroup("today")).toHaveLength(0);
    const completed = await taskDB.getCompleted();
    expect(completed).toHaveLength(1);
    expect(completed[0].completedAt).toBeInstanceOf(Date);

    await taskDB.setCompleted(id, false);

    expect(await taskDB.getByGroup("today")).toHaveLength(1);
    expect(await taskDB.getCompleted()).toHaveLength(0);
  });

  it("promotes one frog at a time", async () => {
    const first = await taskDB.add({
      title: "First",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 25,
    });
    const second = await taskDB.add({
      title: "Second",
      plannedFor: startOfToday(),
      energyRequired: "high",
      estimatedMinutes: 25,
    });

    await taskDB.setFrog(first);
    await taskDB.setFrog(second);

    const frogs = await taskDB.getFrogTasks();
    expect(frogs).toHaveLength(1);
    expect(frogs[0].id).toBe(second);
  });

  it("deletes a task", async () => {
    const id = await taskDB.add({
      title: "Temporary",
      plannedFor: startOfToday(),
      energyRequired: "low",
      estimatedMinutes: 15,
    });

    await taskDB.delete(id);
    expect(await taskDB.getByGroup("today")).toHaveLength(0);
  });
});

describe("moodDB", () => {
  /**
   * The seam the whole product premise runs through: M2's `useTodayEnergy()`
   * reads this back to decide which task suits the day.
   */
  it("reads back today's check-in", async () => {
    await moodDB.add({
      level: "low",
      label: "Tired",
      energyLevel: "low",
    });

    const today = await moodDB.getToday();
    expect(today?.energyLevel).toBe("low");
    expect(today?.label).toBe("Tired");
  });

  it("returns undefined when nothing was recorded today", async () => {
    expect(await moodDB.getToday()).toBeUndefined();
  });

  /**
   * Regression: this previously used `.first()`, so a second check-in was
   * silently ignored and the app reported the morning's mood all day. Every
   * other mood test writes a single row, where first and last are identical —
   * which is exactly why nothing caught it.
   */
  it("reflects the most recent check-in, not the first", async () => {
    await moodDB.add({ level: "low", label: "Tired", energyLevel: "low" });
    await moodDB.add({
      level: "very-high",
      label: "Energized",
      energyLevel: "high",
    });

    const today = await moodDB.getToday();
    expect(today?.label).toBe("Energized");
    expect(today?.energyLevel).toBe("high");
  });

  it("keeps every check-in, so the day's history survives", async () => {
    await moodDB.add({ level: "low", label: "Tired", energyLevel: "low" });
    await moodDB.add({ level: "high", label: "Good", energyLevel: "high" });
    await moodDB.add({ level: "medium", label: "Okay", energyLevel: "medium" });

    expect(await moodDB.getTodayMoods()).toHaveLength(3);
  });
});
