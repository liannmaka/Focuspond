import { describe, expect, it, afterEach } from "vitest";
import { act } from "@testing-library/react";

import { renderWithIntl, screen } from "@/test/renderWithIntl";
import OfflinePage from "./page";

const setConnection = (online: boolean) => {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value: online,
  });
};

const goOffline = () => {
  setConnection(false);
  act(() => {
    window.dispatchEvent(new Event("offline"));
  });
};

const goOnline = () => {
  setConnection(true);
  act(() => {
    window.dispatchEvent(new Event("online"));
  });
};

afterEach(() => setConnection(true));

describe("the offline screen", () => {
  /**
   * This page is precached and wired as the service worker's document
   * fallback, so it has been live from the start — as `<div>offline page</div>`
   * exported from a function called `LoginPage`. An installed app's first
   * failure is the worst moment to look broken.
   */
  it("says what has happened when there is no connection", () => {
    setConnection(false);
    renderWithIntl(<OfflinePage />);

    expect(
      screen.getByRole("heading", { name: /you're offline/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });

  /**
   * The honest message: FocusPond's data is in IndexedDB on the device, so
   * being offline costs almost nothing. That is reassurance, not an apology.
   */
  it("says most of the app still works", () => {
    setConnection(false);
    renderWithIntl(<OfflinePage />);

    expect(
      screen.getByText(/still works without a connection/i)
    ).toBeInTheDocument();
  });

  /** "After": the connection returns, and the page notices rather than waiting. */
  it("offers a way on once the connection is back", () => {
    setConnection(false);
    renderWithIntl(<OfflinePage />);

    goOnline();

    expect(
      screen.getByRole("heading", { name: /back online/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continue to today/i })
    ).toHaveAttribute("href", "/home/today");
    expect(
      screen.queryByRole("button", { name: /try again/i })
    ).not.toBeInTheDocument();
  });

  /** "Undo": a flaky connection must not leave the wrong screen behind. */
  it("goes back to the offline message if it drops again", () => {
    setConnection(false);
    renderWithIntl(<OfflinePage />);

    goOnline();
    goOffline();

    expect(
      screen.getByRole("heading", { name: /you're offline/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });
});
