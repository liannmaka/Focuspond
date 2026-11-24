import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";

import { renderWithIntl, screen, waitFor } from "@/test/renderWithIntl";
import { db, pomodoroDB, taskDB } from "@/lib/db/indexedDB";
import { startOfToday } from "@/features/tasks/lib/planning";
import { MINUTE_MS } from "../lib/timer";
import FocusTimer from "./FocusTimer";

beforeEach(async () => {
  await db.tasks.clear();
  await db.pomodoros.clear();
});

const seedTask = () =>
  taskDB.add({
    title: "Ship the plan",
    plannedFor: startOfToday(),
    energyRequired: "high",
    estimatedMinutes: 50,
  });

/** A session for `taskId` that started `minutesAgo` minutes ago. */
const seedSession = async (taskId: number | undefined, minutesAgo: number) => {
  const id = await pomodoroDB.start(taskId, 25);
  await db.pomodoros.update(id, {
    startTime: new Date(Date.now() - minutesAgo * MINUTE_MS),
  });
  return id;
};

describe("FocusTimer", () => {
  it("shows the task and waits to be started", async () => {
    const taskId = await seedTask();
    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    expect(await screen.findByText("Ship the plan")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /start 25 minutes/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });

  /**
   * Deliberately not auto-started. A reload after finishing would otherwise
   * begin another 25 minutes, and any re-opened link would start a session
   * nobody asked for.
   */
  it("writes no session until the reader starts one", async () => {
    const taskId = await seedTask();
    renderWithIntl(<FocusTimer taskId={String(taskId)} />);
    await screen.findByRole("button", { name: /start 25 minutes/i });

    expect(await db.pomodoros.count()).toBe(0);
  });

  it("starts a session and counts from the full duration", async () => {
    const taskId = await seedTask();
    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    await userEvent.click(
      await screen.findByRole("button", { name: /start 25 minutes/i })
    );

    expect(await screen.findByRole("timer")).toHaveTextContent("25:00");
    await waitFor(async () =>
      expect((await pomodoroDB.getRunning())?.taskId).toBe(taskId)
    );
  });

  /**
   * The milestone's whole point. The clock is `startTime + duration`, so a
   * screen mounting fresh onto a session started ten minutes ago reads 15:00 —
   * no counter survived, and none had to.
   */
  it("resumes a session already in progress at the correct time", async () => {
    const taskId = await seedTask();
    await seedSession(taskId, 10);

    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    // 14:59 or 15:00: the shared tick is up to a second behind by design and
    // the display rounds up, so the exact second is not a promise. Restarting
    // from 25:00 — the bug this guards — fails either way.
    expect(await screen.findByRole("timer")).toHaveTextContent(
      /^(14:5\d|15:00)$/
    );
  });

  /**
   * "After": the session ran out while the tab was closed. The time passed, so
   * the block counts — settled on load rather than waiting for a tick.
   *
   * No break is offered: this session ended fifteen minutes ago, and a rest
   * five minutes long is not owed a quarter of an hour later. Coming back to
   * find a break counting down for work you finished before lunch would be the
   * clock inventing a state nobody was in.
   */
  it("settles a session that finished while the tab was away", async () => {
    const taskId = await seedTask();
    await seedSession(taskId, 40);

    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    await waitFor(async () =>
      expect((await taskDB.get(taskId))!.focusBlocksDone).toBe(1)
    );
    expect(
      await screen.findByRole("button", { name: /start 25 minutes/i })
    ).toBeInTheDocument();
    expect(screen.queryByText("Session complete")).not.toBeInTheDocument();
  });

  /**
   * A session left open for days is not evidence of focus, so it closes with
   * no credit — the clock must not hand out a block nobody earned.
   */
  it("credits nothing for a session left open for days", async () => {
    const taskId = await seedTask();
    const id = await seedSession(taskId, 60 * 48);

    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    await waitFor(async () =>
      expect((await db.pomodoros.get(id))!.endTime).toBeInstanceOf(Date)
    );
    expect((await db.pomodoros.get(id))!.completed).toBe(false);
    expect((await taskDB.get(taskId))!.focusBlocksDone).toBe(0);
    expect(screen.queryByText("Session complete")).not.toBeInTheDocument();
  });

  /** "Undo": ending early leaves the block count where it was. */
  it("ends a session early without crediting a block", async () => {
    const taskId = await seedTask();
    await seedSession(taskId, 5);
    renderWithIntl(<FocusTimer taskId={String(taskId)} />);

    await userEvent.click(
      await screen.findByRole("button", { name: /end session/i })
    );

    await waitFor(async () =>
      expect(await pomodoroDB.getRunning()).toBeUndefined()
    );
    expect((await taskDB.get(taskId))!.focusBlocksDone).toBe(0);
    expect(
      await screen.findByRole("button", { name: /start 25 minutes/i })
    ).toBeInTheDocument();
  });

  /**
   * "Elsewhere": a session is running for a *different* task. Showing its clock
   * under this task's title would credit the wrong task when it finished.
   */
  it("refuses to show another task's session as this one's", async () => {
    const running = await seedTask();
    const other = await taskDB.add({
      title: "Something else",
      plannedFor: startOfToday(),
      energyRequired: "low",
      estimatedMinutes: 25,
    });
    await seedSession(running, 5);

    renderWithIntl(<FocusTimer taskId={String(other)} />);

    expect(
      await screen.findByText("A session is already running")
    ).toBeInTheDocument();
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /start 25 minutes/i })
    ).not.toBeInTheDocument();
  });

  it("will not start a second session while one is running", async () => {
    const running = await seedTask();
    await seedSession(running, 5);
    renderWithIntl(<FocusTimer taskId="free" />);

    await screen.findByText("A session is already running");

    expect(await db.pomodoros.count()).toBe(1);
  });

  it("runs a free session with no task attached", async () => {
    renderWithIntl(<FocusTimer taskId="free" />);

    expect(await screen.findByText("Free focus")).toBeInTheDocument();
    // `findBy`, not `getBy`: the title renders before the live query resolves,
    // so the controls arrive a tick after the heading does.
    await userEvent.click(
      await screen.findByRole("button", { name: /start 25 minutes/i })
    );

    expect(await screen.findByRole("timer")).toHaveTextContent("25:00");
    await waitFor(async () =>
      expect(await pomodoroDB.getRunning()).toBeDefined()
    );
    expect((await pomodoroDB.getRunning())!.taskId).toBeUndefined();
  });

  it("says so plainly when the id is not a task on this device", async () => {
    renderWithIntl(<FocusTimer taskId="9999" />);

    expect(
      await screen.findByText("That task isn't on this device")
    ).toBeInTheDocument();
  });

  it("does not offer a clock for a nonsense url", async () => {
    renderWithIntl(<FocusTimer taskId="not-an-id" />);

    expect(
      await screen.findByText("That task isn't on this device")
    ).toBeInTheDocument();
    expect(await db.pomodoros.count()).toBe(0);
  });
});
