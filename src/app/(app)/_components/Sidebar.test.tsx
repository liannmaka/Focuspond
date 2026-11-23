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
   * A screen whose whole job is one task and a clock should not sit beside a
   * list of everything else you could be doing.
   *
   * This asserted the opposite for one commit: the grid used to render a
   * panel-less page 235px wide, so the focus screen carried the panel to avoid
   * it. The layout places `main` explicitly now, so the panel is a choice
   * again rather than a workaround.
   */
  it("drops the dashboard panel on the focus screen", () => {
    pathname = "/home/timer/free";
    renderWithIntl(<SideBar />);

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("drops the panel outside the task section", () => {
    pathname = "/analytics";
    renderWithIntl(<SideBar />);

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("keeps the panel on a task list", () => {
    pathname = "/home/today";
    renderWithIntl(<SideBar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
