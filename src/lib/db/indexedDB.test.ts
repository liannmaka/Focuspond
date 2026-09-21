// A real IndexedDB implementation for Node — jsdom ships none, and mocking
// Dexie would test the mock rather than the schema.
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";

import { db, taskDB, moodDB } from "./indexedDB";

beforeEach(async () => {
  await db.tasks.clear();
  await db.moods.clear();
  await db.pomodoros.clear();
});

describe("taskDB", () => {
  it("round-trips a task through storage", async () => {
    const id = await taskDB.add({
      title: "Ship the plan",
      group: "today",
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
      group: "today",
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
      group: "today",
      energyRequired: "low",
      estimatedMinutes: 15,
    });
    await taskDB.add({
      title: "Backlog thing",
      group: "backlog",
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
      group: "today",
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
      group: "today",
      energyRequired: "high",
      estimatedMinutes: 25,
    });
    const second = await taskDB.add({
      title: "Second",
      group: "today",
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
      group: "today",
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
});
