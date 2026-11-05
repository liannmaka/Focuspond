// The rail renders the dashboard panel, which reads tasks and moods live.
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { renderWithIntl, screen } from "@/test/renderWithIntl";
import { db } from "@/lib/db/indexedDB";
import SideBar from "./Sidebar";

const push = vi.fn();
let pathname = "/home/all";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push }),
}));

beforeEach(async () => {
  await db.tasks.clear();
  await db.moods.clear();
  push.mockClear();
  pathname = "/home/all";
});

const rail = (name: string) => screen.getByRole("button", { name });

describe("SideBar", () => {
  /**
   * `/home/timer/free` worked from the first day of M4a — the route accepts the
   * literal `free` and `pomodoroDB.start` an undefined task — but nothing in
   * the app linked to it, so it was reachable only by typing the URL.
   */
  it("offers a session tied to no task", async () => {
    renderWithIntl(<SideBar />);

    await userEvent.click(rail("Free focus"));

    expect(push).toHaveBeenCalledWith("/home/timer/free");
  });

  it("marks the rail item you are actually on", () => {
    pathname = "/home/timer/free";
    renderWithIntl(<SideBar />);

    expect(rail("Free focus")).toHaveAttribute("aria-current", "page");
    expect(rail("Tasks")).not.toHaveAttribute("aria-current");
  });

  /** "Elsewhere": a task's timer is the same section as a free one. */
  it("marks focus for a session on a task too", () => {
    pathname = "/home/timer/7";
    renderWithIntl(<SideBar />);

    expect(rail("Free focus")).toHaveAttribute("aria-current", "page");
  });

  it("marks tasks, not focus, on a task list", () => {
    pathname = "/home/today";
    renderWithIntl(<SideBar />);

    expect(rail("Tasks")).toHaveAttribute("aria-current", "page");
    expect(rail("Free focus")).not.toHaveAttribute("aria-current");
  });

  /**
   * The dashboard grid reserves a fixed 235px column for this panel and places
   * children in order, so a section under /home that drops the panel slides
   * `main` into that column and renders the page 235px wide. The focus screen
   * keeps the panel until that layout is fixed — this is the guard.
   */
  it("keeps the dashboard panel on the focus screen", () => {
    pathname = "/home/timer/free";
    renderWithIntl(<SideBar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("drops the panel outside the task section", () => {
    pathname = "/analytics";
    renderWithIntl(<SideBar />);

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });
});
