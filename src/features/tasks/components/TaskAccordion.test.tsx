import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { renderWithIntl, screen } from "@/test/renderWithIntl";
import { TaskAccordion } from "./TaskAccordion";
import type { Task } from "../types/task";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: "Ship the plan",
    group: "today",
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

  it("counts done against total in the group header", () => {
    renderWithIntl(
      <TaskAccordion
        group="today"
        tasks={[
          makeTask({ id: 1, completed: true }),
          makeTask({ id: 2 }),
          makeTask({ id: 3 }),
        ]}
      />
    );

    expect(screen.getByText("1/3")).toBeInTheDocument();
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
