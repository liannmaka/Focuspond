import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { renderWithIntl, screen, waitFor } from "@/test/renderWithIntl";
import { db, taskDB } from "@/lib/db/indexedDB";
import { startOfToday } from "../lib/planning";
import FrogPicker from "./FrogPicker";
import type { Task } from "../types/task";

beforeEach(async () => {
  await db.tasks.clear();
});

const seed = async (
  title: string,
  energyRequired: "high" | "medium" | "low",
  estimatedMinutes: number
) => {
  const id = await taskDB.add({
    title,
    plannedFor: startOfToday(),
    energyRequired,
    estimatedMinutes,
  });
  return (await db.tasks.get(id))! as Task;
};

/** Titles in the order they are rendered. */
const rendered = () =>
  screen
    .getAllByRole("button")
    .map((b) => b.textContent ?? "")
    .filter((text) => text.includes("m"));

describe("FrogPicker", () => {
  it("renders nothing while closed", async () => {
    const task = await seed("Deep thing", "high", 50);

    renderWithIntl(
      <FrogPicker
        open={false}
        tasks={[task]}
        onClose={() => {}}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("lists today's open tasks", async () => {
    const a = await seed("Write the proposal", "high", 50);
    const b = await seed("Water the plants", "low", 15);

    renderWithIntl(
      <FrogPicker
        open
        tasks={[a, b]}
        onClose={() => {}}
      />
    );

    expect(screen.getByText("Write the proposal")).toBeInTheDocument();
    expect(screen.getByText("Water the plants")).toBeInTheDocument();
  });

  /** The ordering is the whole point — rankCandidates finally has a caller. */
  it("puts work that fits a tired day first", async () => {
    const deep = await seed("Deep thing", "high", 50);
    const light = await seed("Light thing", "low", 15);

    renderWithIntl(
      <FrogPicker
        open
        tasks={[deep, light]}
        energy="low"
        onClose={() => {}}
      />
    );

    const order = rendered();
    expect(order[0]).toContain("Light thing");
    expect(order[1]).toContain("Deep thing");
  });

  it("puts the heaviest work first on a high-energy day", async () => {
    const deep = await seed("Deep thing", "high", 50);
    const light = await seed("Light thing", "low", 15);

    renderWithIntl(
      <FrogPicker
        open
        tasks={[light, deep]}
        energy="high"
        onClose={() => {}}
      />
    );

    expect(rendered()[0]).toContain("Deep thing");
  });

  it("promotes the chosen task and closes", async () => {
    const task = await seed("Write the proposal", "high", 50);
    const onClose = vi.fn();

    renderWithIntl(
      <FrogPicker
        open
        tasks={[task]}
        energy="high"
        onClose={onClose}
      />
    );

    await userEvent.click(screen.getByText("Write the proposal"));

    await waitFor(async () => {
      expect((await db.tasks.get(task.id!))!.isFrog).toBe(true);
    });
    expect(onClose).toHaveBeenCalled();
  });

  /** Swapping must leave exactly one frog, not two. */
  it("demotes the previous frog when another is chosen", async () => {
    const first = await seed("First", "high", 50);
    const second = await seed("Second", "high", 50);
    await taskDB.setFrog(first.id!);

    renderWithIntl(
      <FrogPicker
        open
        tasks={[first, second]}
        energy="high"
        onClose={() => {}}
      />
    );

    await userEvent.click(screen.getByText("Second"));

    await waitFor(async () => {
      expect(await taskDB.getFrogTasks()).toHaveLength(1);
    });
    expect((await db.tasks.get(first.id!))!.isFrog).toBe(false);
    expect((await db.tasks.get(second.id!))!.isFrog).toBe(true);
  });

  /** With no check-in there is no verdict to give, so none is shown. */
  it("offers no energy verdict when no mood is recorded", async () => {
    const task = await seed("Deep thing", "high", 50);

    renderWithIntl(
      <FrogPicker
        open
        tasks={[task]}
        onClose={() => {}}
      />
    );

    expect(screen.queryByText("Matches your energy")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Heavier than today's energy")
    ).not.toBeInTheDocument();
  });

  it("says so when there is nothing to choose from", () => {
    renderWithIntl(
      <FrogPicker
        open
        tasks={[]}
        onClose={() => {}}
      />
    );

    expect(
      screen.getByText("Nothing planned for today yet.")
    ).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const task = await seed("Deep thing", "high", 50);
    const onClose = vi.fn();

    renderWithIntl(
      <FrogPicker
        open
        tasks={[task]}
        onClose={onClose}
      />
    );

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});
