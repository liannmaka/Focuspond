import { afterEach, describe, expect, it, vi } from "vitest";

import { guardWrite, onWriteFailure, type WriteFailure } from "./writeGuard";

/** Collects failures for the duration of one test. */
const listen = () => {
  const seen: WriteFailure[] = [];
  const stop = onWriteFailure((failure) => seen.push(failure));
  return { seen, stop };
};

const quotaError = () => {
  const error = new Error("The quota has been exceeded.");
  error.name = "QuotaExceededError";
  return error;
};

afterEach(() => vi.restoreAllMocks());

describe("guardWrite", () => {
  it("passes a successful write straight through", async () => {
    const { seen, stop } = listen();

    const result = await guardWrite("task.add", async () => 7);

    expect(result).toBe(7);
    expect(seen).toHaveLength(0);
    stop();
  });

  /**
   * A failed delete must not take the screen down with it. Every caller here
   * is a click handler, and an unhandled rejection in one is either a blank
   * error boundary or nothing at all, depending on how it was called.
   */
  it("does not throw when the write fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { stop } = listen();

    await expect(
      guardWrite("task.delete", async () => {
        throw new Error("nope");
      })
    ).resolves.toBeUndefined();

    stop();
  });

  /** Not throwing is not the same as not telling. */
  it("reports what failed", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { seen, stop } = listen();

    await guardWrite("reflection.save", async () => {
      throw new Error("nope");
    });

    expect(seen).toHaveLength(1);
    expect(seen[0].operation).toBe("reflection.save");
    stop();
  });

  /**
   * Out of space needs different advice from a refused write — "try again"
   * is useless when the disk is full — so the failure says which it was.
   */
  it("recognises running out of room", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { seen, stop } = listen();

    await guardWrite("task.add", async () => {
      throw quotaError();
    });

    expect(seen[0].outOfSpace).toBe(true);
    stop();
  });

  it("treats an ordinary failure as something other than full", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { seen, stop } = listen();

    await guardWrite("task.add", async () => {
      throw new Error("transaction aborted");
    });

    expect(seen[0].outOfSpace).toBe(false);
    stop();
  });

  /** Dexie wraps the original, so the DOM type is not what arrives. */
  it("recognises a quota error that is not a DOMException", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { seen, stop } = listen();

    await guardWrite("task.add", async () => {
      throw { name: "QuotaExceededError", message: "wrapped by Dexie" };
    });

    expect(seen[0].outOfSpace).toBe(true);
    stop();
  });

  it("still writes the failure to the console for whoever is debugging", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});
    const { stop } = listen();

    await guardWrite("session.start", async () => {
      throw new Error("nope");
    });

    expect(logged).toHaveBeenCalled();
    stop();
  });

  it("tells every listener", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const a = listen();
    const b = listen();

    await guardWrite("task.frog", async () => {
      throw new Error("nope");
    });

    expect(a.seen).toHaveLength(1);
    expect(b.seen).toHaveLength(1);
    a.stop();
    b.stop();
  });

  /** "Undo": a listener that has gone away must stop hearing about it. */
  it("stops telling a listener that unsubscribed", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { seen, stop } = listen();
    stop();

    await guardWrite("task.update", async () => {
      throw new Error("nope");
    });

    expect(seen).toHaveLength(0);
  });
});
