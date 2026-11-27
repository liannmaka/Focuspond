import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithIntl, screen, waitFor } from "@/test/renderWithIntl";
import { db, taskDB } from "@/lib/db/indexedDB";
import { startOfToday } from "@/features/tasks/lib/planning";
import TaskTabsBar from "./TaskTabsBar";

let pathname = "/home/today";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

beforeEach(async () => {
  await db.tasks.clear();
  pathname = "/home/today";
});

describe("TaskTabsBar", () => {
  /**
   * The filters lost their home when the bottom bar started mirroring the
   * rail. They belong above the list anyway: they narrow what is on screen
   * rather than taking you somewhere.
   */
  it("offers every task list", () => {
    renderWithIntl(<TaskTabsBar />);

    for (const label of ["All", "Today", "Upcoming", "Backlog", "Done"]) {
      expect(
        screen.getByRole("link", { name: new RegExp(label) })
      ).toBeInTheDocument();
    }
  });

  it("marks the list you are looking at", () => {
    pathname = "/home/backlog";
    renderWithIntl(<TaskTabsBar />);

    expect(screen.getByRole("link", { name: /Backlog/ })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: /^Today/ })).not.toHaveAttribute(
      "aria-current"
    );
  });

  /**
   * A filter row above a running clock would be an invitation to leave, and
   * the focus screen lives under /home like the task lists do.
   */
  it("stays away from the focus screen", () => {
    pathname = "/home/timer/free";
    renderWithIntl(<TaskTabsBar />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("stays away from pages that are not task lists", () => {
    pathname = "/analytics";
    renderWithIntl(<TaskTabsBar />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("counts what is waiting in each list", async () => {
    await taskDB.add({
      title: "One",
      plannedFor: startOfToday(),
      energyRequired: "low",
      estimatedMinutes: 25,
    });
    await taskDB.add({
      title: "Two",
      plannedFor: null,
      energyRequired: "low",
      estimatedMinutes: 25,
    });

    renderWithIntl(<TaskTabsBar />);

    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: /Backlog 1/ })
      ).toBeInTheDocument()
    );
  });

  /** Zero is not worth the ink: an empty group reads as calm. */
  it("shows no count for an empty list", async () => {
    renderWithIntl(<TaskTabsBar />);

    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Backlog" })).toBeInTheDocument()
    );
  });
});
