import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "@testing-library/react";
import { Toaster } from "sonner";

import { renderWithIntl, screen, waitFor } from "@/test/renderWithIntl";
import { guardWrite } from "@/lib/db/writeGuard";
import WriteFailureToaster from "./WriteFailureToaster";

const render = () =>
  renderWithIntl(
    <>
      <WriteFailureToaster />
      <Toaster />
    </>
  );

/** Fails a write of the given kind, with an optional error. */
const failWrite = async (
  operation: Parameters<typeof guardWrite>[0],
  error: unknown = new Error("nope")
) => {
  await act(async () => {
    await guardWrite(operation, async () => {
      throw error;
    });
  });
};

const quotaError = () => {
  const error = new Error("out of room");
  error.name = "QuotaExceededError";
  return error;
};

afterEach(() => vi.restoreAllMocks());

describe("WriteFailureToaster", () => {
  /**
   * The point of the whole mechanism: there is no server copy, so a silent
   * failure does not degrade into a stale screen — the work is gone at the
   * next reload and nobody was ever told.
   */
  it("says so when a write is refused", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render();

    await failWrite("task.add");

    expect(
      await screen.findByText(/Couldn’t save your new task/)
    ).toBeInTheDocument();
  });

  it("names the work that is at risk", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render();

    await failWrite("reflection.save");

    expect(
      await screen.findByText(/Couldn’t save your note/)
    ).toBeInTheDocument();
  });

  /** "Try again" is useless advice when the disk is full. */
  it("gives different advice when the device is out of room", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render();

    await failWrite("task.add", quotaError());

    expect(
      await screen.findByText(/out of storage space/i)
    ).toBeInTheDocument();
  });

  it("suggests trying again for an ordinary failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render();

    await failWrite("task.update");

    expect(
      await screen.findByText(/try again in a moment/i)
    ).toBeInTheDocument();
  });

  it("says nothing while writes are succeeding", async () => {
    render();

    await act(async () => {
      await guardWrite("task.add", async () => 1);
    });

    expect(screen.queryByText(/Couldn’t save/)).not.toBeInTheDocument();
  });

  /**
   * "Twice": storage failures arrive in bursts — the save, the retry, whatever
   * else was mid-flight. A stack of identical complaints is a worse way to
   * learn one fact.
   */
  it("keeps a burst of failures to one message", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render();

    await failWrite("task.add");
    await failWrite("task.add");
    await failWrite("task.add");

    await waitFor(() =>
      expect(screen.getAllByText(/Couldn’t save your new task/)).toHaveLength(1)
    );
  });
});
