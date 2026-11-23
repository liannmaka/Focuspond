import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useOnlineStatus } from "./useOnlineStatus";

/** jsdom reports `navigator.onLine` as true and never changes it on its own. */
const setConnection = (online: boolean) => {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value: online,
  });
};

const fire = (event: "online" | "offline") => {
  act(() => {
    window.dispatchEvent(new Event(event));
  });
};

afterEach(() => setConnection(true));

describe("useOnlineStatus", () => {
  it("reports a live connection", () => {
    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current).toBe(true);
  });

  it("notices the connection dropping", () => {
    const { result } = renderHook(() => useOnlineStatus());

    setConnection(false);
    fire("offline");

    expect(result.current).toBe(false);
  });

  it("notices it coming back", () => {
    const { result } = renderHook(() => useOnlineStatus());

    setConnection(false);
    fire("offline");
    setConnection(true);
    fire("online");

    expect(result.current).toBe(true);
  });

  /**
   * The events only fire on *changes*. A tab opened while already offline
   * would never hear one, so the hook reads the current state once on mount.
   */
  it("notices a tab that was already offline when it opened", () => {
    setConnection(false);

    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current).toBe(false);
  });

  /** "Twice": nothing accumulates, and a second drop still registers. */
  it("keeps working across repeated changes", () => {
    const { result } = renderHook(() => useOnlineStatus());

    for (let i = 0; i < 3; i++) {
      setConnection(false);
      fire("offline");
      expect(result.current).toBe(false);

      setConnection(true);
      fire("online");
      expect(result.current).toBe(true);
    }
  });

  /** An unmounted hook must not be left listening on `window`. */
  it("stops listening once unmounted", () => {
    const { result, unmount } = renderHook(() => useOnlineStatus());
    unmount();

    setConnection(false);
    fire("offline");

    expect(result.current).toBe(true);
  });
});
