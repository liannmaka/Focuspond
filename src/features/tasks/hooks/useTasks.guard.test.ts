import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { db, taskDB } from "@/lib/db/indexedDB";
import { onWriteFailure, type WriteFailure } from "@/lib/db/writeGuard";
import { startOfToday } from "../lib/planning";
import {
  addTask,
  deleteTask,
  setFrog,
  toggleTask,
  updateTask,
} from "./useTasks";

/**
 * Every task mutation has to go through the guard, not just exist next to it.
 * A mutation added later that calls `taskDB` directly would fail silently in
 * exactly the way the guard was built to prevent, and nothing else would
 * notice — so each one is checked here against a storage layer that refuses.
 */
let seen: WriteFailure[] = [];
let stop = () => {};

beforeEach(async () => {
  await db.tasks.clear();
  seen = [];
  stop = onWriteFailure((failure) => seen.push(failure));
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  stop();
  vi.restoreAllMocks();
});

const refuse = (method: keyof typeof taskDB) =>
  vi.spyOn(taskDB, method).mockRejectedValue(new Error("storage refused"));

const seed = () =>
  taskDB.add({
    title: "Ship the plan",
    plannedFor: startOfToday(),
    energyRequired: "high",
    estimatedMinutes: 25,
  });

describe("task mutations when storage refuses", () => {
  it("reports a failed add instead of throwing", async () => {
    refuse("add");

    await expect(
      addTask({
        title: "New",
        plannedFor: startOfToday(),
        energyRequired: "low",
        estimatedMinutes: 25,
      })
    ).resolves.toBeUndefined();

    expect(seen.map((f) => f.operation)).toEqual(["task.add"]);
  });

  it("reports a failed completion", async () => {
    const id = await seed();
    refuse("setCompleted");

    await expect(toggleTask(id, true)).resolves.toBeUndefined();

    expect(seen.map((f) => f.operation)).toEqual(["task.complete"]);
  });

  it("reports a failed delete", async () => {
    const id = await seed();
    refuse("delete");

    await expect(deleteTask(id)).resolves.toBeUndefined();

    expect(seen.map((f) => f.operation)).toEqual(["task.delete"]);
  });

  it("reports a failed edit", async () => {
    const id = await seed();
    refuse("update");

    await expect(updateTask(id, { title: "Changed" })).resolves.toBeUndefined();

    expect(seen.map((f) => f.operation)).toEqual(["task.update"]);
  });

  it("reports a failed promotion to frog", async () => {
    const id = await seed();
    refuse("setFrog");

    await expect(setFrog(id)).resolves.toBeUndefined();

    expect(seen.map((f) => f.operation)).toEqual(["task.frog"]);
  });

  it("says nothing when the write goes through", async () => {
    const id = await seed();

    await toggleTask(id, true);

    expect(seen).toHaveLength(0);
    expect((await taskDB.get(id))?.completed).toBe(true);
  });
});
