import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithIntl, screen } from "@/test/renderWithIntl";
import { db } from "@/lib/db/indexedDB";
import BottomNav from "./BottomNav";

let pathname = "/home/today";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

beforeEach(async () => {
  await db.tasks.clear();
  pathname = "/home/today";
});

const item = (name: string) => screen.getByRole("link", { name });

describe("BottomNav", () => {
  /**
   * The gap this closes: below `lg` there is no rail, and the bottom bar
   * carried the five task filters — so Progress, Mood and a free focus session
   * could not be reached on a phone at all.
   */
  it("reaches every section of the app", () => {
    renderWithIntl(<BottomNav />);

    expect(item("Tasks")).toHaveAttribute("href", "/home/all");
    expect(item("Focus")).toHaveAttribute("href", "/home/timer/free");
    expect(item("Progress")).toHaveAttribute("href", "/analytics");
    expect(item("Mood")).toHaveAttribute("href", "/mood");
  });

  it("carries the four sections and nothing else", () => {
    renderWithIntl(<BottomNav />);

    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  /** The filters moved to the task pages; they are not a destination. */
  it("no longer offers the task filters", () => {
    renderWithIntl(<BottomNav />);

    expect(
      screen.queryByRole("link", { name: "Upcoming" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Backlog" })
    ).not.toBeInTheDocument();
  });

  it("marks tasks when you are on a task list", () => {
    pathname = "/home/backlog";
    const { container } = renderWithIntl(<BottomNav />);

    // The active item is the one carrying the indicator bar at full opacity.
    const active = container.querySelectorAll(".opacity-100");
    expect(active.length).toBe(1);
    expect(item("Tasks")).toContainElement(active[0] as HTMLElement);
  });

  /** "Elsewhere": the focus screen is under /home but is its own section. */
  it("marks focus on a session, not tasks", () => {
    pathname = "/home/timer/7";
    const { container } = renderWithIntl(<BottomNav />);

    const active = container.querySelectorAll(".opacity-100");
    expect(item("Focus")).toContainElement(active[0] as HTMLElement);
  });

  it("marks progress on the progress page", () => {
    pathname = "/analytics";
    const { container } = renderWithIntl(<BottomNav />);

    const active = container.querySelectorAll(".opacity-100");
    expect(item("Progress")).toContainElement(active[0] as HTMLElement);
  });
});
