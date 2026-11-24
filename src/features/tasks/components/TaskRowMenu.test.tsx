import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { renderWithIntl, screen, waitFor } from "@/test/renderWithIntl";
import { db, pomodoroDB, taskDB } from "@/lib/db/indexedDB";
import { startOfToday, viewFor } from "../lib/planning";
import type { Task } from "../types/task";
import TaskRowMenu from "./TaskRowMenu";

beforeEach(async () => {
  await db.tasks.clear();
});

const seed = async (plannedFor: Date | null = startOfToday()) => {
  const id = await taskDB.add({
    title: "Ship the plan",
    plannedFor,
    energyRequired: "high",
    estimatedMinutes: 50,
  });
  return (await db.tasks.get(id))!;
};

const openMenu = async () =>
  userEvent.click(screen.getByRole("button", { name: /actions for/i }));

describe("TaskRowMenu", () => {
  it("stays closed until asked", async () => {
    const task = await seed();
    renderWithIntl(
      <TaskRowMenu
        task={task}
        onEdit={() => {}}
      />
    );

    const trigger = screen.getByRole("button", { name: /actions for/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await openMenu();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("asks the list to edit rather than editing itself", async () => {
    const task = await seed();
    const onEdit = vi.fn();
    renderWithIntl(
      <TaskRowMenu
        task={task}
        onEdit={onEdit}
      />
    );

    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(onEdit).toHaveBeenCalledOnce();
  });

  /** The escape hatch M2.5 left open: a task could never leave Today. */
  it("moves a task out of Today", async () => {
    const task = await seed();
    expect(viewFor(task.plannedFor)).toBe("today");

    renderWithIntl(
      <TaskRowMenu
        task={task}
        onEdit={() => {}}
      />
    );

    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Upcoming" }));

    await waitFor(async () => {
      const saved = (await db.tasks.get(task.id!))!;
      expect(viewFor(saved.plannedFor)).toBe("week");
    });
  });

  /** "Someday" is just clearing the date — no new concept needed. */
  it("sends a task to the backlog by clearing its date", async () => {
    const task = await seed();

    renderWithIntl(
      <TaskRowMenu
        task={task}
        onEdit={() => {}}
      />
    );

    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Backlog" }));

    await waitFor(async () => {
      expect((await db.tasks.get(task.id!))!.plannedFor).toBeNull();
    });
  });

  it("marks the list the task is already in, and disables it", async () => {
    const task = await seed();
    renderWithIntl(
      <TaskRowMenu
        task={task}
        onEdit={() => {}}
      />
    );

    await openMenu();
    expect(screen.getByRole("menuitem", { name: /^Today/ })).toBeDisabled();
    expect(screen.getByRole("menuitem", { name: "Upcoming" })).toBeEnabled();
  });

  describe("one frog per day", () => {
    /** The entry point left open after "Pick another" was removed from the card. */
    it("stops offering to promote once today's frog has been eaten", async () => {
      const eaten = await seed();
      await taskDB.setFrog(eaten.id!);
      await taskDB.setCompleted(eaten.id!, true);

      const other = await seed(null); // a backlog task
      renderWithIntl(
        <TaskRowMenu
          task={other}
          onEdit={() => {}}
        />
      );

      await openMenu();
      await waitFor(() =>
        expect(
          screen.queryByRole("menuitem", { name: /make this the frog/i })
        ).not.toBeInTheDocument()
      );
      // The rest of the menu still works.
      expect(
        screen.getByRole("menuitem", { name: "Edit" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Delete" })
      ).toBeInTheDocument();
    });

    it("offers it while today's frog is still unfinished", async () => {
      const chosen = await seed();
      await taskDB.setFrog(chosen.id!);

      const other = await seed(null);
      renderWithIntl(
        <TaskRowMenu
          task={other}
          onEdit={() => {}}
        />
      );

      await openMenu();
      expect(
        await screen.findByRole("menuitem", { name: /make this the frog/i })
      ).toBeInTheDocument();
    });

    /** "Undo": unchecking the eaten frog means the day is open again. */
    it("offers it again once the eaten frog is unchecked", async () => {
      const eaten = await seed();
      await taskDB.setFrog(eaten.id!);
      await taskDB.setCompleted(eaten.id!, true);
      await taskDB.setCompleted(eaten.id!, false);

      const other = await seed(null);
      renderWithIntl(
        <TaskRowMenu
          task={other}
          onEdit={() => {}}
        />
      );

      await openMenu();
      expect(
        await screen.findByRole("menuitem", { name: /make this the frog/i })
      ).toBeInTheDocument();
    });
  });

  it("deletes the task once the deletion is confirmed", async () => {
    const task = await seed();
    renderWithIntl(
      <TaskRowMenu
        task={task}
        onEdit={() => {}}
      />
    );

    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(async () => {
      expect(await db.tasks.get(task.id!)).toBeUndefined();
    });
  });
});

describe("deleting a task", () => {
  const openDeleteDialog = async (task: Task) => {
    renderWithIntl(
      <TaskRowMenu
        task={task}
        onEdit={() => {}}
      />
    );
    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
  };

  /**
   * Asked before, not undone after. An undo living in a toast is only as good
   * as the reader's chance of noticing and reaching it before it disappears,
   * and deletion here is final — no trash, no server copy.
   */
  it("asks before removing anything", async () => {
    const task = await seed();
    await openDeleteDialog(task);

    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    expect(await db.tasks.get(task.id!)).toBeDefined();
  });

  it("names the task it is about to remove", async () => {
    const task = await seed();
    await openDeleteDialog(task);

    expect(await screen.findByRole("alertdialog")).toHaveTextContent(
      "Ship the plan"
    );
  });

  /** "Undo": cancelling has to leave everything exactly as it was. */
  it("keeps the task when the question is declined", async () => {
    const task = await seed();
    await openDeleteDialog(task);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(await db.tasks.get(task.id!)).toBeDefined();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("keeps the task when the dialog is dismissed with Escape", async () => {
    const task = await seed();
    await openDeleteDialog(task);

    await userEvent.keyboard("{Escape}");

    expect(await db.tasks.get(task.id!)).toBeDefined();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  /**
   * The dangerous button must never be one stray Enter away, and whoever
   * opened this by accident should be able to leave the way they arrived.
   */
  it("starts with the safe answer focused", async () => {
    const task = await seed();
    await openDeleteDialog(task);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
    );
  });

  it("removes the task when the deletion is confirmed", async () => {
    const task = await seed();
    await openDeleteDialog(task);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(async () =>
      expect(await db.tasks.get(task.id!)).toBeUndefined()
    );
  });

  /**
   * The sessions stay. They are a record of work that was really done, and a
   * deleted task is no reason to take yesterday's focus blocks off the board.
   */
  it("leaves finished focus sessions on the record", async () => {
    const task = await seed();
    const session = await pomodoroDB.start(task.id!, 25);
    await pomodoroDB.complete(session);

    await openDeleteDialog(task);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(async () =>
      expect(await db.tasks.get(task.id!)).toBeUndefined()
    );
    expect(await pomodoroDB.getAllCompleted()).toHaveLength(1);
  });
});
