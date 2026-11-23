// The mood pill reads IndexedDB live, so the chrome needs a real one.
import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "@testing-library/react";

import { renderWithIntl, screen, waitFor } from "@/test/renderWithIntl";
import { db, pomodoroDB } from "@/lib/db/indexedDB";
import { resetTickStore } from "@/features/pomodoro/store/tick";
import TopBar from "./TopBar";

// The language switcher calls `router.refresh()` after setting the locale
// cookie, and there is no app router mounted in a unit test.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: () => {}, push: () => {} }),
  usePathname: () => "/home/today",
}));

const setConnection = (online: boolean) => {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value: online,
  });
};

const flip = (online: boolean) => {
  setConnection(online);
  act(() => {
    window.dispatchEvent(new Event(online ? "online" : "offline"));
  });
};

beforeEach(async () => {
  await db.moods.clear();
  await db.pomodoros.clear();
  resetTickStore();
  setConnection(true);
});

afterEach(() => setConnection(true));

describe("TopBar — the offline pill", () => {
  it("says nothing while the connection is up", () => {
    renderWithIntl(<TopBar />);

    expect(screen.queryByText("Offline")).not.toBeInTheDocument();
  });

  it("appears when the connection drops", () => {
    renderWithIntl(<TopBar />);

    flip(false);

    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  /**
   * `role="status"` so a screen reader hears about it politely when it
   * appears — a silent chrome change is no notice at all, and an alert would
   * interrupt for something that is not an error.
   */
  it("announces itself to assistive tech", () => {
    renderWithIntl(<TopBar />);

    flip(false);

    expect(screen.getByRole("status")).toHaveTextContent("Offline");
  });

  /**
   * Being offline is not an error here: the data is on the device. The tooltip
   * says where the work is rather than what has failed.
   */
  it("says the work is safe rather than raising an alarm", () => {
    renderWithIntl(<TopBar />);

    flip(false);

    expect(screen.getByRole("status")).toHaveAttribute(
      "title",
      "No connection. Your work is saved on this device."
    );
  });

  /** "Undo": the connection comes back and the notice goes with it. */
  it("disappears when the connection returns", () => {
    renderWithIntl(<TopBar />);

    flip(false);
    flip(true);

    expect(screen.queryByText("Offline")).not.toBeInTheDocument();
  });

  /** "Twice": a flaky connection must not leave a stale notice behind. */
  it("keeps up with a connection that keeps dropping", () => {
    renderWithIntl(<TopBar />);

    for (let i = 0; i < 3; i++) {
      flip(false);
      expect(screen.getByText("Offline")).toBeInTheDocument();
      flip(true);
      expect(screen.queryByText("Offline")).not.toBeInTheDocument();
    }
  });

  /**
   * "Elsewhere": the notice sits in the right-hand actions, which render at
   * every width. Beside the Guest Mode pill it would have been inside a
   * `hidden md:flex` block — missing from the device most likely to lose a
   * connection.
   */
  it("is not inside a desktop-only block", () => {
    renderWithIntl(<TopBar />);
    flip(false);

    const pill = screen.getByRole("status");
    let node: HTMLElement | null = pill;
    while (node) {
      expect(node.className).not.toMatch(/\bhidden\b/);
      node = node.parentElement;
    }
  });

  /** A tab that was already offline when it opened still shows the notice. */
  it("shows the notice on a tab opened while offline", () => {
    setConnection(false);

    renderWithIntl(<TopBar />);

    expect(screen.getByText("Offline")).toBeInTheDocument();
  });
});

describe("TopBar — the running session", () => {
  const seedRunning = async (
    taskId: number | undefined,
    minutesAgo: number
  ) => {
    const id = await pomodoroDB.start(taskId, 25);
    await db.pomodoros.update(id, {
      startTime: new Date(Date.now() - minutesAgo * 60_000),
    });
    return id;
  };

  /**
   * The gap this closes: a session started and then left behind was invisible
   * everywhere else in the app. A clock you have to go and look for is not a
   * clock.
   */
  it("shows the time left wherever you are", async () => {
    await seedRunning(7, 10);
    renderWithIntl(<TopBar />);

    expect(await screen.findByText(/Focusing · 15:00/)).toBeInTheDocument();
  });

  it("links back to the session it belongs to", async () => {
    await seedRunning(7, 1);
    renderWithIntl(<TopBar />);

    expect(
      await screen.findByRole("link", { name: /back to the session/i })
    ).toHaveAttribute("href", "/home/timer/7");
  });

  it("points at the free timer for a session with no task", async () => {
    await seedRunning(undefined, 1);
    renderWithIntl(<TopBar />);

    expect(
      await screen.findByRole("link", { name: /back to the session/i })
    ).toHaveAttribute("href", "/home/timer/free");
  });

  it("says nothing when nothing is running", async () => {
    renderWithIntl(<TopBar />);

    // The mood pill renders twice (desktop row and mobile bar), so this waits
    // for the chrome without asserting there is only one of it.
    await screen.findAllByText("Set your mood");
    expect(screen.queryByText(/Focusing/)).not.toBeInTheDocument();
    expect(screen.queryByText(/On a break/)).not.toBeInTheDocument();
  });

  /** A break has a clock and a screen of its own; leaving it out of the
      chrome would make the five minutes after a session feel like a dead end. */
  it("shows a break as readily as a session", async () => {
    const id = await seedRunning(7, 26);
    await pomodoroDB.complete(id);

    renderWithIntl(<TopBar />);

    expect(await screen.findByText(/On a break · 04:00/)).toBeInTheDocument();
  });

  /** "After": an abandoned session leaves nothing counting. */
  it("drops the clock once the session is ended", async () => {
    const id = await seedRunning(7, 1);
    renderWithIntl(<TopBar />);
    await screen.findByText(/Focusing/);

    await pomodoroDB.abandon(id);

    await waitFor(() =>
      expect(screen.queryByText(/Focusing/)).not.toBeInTheDocument()
    );
  });
});
