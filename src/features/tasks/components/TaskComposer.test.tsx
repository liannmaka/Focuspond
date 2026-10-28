// Real IndexedDB — these assert on what actually lands in storage, which is
// the whole risk in an edit form: quietly dropping a field nobody looks at.
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";

import { renderWithIntl, screen } from "@/test/renderWithIntl";
import { db, taskDB } from "@/lib/db/indexedDB";
import { startOfToday } from "../lib/planning";
import TaskComposer from "./TaskComposer";

beforeEach(async () => {
  await db.tasks.clear();
});

const seed = async (overrides = {}) => {
  const id = await taskDB.add({
    title: "Original title",
    plannedFor: startOfToday(),
    energyRequired: "high",
    estimatedMinutes: 50,
  });
  await db.tasks.update(id, overrides);
  return (await db.tasks.get(id))!;
};

describe("TaskComposer — creating", () => {
  it("writes a new task into the chosen view", async () => {
    renderWithIntl(
      <TaskComposer
        group="backlog"
        onDone={() => {}}
      />
    );

    await userEvent.type(
      screen.getByPlaceholderText("What needs doing?"),
      "Something new"
    );
    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    const [task] = await taskDB.getByGroup("backlog");
    expect(task.title).toBe("Something new");
    expect(task.plannedFor).toBeNull();
  });
});

describe("TaskComposer — editing", () => {
  it("prefills with the task's current values", async () => {
    const task = await seed();

    renderWithIntl(
      <TaskComposer
        group="today"
        task={task}
        onDone={() => {}}
      />
    );

    expect(screen.getByPlaceholderText("What needs doing?")).toHaveValue(
      "Original title"
    );
    expect(screen.getByRole("button", { name: "Deep work" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "50m" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("saves a corrected title", async () => {
    const task = await seed();

    renderWithIntl(
      <TaskComposer
        group="today"
        task={task}
        onDone={() => {}}
      />
    );

    const input = screen.getByPlaceholderText("What needs doing?");
    await userEvent.clear(input);
    await userEvent.type(input, "Fixed title");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect((await db.tasks.get(task.id!))!.title).toBe("Fixed title");
  });

  /** A task edited from 50 to 15 minutes must stop claiming two focus blocks. */
  it("recomputes focus blocks when the estimate changes", async () => {
    const task = await seed();
    expect(task.focusBlocks).toBe(2);

    renderWithIntl(
      <TaskComposer
        group="today"
        task={task}
        onDone={() => {}}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "15m" }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    const saved = (await db.tasks.get(task.id!))!;
    expect(saved.estimatedMinutes).toBe(15);
    expect(saved.focusBlocks).toBe(1);
  });

  /**
   * The real risk of a partial-update form. Fixing a typo must not un-frog the
   * task, throw away blocks already worked, move it to another day, or reset
   * when it was created.
   */
  it("leaves every field it does not own untouched", async () => {
    const task = await seed({ isFrog: true, focusBlocksDone: 3 });
    const createdAt = task.createdAt;
    const plannedFor = task.plannedFor;

    renderWithIntl(
      <TaskComposer
        group="today"
        task={task}
        onDone={() => {}}
      />
    );

    const input = screen.getByPlaceholderText("What needs doing?");
    await userEvent.clear(input);
    await userEvent.type(input, "Renamed");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    const saved = (await db.tasks.get(task.id!))!;
    expect(saved.isFrog).toBe(true);
    expect(saved.focusBlocksDone).toBe(3);
    expect(saved.createdAt).toEqual(createdAt);
    expect(saved.plannedFor).toEqual(plannedFor);
    expect(saved.completed).toBe(false);
  });

  it("does not create a second task when editing", async () => {
    const task = await seed();

    renderWithIntl(
      <TaskComposer
        group="today"
        task={task}
        onDone={() => {}}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await db.tasks.count()).toBe(1);
  });
});
