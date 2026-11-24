import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { resetTickStore, useTick, useTickStore } from "./tick";

afterEach(() => {
  resetTickStore();
  vi.useRealTimers();
});

describe("the shared tick", () => {
  it("does not run a clock nobody is watching", () => {
    renderHook(() => useTick(false));

    expect(useTickStore.getState().listeners).toBe(0);
  });

  it("runs one while something is counting", () => {
    renderHook(() => useTick(true));

    expect(useTickStore.getState().listeners).toBe(1);
  });

  /**
   * The whole reason this store exists. Four surfaces can show the same
   * session at once; with one interval each they would each hold their own
   * `now`, set milliseconds apart, and read 18:42 and 18:41 side by side.
   */
  it("gives every subscriber the same instant", () => {
    const a = renderHook(() => useTick(true));
    const b = renderHook(() => useTick(true));

    expect(a.result.current).toBe(b.result.current);
    expect(useTickStore.getState().listeners).toBe(2);
  });

  it("stops once the last watcher goes away", () => {
    const a = renderHook(() => useTick(true));
    const b = renderHook(() => useTick(true));

    a.unmount();
    expect(useTickStore.getState().listeners).toBe(1);

    b.unmount();
    expect(useTickStore.getState().listeners).toBe(0);
  });

  it("starts again after everything has unmounted", () => {
    renderHook(() => useTick(true)).unmount();
    renderHook(() => useTick(true));

    expect(useTickStore.getState().listeners).toBe(1);
  });

  it("moves forward once a second", () => {
    vi.useFakeTimers();
    const start = Date.now();
    const { result, rerender } = renderHook(() => useTick(true));

    vi.advanceTimersByTime(3000);
    rerender();

    expect(result.current).toBeGreaterThanOrEqual(start + 3000);
  });

  /**
   * A surface that appears between ticks must measure against now, not
   * against the previous tick — otherwise its first frame reads a second
   * high, which on a 15:00 session shows 15:01.
   */
  it("refreshes the instant when a new surface subscribes", () => {
    vi.useFakeTimers();
    renderHook(() => useTick(true));

    vi.advanceTimersByTime(800);
    const stale = useTickStore.getState().now;

    renderHook(() => useTick(true));

    expect(useTickStore.getState().now).toBeGreaterThan(stale);
  });

  /** An inactive caller neither holds the clock open nor re-renders with it. */
  it("ignores the clock entirely when inactive", () => {
    const active = renderHook(() => useTick(true));
    renderHook(() => useTick(false));

    expect(useTickStore.getState().listeners).toBe(1);
    expect(active.result.current).toBeGreaterThan(0);
  });
});

describe("a surface arriving between ticks", () => {
  /**
   * `subscribe()` refreshes the shared instant, but it runs in an effect —
   * after the first paint. Without a floor, that paint measures against
   * whatever the store last held, which may be frozen from before the
   * component existed: the interval stops when the last watcher leaves. It
   * showed up as a three-minute break rendering 03:01 for one frame.
   */
  it("never reads an instant older than its own mount", () => {
    vi.useFakeTimers();
    const frozen = Date.now();
    useTickStore.setState({ now: frozen, listeners: 0 });
    vi.advanceTimersByTime(5000);

    // Every render's value, not just the settled one: `renderHook`'s `result`
    // reports the value *after* effects have run, and the effect is what
    // refreshes the store — so the frame this guards is already gone by then.
    const seen: number[] = [];
    renderHook(() => {
      const value = useTick(true);
      seen.push(value);
      return value;
    });

    expect(seen[0]).toBeGreaterThanOrEqual(frozen + 5000);
  });
});
