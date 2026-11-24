import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithIntl, screen } from "@/test/renderWithIntl";
import type { DatabaseStatus } from "@/lib/db/useDatabaseStatus";
import StorageNotice from "./StorageNotice";

let status: DatabaseStatus = "open";

vi.mock("@/lib/db/useDatabaseStatus", () => ({
  useDatabaseStatus: () => status,
}));

afterEach(() => {
  status = "open";
});

describe("StorageNotice", () => {
  it("says nothing while the database is opening", () => {
    status = "opening";
    renderWithIntl(<StorageNotice />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("says nothing once it is open", () => {
    status = "open";
    renderWithIntl(<StorageNotice />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  /**
   * Live queries return `undefined` while loading and `undefined` forever when
   * the database will not open, so without this the app shimmers politely for
   * good — and anything typed into it is not being kept.
   */
  it("says so plainly when storage is refused", () => {
    status = "failed";
    renderWithIntl(<StorageNotice />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      /can’t reach its storage/i
    );
    expect(screen.getByRole("alert")).toHaveTextContent(/will not be kept/i);
  });

  /**
   * Worth its own message: another tab holding an old version is something the
   * reader can actually fix, where a refused database usually is not.
   */
  it("tells the reader what to do when another tab is holding the data", () => {
    status = "blocked";
    renderWithIntl(<StorageNotice />);

    expect(screen.getByRole("alert")).toHaveTextContent(/another tab/i);
    expect(screen.getByRole("alert")).toHaveTextContent(/nothing is lost/i);
  });

  it("does not block the screen", () => {
    status = "failed";
    const { container } = renderWithIntl(<StorageNotice />);

    // A band, not a dialog: the reader cannot fix a browser setting from here,
    // so taking the screen away would only remove what they can still do.
    expect(container.querySelector("[aria-modal]")).not.toBeInTheDocument();
  });
});
