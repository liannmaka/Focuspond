import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { renderWithIntl, screen } from "@/test/renderWithIntl";
import FrogOfTheDay from "./FrogOfTheDay";
import type { FrogState } from "../lib/taskDisplay";
import type { Frog } from "../types/task";

const frog = (overrides: Partial<Frog> = {}): Frog => ({
  id: 1,
  title: "Write the proposal",
  plannedFor: new Date(2026, 10, 2),
  energyRequired: "high",
  estimatedMinutes: 50,
  focusBlocks: 2,
  focusBlocksDone: 0,
  isFrog: true,
  completed: false,
  createdAt: new Date(2026, 10, 2),
  ...overrides,
});

const render = (state: FrogState<Frog>, handlers = {}) =>
  renderWithIntl(
    <FrogOfTheDay
      state={state}
      {...handlers}
    />
  );

describe("FrogOfTheDay", () => {
  it("asks for a frog when today is empty", () => {
    render({ kind: "none" });

    expect(screen.getByText("Pick your frog")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /choose your frog/i })
    ).toBeInTheDocument();
  });

  /**
   * A suggestion must not wear the costume of a decision. Before this, the
   * top-ranked task rendered exactly like one the reader had picked.
   */
  it("labels an unchosen task as a suggestion, and offers to adopt it", () => {
    const onAccept = vi.fn();
    render({ kind: "suggested", frog: frog({ isFrog: false }) }, { onAccept });

    expect(screen.getByText("Suggested for today")).toBeInTheDocument();
    expect(screen.queryByText("Frog of the day")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /start focus/i })
    ).not.toBeInTheDocument();

    screen.getByRole("button", { name: /make this my frog/i }).click();
    expect(onAccept).toHaveBeenCalled();
  });

  it("offers focus and a swap for a chosen frog", async () => {
    const onStart = vi.fn();
    const onSwap = vi.fn();
    render({ kind: "chosen", frog: frog() }, { onStart, onSwap });

    expect(screen.getByText("Frog of the day")).toBeInTheDocument();
    expect(screen.getByText("Write the proposal")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /start focus/i }));
    expect(onStart).toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole("button", { name: /pick another/i })
    );
    expect(onSwap).toHaveBeenCalled();
  });

  describe("once eaten", () => {
    const eaten: FrogState<Frog> = {
      kind: "eaten",
      frog: frog({ completed: true, completedAt: new Date() }),
    };

    it("holds the win rather than naming a replacement", () => {
      render(eaten);

      expect(screen.getByText("Frog eaten")).toBeInTheDocument();
      expect(screen.queryByText("Frog of the day")).not.toBeInTheDocument();
      expect(
        screen.getByText(
          "That was the one that mattered. The rest of the day is yours."
        )
      ).toBeInTheDocument();
    });

    /**
     * One frog per day is the method. A second pick labelled "Frog of the day"
     * would claim it was the task that made today count, when that task is
     * already done and crossed out above it.
     */
    it("offers no actions at all", () => {
      render(eaten, { onStart: vi.fn(), onSwap: vi.fn(), onAccept: vi.fn() });

      expect(screen.queryAllByRole("button")).toHaveLength(0);
    });

    it("strikes the finished title through", () => {
      render(eaten);

      expect(screen.getByText("Write the proposal").className).toContain(
        "line-through"
      );
    });
  });
});
