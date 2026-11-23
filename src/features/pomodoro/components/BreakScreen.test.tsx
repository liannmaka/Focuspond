import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";

import { renderWithIntl, screen, waitFor } from "@/test/renderWithIntl";
import { db, moodDB, pomodoroDB, taskDB } from "@/lib/db/indexedDB";
import { startOfToday } from "@/features/tasks/lib/planning";
import {
  BREAK_CATEGORIES_FOR_ENERGY,
  BREAK_PROMPTS,
} from "../constants/breakPrompts";
import { BREAK_MINUTES } from "../lib/breaks";
import { MINUTE_MS } from "../lib/timer";
import FocusTimer from "./FocusTimer";

beforeEach(async () => {
  await db.tasks.clear();
  await db.pomodoros.clear();
  await db.moods.clear();
});

const seedTask = () =>
  taskDB.add({
    title: "Ship the plan",
    plannedFor: startOfToday(),
    energyRequired: "high",
    estimatedMinutes: 50,
  });

/**
 * A completed session whose 25 minutes ran out `minutesAgo` minutes ago — so
 * its break has `BREAK_MINUTES - minutesAgo` left.
 */
const seedFinished = async (taskId: number | undefined, minutesAgo: number) => {
  const id = await pomodoroDB.start(taskId, 25);
  await db.pomodoros.update(id, {
    startTime: new Date(Date.now() - (25 + minutesAgo) * MINUTE_MS),
  });
  await pomodoroDB.complete(id);
  return id;
};

/** The title of whichever prompt is on screen, if any. */
const promptTitles = () =>
  BREAK_PROMPTS.map((prompt) => prompt.id).filter((id) =>
    screen.queryByText(promptCopy[id])
  );

/** Titles as the English catalog has them, to match what is rendered. */
const promptCopy: Record<string, string> = {
  "box-breathing": "Box breathing",
  "long-exhale": "One long exhale",
  "one-breath": "Just one breath",
  "eyes-off-screen": "Look away",
  "window-gaze": "Out of the window",
  water: "Get some water",
  "do-nothing": "Do nothing",
  "shoulder-roll": "Roll your shoulders",
  "neck-release": "Let your neck go",
  "stand-and-reach": "Stand and reach up",
  "walk-it-out": "Walk somewhere else",
  "shake-it-off": "Shake it off",
};

describe("the break after a session", () => {
  it("offers a break the moment a session completes", async () => {
    const taskId = await seedTask();
    await seedFinished(taskId, 0);

    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    expect(await screen.findByText("Session complete")).toBeInTheDocument();
    expect(await screen.findByRole("timer")).toHaveTextContent("05:00");
  });

  it("names the task the block was spent on", async () => {
    const taskId = await seedTask();
    await seedFinished(taskId, 0);

    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    // `waitFor` round the assertion, not just the query: the task and the mood
    // resolve in separate ticks, so a node captured between them can be
    // replaced before the assertion runs.
    await waitFor(() =>
      expect(screen.getByText(/Ship the plan/)).toBeInTheDocument()
    );
  });

  it("shows exactly one prompt", async () => {
    const taskId = await seedTask();
    await seedFinished(taskId, 0);

    renderWithIntl(<FocusTimer taskId={String(taskId)} />);
    await screen.findByText("Session complete");
    await waitFor(() => expect(promptTitles()).toHaveLength(1));
  });

  /**
   * The break clock is `endTime + 5 min`, so a tab reopened two minutes in
   * shows three left. Nothing had to survive in memory for that to work.
   */
  it("resumes a break already in progress at the correct time", async () => {
    const taskId = await seedTask();
    await seedFinished(taskId, 2);

    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    expect(await screen.findByRole("timer")).toHaveTextContent("03:00");
  });

  /** "Back to focus" — a break you must finish would just be another task. */
  it("lets the break be left early, and does not offer it again", async () => {
    const taskId = await seedTask();
    const id = await seedFinished(taskId, 1);
    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    await userEvent.click(
      await screen.findByRole("button", { name: /back to focus/i })
    );

    expect(
      await screen.findByRole("button", { name: /start 25 minutes/i })
    ).toBeInTheDocument();
    expect(screen.queryByText("Session complete")).not.toBeInTheDocument();
    // Recorded, so a reload cannot drop the reader back into it.
    expect((await db.pomodoros.get(id))!.breakEndedAt).toBeInstanceOf(Date);
  });

  /** "After": a break run to its end is over, and says so on disk. */
  it("closes out a break whose five minutes have passed", async () => {
    const taskId = await seedTask();
    const id = await seedFinished(taskId, BREAK_MINUTES + 1);

    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    await waitFor(async () =>
      expect((await db.pomodoros.get(id))!.breakEndedAt).toBeInstanceOf(Date)
    );
    expect(screen.queryByText("Session complete")).not.toBeInTheDocument();
  });

  /** An abandoned session ended early — there is nothing to recover from. */
  it("offers no break after a session that was ended early", async () => {
    const taskId = await seedTask();
    const id = await pomodoroDB.start(taskId, 25);
    await pomodoroDB.abandon(id);

    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    expect(
      await screen.findByRole("button", { name: /start 25 minutes/i })
    ).toBeInTheDocument();
    expect(screen.queryByText("Session complete")).not.toBeInTheDocument();
  });

  /**
   * "Twice": starting the next block ends the break rather than leaving it
   * open, so the record does not claim a break that was skipped is still owed.
   */
  it("ends the break when the next block starts", async () => {
    const taskId = await seedTask();
    const id = await seedFinished(taskId, 1);
    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    await userEvent.click(
      await screen.findByRole("button", { name: /back to focus/i })
    );
    await userEvent.click(
      await screen.findByRole("button", { name: /start 25 minutes/i })
    );

    expect(await screen.findByRole("timer")).toHaveTextContent("25:00");
    expect((await db.pomodoros.get(id))!.breakEndedAt).toBeInstanceOf(Date);
  });

  it("breaks after a free session too", async () => {
    await seedFinished(undefined, 0);

    renderWithIntl(<FocusTimer taskId="free" />);

    expect(await screen.findByText("Session complete")).toBeInTheDocument();
  });

  describe("chosen by today's energy", () => {
    /**
     * The second place the mood check-in pays for itself. Telling someone who
     * has just said they are drained to go for a brisk walk is the opposite of
     * what this product promises.
     */
    it("offers breathing or rest on a tired day", async () => {
      await moodDB.add({ level: "low", label: "Tired", energyLevel: "low" });
      const taskId = await seedTask();
      await seedFinished(taskId, 0);

      renderWithIntl(<FocusTimer taskId={String(taskId)} />);
      await screen.findByText("Session complete");

      await waitFor(() => expect(promptTitles()).toHaveLength(1));
      const shown = BREAK_PROMPTS.find((p) => p.id === promptTitles()[0])!;
      expect(BREAK_CATEGORIES_FOR_ENERGY.low).toContain(shown.category);
    });

    it("offers movement on a high-energy day", async () => {
      await moodDB.add({ level: "high", label: "Good", energyLevel: "high" });
      const taskId = await seedTask();
      await seedFinished(taskId, 0);

      renderWithIntl(<FocusTimer taskId={String(taskId)} />);
      await screen.findByText("Session complete");

      await waitFor(() => expect(promptTitles()).toHaveLength(1));
      const shown = BREAK_PROMPTS.find((p) => p.id === promptTitles()[0])!;
      expect(BREAK_CATEGORIES_FOR_ENERGY.high).toContain(shown.category);
    });

    /**
     * Unknown energy means unknown, never low — and the prompt must not be
     * picked from the wrong pool and then swapped once the mood query lands.
     */
    it("still offers a prompt when there has been no check-in", async () => {
      const taskId = await seedTask();
      await seedFinished(taskId, 0);

      renderWithIntl(<FocusTimer taskId={String(taskId)} />);
      await screen.findByText("Session complete");

      await waitFor(() => expect(promptTitles()).toHaveLength(1));
    });
  });
});
