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

describe("while a session is running on it", () => {
  /**
   * The card offered "Start focus" while that very session counted down on
   * another screen — not silent about it, but saying something untrue.
   */
  it("says resume, with the time left", () => {
    render({ kind: "chosen", frog: frog() }, { runningTime: "18:42" });

    expect(
      screen.getByRole("button", { name: /resume · 18:42/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^start focus$/i })
    ).not.toBeInTheDocument();
  });

  it("offers to start when nothing is running", () => {
    render({ kind: "chosen", frog: frog() });

    expect(
      screen.getByRole("button", { name: /start focus/i })
    ).toBeInTheDocument();
  });

  /** Swapping is still allowed: a running session is not a commitment. */
  it("still lets the frog be swapped", () => {
    render({ kind: "chosen", frog: frog() }, { runningTime: "18:42" });

    expect(
      screen.getByRole("button", { name: /pick another/i })
    ).toBeInTheDocument();
  });

  /**
   * A suggestion is not a session. The accept button has to stay an accept
   * button, or the card would offer to resume something never started.
   */
  it("does not relabel an unaccepted suggestion", () => {
    render(
      { kind: "suggested", frog: frog({ isFrog: false }) },
      {
        runningTime: "18:42",
      }
    );

    expect(
      screen.getByRole("button", { name: /make this my frog/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/18:42/)).not.toBeInTheDocument();
  });

  /**
   * The clock in the label made the button resize every second, shoving "Pick
   * another" sideways with it.
   *
   * Asserted as a class because that *is* the mechanism and jsdom applies no
   * Tailwind CSS, so there is no computed `font-variant-numeric` to read. The
   * other half of the fix — a label that is always the same number of
   * characters — is covered by `formatRemaining`'s own padding tests.
   */
  it("holds its width while the clock runs", () => {
    render({ kind: "chosen", frog: frog() }, { runningTime: "18:42" });

    // `classList.contains`, not a substring of `className`: the first version
    // of this test matched "tabular-nums" inside "tabular-nums-OFF" and passed
    // against the broken code.
    expect(
      screen
        .getByRole("button", { name: /resume/i })
        .classList.contains("tabular-nums")
    ).toBe(true);
  });
});

describe("before the day's tasks have arrived", () => {
  /**
   * The card had the list's flaw in a louder place: an unresolved query
   * reaches `frogState` as an empty array, indistinguishable from a day with
   * nothing in it — so the hero surface opened by asking you to pick a frog
   * you had already picked.
   */
  it("does not ask for a frog it cannot know is missing", () => {
    renderWithIntl(
      <FrogOfTheDay
        state={{ kind: "none" }}
        loading
      />
    );

    expect(screen.queryByText("Pick your frog")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /choose your frog/i })
    ).not.toBeInTheDocument();
  });

  it("says it is still working it out", () => {
    const { container } = renderWithIntl(
      <FrogOfTheDay
        state={{ kind: "none" }}
        loading
      />
    );

    expect(container.querySelector("[aria-busy]")).toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0
    );
  });

  it("shows the frog once it is known", () => {
    render({ kind: "chosen", frog: frog() });

    expect(screen.getByText("Write the proposal")).toBeInTheDocument();
  });

  it("asks for a frog once it knows there is none", () => {
    render({ kind: "none" });

    expect(screen.getByText("Pick your frog")).toBeInTheDocument();
  });
});
