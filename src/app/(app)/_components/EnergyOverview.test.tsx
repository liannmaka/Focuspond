// Real IndexedDB for Node — this test exercises the live mood→energy→UI chain,
// not a mock of it, so it is what actually proves M2 works.
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";

import { renderWithIntl, screen, waitFor } from "@/test/renderWithIntl";
import { db, moodDB, taskDB } from "@/lib/db/indexedDB";
import EnergyOverview from "./EnergyOverview";

beforeEach(async () => {
  await db.tasks.clear();
  await db.moods.clear();
});

const addTask = (title: string, energyRequired: "high" | "medium" | "low") =>
  taskDB.add({
    title,
    group: "today",
    energyRequired,
    estimatedMinutes: 25,
  });

describe("EnergyOverview", () => {
  it("invites a check-in when no mood is recorded today", async () => {
    await addTask("Something", "high");

    renderWithIntl(<EnergyOverview />);

    expect(
      await screen.findByText("You haven't checked in yet today.")
    ).toBeInTheDocument();
  });

  /**
   * The mood is stored with an English `label`, but the panel must resolve the
   * display name through the catalog — otherwise every locale shows English.
   */
  it("shows today's mood and how many tasks suit it", async () => {
    await moodDB.add({ level: "low", label: "Tired", energyLevel: "low" });
    await addTask("Deep work thing", "high");
    await addTask("Light thing", "low");
    await addTask("Another light thing", "low");

    renderWithIntl(<EnergyOverview />);

    expect(await screen.findByText("Tired")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText("2 of 3 today tasks suit it")).toBeInTheDocument()
    );
  });

  it("counts every task as fitting on a high-energy day", async () => {
    await moodDB.add({
      level: "very-high",
      label: "Energized",
      energyLevel: "high",
    });
    await addTask("Deep work thing", "high");
    await addTask("Light thing", "low");

    renderWithIntl(<EnergyOverview />);

    await waitFor(() =>
      expect(screen.getByText("2 of 2 today tasks suit it")).toBeInTheDocument()
    );
  });

  it("says so when the day has no tasks yet", async () => {
    await moodDB.add({ level: "high", label: "Good", energyLevel: "high" });

    renderWithIntl(<EnergyOverview />);

    expect(
      await screen.findByText("Nothing planned for today yet.")
    ).toBeInTheDocument();
  });

  /**
   * The whole reason this reads IndexedDB through `useLiveQuery` rather than a
   * store: a write from anywhere — another component, another tab — reaches the
   * UI with no invalidation step. Checking in at /mood updates this panel while
   * it is already on screen.
   */
  it("updates when a mood is recorded while it is already rendered", async () => {
    await addTask("Deep work thing", "high");

    renderWithIntl(<EnergyOverview />);
    expect(
      await screen.findByText("You haven't checked in yet today.")
    ).toBeInTheDocument();

    await moodDB.add({ level: "low", label: "Tired", energyLevel: "low" });

    expect(await screen.findByText("Tired")).toBeInTheDocument();
    expect(screen.getByText("0 of 1 today tasks suit it")).toBeInTheDocument();
  });
});
