import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";

import { renderWithIntl, screen } from "@/test/renderWithIntl";
import { db, pomodoroDB, taskDB } from "@/lib/db/indexedDB";
import { addDays, startOfToday } from "@/features/tasks/lib/planning";
import ProgressPage from "./page";

beforeEach(async () => {
  await db.tasks.clear();
  await db.pomodoros.clear();
  await db.reflections.clear();
});

/** A session finished `daysAgo` days ago, at midday. */
const finishedSession = async (daysAgo: number) => {
  const id = await pomodoroDB.start(undefined, 25);
  const ended = addDays(new Date(), -daysAgo);
  ended.setHours(12, 0, 0, 0);

  await db.pomodoros.update(id, {
    startTime: new Date(ended.getTime() - 25 * 60_000),
    endTime: ended,
    completed: true,
  });
  return id;
};

/** A frog eaten `daysAgo` days ago. */
const eatenFrog = async (title: string, daysAgo: number) => {
  const id = await taskDB.add({
    title,
    plannedFor: startOfToday(),
    energyRequired: "high",
    estimatedMinutes: 25,
  });
  const at = addDays(new Date(), -daysAgo);
  at.setHours(12, 0, 0, 0);

  await db.tasks.update(id, {
    isFrog: true,
    completed: true,
    completedAt: at,
  });
  return id;
};

describe("the Progress page", () => {
  /**
   * It was `<h1>Analytics</h1>`, linked from the side rail — a visible control
   * that went nowhere, which an empty page hides better than a broken one.
   */
  it("reports a day with nothing in it without pretending otherwise", async () => {
    renderWithIntl(<ProgressPage />);

    expect(await screen.findByText("No streak yet")).toBeInTheDocument();
    expect(
      screen.getByText(/Finish a focus session, or eat your frog/)
    ).toBeInTheDocument();
  });

  it("counts today once something has been finished", async () => {
    await finishedSession(0);
    renderWithIntl(<ProgressPage />);

    expect(await screen.findByText("1 day")).toBeInTheDocument();
    expect(screen.getByText("Today is counted.")).toBeInTheDocument();
  });

  /**
   * The rule that matters most here. A day that has not finished cannot have
   * been missed: with yesterday counted and today still empty, the streak
   * stands, and the page says so in words rather than leaving a number to be
   * read as a warning.
   */
  it("holds the streak open on a day not yet spent", async () => {
    await finishedSession(1);
    await finishedSession(2);
    renderWithIntl(<ProgressPage />);

    expect(await screen.findByText("2 days")).toBeInTheDocument();
    expect(screen.getByText(/Today is still open/)).toBeInTheDocument();
  });

  /** An eaten frog earns a day as surely as a finished session does. */
  it("counts a day earned by eating the frog", async () => {
    await eatenFrog("Ship the plan", 0);
    renderWithIntl(<ProgressPage />);

    expect(await screen.findByText("1 day")).toBeInTheDocument();
    expect(screen.getByText("Today is counted.")).toBeInTheDocument();
  });

  it("counts the week's frogs, and keeps the total apart from it", async () => {
    await eatenFrog("This week", 1);
    await eatenFrog("Also this week", 3);
    await eatenFrog("Last month", 40);

    renderWithIntl(<ProgressPage />);

    expect(await screen.findByText("3 in total")).toBeInTheDocument();
    // Two of the three fall inside the rolling seven days.
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("counts today's focus blocks, and only today's", async () => {
    await finishedSession(0);
    await finishedSession(0);
    await finishedSession(5);

    renderWithIntl(<ProgressPage />);

    expect(await screen.findByText("2")).toBeInTheDocument();
    expect(screen.queryByText("None yet today.")).not.toBeInTheDocument();
  });

  it("says so plainly when no block has been finished today", async () => {
    await finishedSession(2);
    renderWithIntl(<ProgressPage />);

    expect(await screen.findByText("None yet today.")).toBeInTheDocument();
  });

  /** An abandoned session is not a day's work and must not earn a streak. */
  it("gives no credit for a session that was ended early", async () => {
    const id = await pomodoroDB.start(undefined, 25);
    await pomodoroDB.abandon(id);

    renderWithIntl(<ProgressPage />);

    expect(await screen.findByText("No streak yet")).toBeInTheDocument();
  });

  it("offers the day's reflection on the same page", async () => {
    renderWithIntl(<ProgressPage />);

    expect(
      await screen.findByRole("textbox", { name: /what went well/i })
    ).toBeInTheDocument();
  });
});
