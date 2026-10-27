import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { renderWithIntl, screen } from "@/test/renderWithIntl";
import { startOfToday } from "../lib/planning";
import { TaskAccordion } from "./TaskAccordion";
import type { Task } from "../types/task";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: "Ship the plan",
    plannedFor: startOfToday(),
    energyRequired: "high",
    estimatedMinutes: 50,
    focusBlocks: 2,
    focusBlocksDone: 0,
    isFrog: false,
    completed: false,
    createdAt: new Date("2026-09-21T09:00:00Z"),
    ...overrides,
  };
}

/** A task finished today, for the "Done today" disclosure. */
const makeDone = (title: string, id: number): Task =>
  makeTask({ id, title, completed: true, completedAt: new Date() });

describe("TaskAccordion", () => {
  it("renders the empty state when there are no tasks", () => {
    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[]}
      />
    );

    expect(screen.getByText("Still water")).toBeInTheDocument();
  });

  /**
   * `tasks` holds only the open items, so a finished group and a never-used one
   * both arrive here as an empty array. They must not look the same: before
   * this, clearing four tasks told the reader "Nothing here yet" and offered to
   * add their first.
   */
  it("celebrates a cleared group instead of calling it empty", () => {
    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[]}
        doneToday={[makeDone("a", 1), makeDone("b", 2), makeDone("c", 3)]}
        addToGroup="today"
      />
    );

    expect(screen.getByText("All 3 done")).toBeInTheDocument();
    expect(screen.queryByText("Still water")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add your first task/i })
    ).not.toBeInTheDocument();
  });

  it("still shows the empty state for a group that never had tasks", () => {
    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[]}
        doneToday={[]}
        addToGroup="today"
      />
    );

    expect(screen.getByText("Still water")).toBeInTheDocument();
  });

  /** The header counts the list, not a ratio against rows that are elsewhere. */
  it("counts only what is open in the header", () => {
    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[makeTask({ id: 1 }), makeTask({ id: 2 })]}
        doneToday={[makeDone("finished", 3)]}
      />
    );

    expect(screen.getByText("2 left")).toBeInTheDocument();
    expect(screen.queryByText("2/3")).not.toBeInTheDocument();
  });

  it("folds today's wins away, and opens them on request", async () => {
    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[makeTask({ id: 1 })]}
        doneToday={[makeDone("Finished thing", 2)]}
      />
    );

    const disclosure = screen.getByRole("button", { name: /done today/i });
    expect(disclosure).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(disclosure);

    expect(disclosure).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Finished thing")).toBeVisible();
  });

  /** Carrying over must be visible, or Today quietly stops meaning anything. */
  it("flags a task carried over from an earlier day", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[makeTask({ plannedFor: yesterday })]}
      />
    );

    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Carried over since yesterday")
    ).toBeInTheDocument();
  });

  /**
   * Each task names its own day. Computed against the real clock rather than
   * hardcoded, so this keeps passing on whatever weekday it runs.
   */
  it("names the weekday for a task carried several days", () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    threeDaysAgo.setHours(0, 0, 0, 0);

    const expected = new Intl.DateTimeFormat("en", {
      weekday: "short",
    }).format(threeDaysAgo);

    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[makeTask({ plannedFor: threeDaysAgo })]}
      />
    );

    expect(screen.getByText(expected)).toBeInTheDocument();
    // The pill says when; the tooltip says how long.
    expect(
      screen.getByLabelText("Carried over for 3 days")
    ).toBeInTheDocument();
  });

  it("does not flag today's own work as carried over", () => {
    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[makeTask()]}
      />
    );

    expect(screen.queryByText(/^d+d$/)).not.toBeInTheDocument();
  });

  it("reports the id and the new checked state when a task is toggled", async () => {
    const onToggleTask = vi.fn();
    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[makeTask({ id: 7 })]}
        onToggleTask={onToggleTask}
      />
    );

    await userEvent.click(screen.getByRole("checkbox"));

    expect(onToggleTask).toHaveBeenCalledWith(7, true);
  });

  it("toggles a completed task back to open", async () => {
    const onToggleTask = vi.fn();
    renderWithIntl(
      <TaskAccordion
        group="completed"
        tasks={[makeTask({ id: 3, completed: true })]}
        onToggleTask={onToggleTask}
      />
    );

    await userEvent.click(screen.getByRole("checkbox"));

    expect(onToggleTask).toHaveBeenCalledWith(3, false);
  });

  it("shows the energy demand as a tag on each row", () => {
    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[makeTask({ energyRequired: "low" })]}
      />
    );

    expect(screen.getByText("Light")).toBeInTheDocument();
  });

  /**
   * Completed is a heading, not a planning group — you finish a task rather
   * than create a finished one, so that list withholds the add affordance.
   */
  it("hides the add affordance unless a target group is given", () => {
    const { rerender } = renderWithIntl(
      <TaskAccordion
        group="completed"
        tasks={[makeTask({ completed: true })]}
      />
    );

    expect(
      screen.queryByRole("button", { name: /add task/i })
    ).not.toBeInTheDocument();

    rerender(
      <TaskAccordion
        group="today"
        tasks={[makeTask()]}
        addToGroup="today"
      />
    );

    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  it("opens the inline composer when the reader asks to add", async () => {
    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[]}
        addToGroup="today"
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: /add your first task/i })
    );

    expect(screen.getByPlaceholderText("What needs doing?")).toHaveFocus();
  });
});
