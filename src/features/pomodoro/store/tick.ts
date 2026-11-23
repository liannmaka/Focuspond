"use client";

import { useEffect } from "react";
import { create } from "zustand";

/**
 * One clock for the whole app.
 *
 * This is the store CLAUDE.md has been holding Zustand in reserve for, and the
 * reason is **agreement, not performance**. Until now a single surface showed
 * the time, so a `useState` inside `usePomodoro` was enough. Now the focus
 * screen, the top bar, the frog card and a task row can all be showing the same
 * session at once — and if each ran its own `setInterval`, each would have its
 * own `now`, set a few hundred milliseconds apart. Two clocks on one screen
 * reading 18:42 and 18:41 is worse than one clock.
 *
 * It is also the one kind of state a Zustand store is right for here: `now` is
 * genuinely ephemeral and deliberately **not** persisted. Everything durable
 * still lives in IndexedDB and arrives through `useLiveQuery` — this store
 * holds no session, no task and no derived time, only the instant to measure
 * them against.
 *
 * The interval runs only while something is counting. Subscribers are counted
 * rather than tracked, because all any of them needs is the same number.
 */
type TickStore = {
  /** Epoch milliseconds, refreshed once a second while anything is counting. */
  now: number;
  listeners: number;
  subscribe: () => void;
  unsubscribe: () => void;
};

let interval: ReturnType<typeof setInterval> | null = null;

export const useTickStore = create<TickStore>((set, get) => ({
  now: Date.now(),
  listeners: 0,

  subscribe: () => {
    // Refreshed on *every* subscribe, not only when the interval starts. The
    // shared instant is up to a second old at any moment, which is invisible
    // on a clock that is already ticking but wrong for a surface appearing
    // now: it would measure its first frame against the previous tick and
    // read a second high — 15:01 left on a session with 15:00 to go.
    set({ now: Date.now(), listeners: get().listeners + 1 });
    if (interval) return;

    interval = setInterval(() => set({ now: Date.now() }), 1000);
  },

  unsubscribe: () => {
    const listeners = Math.max(0, get().listeners - 1);
    set({ listeners });

    if (listeners === 0 && interval) {
      clearInterval(interval);
      interval = null;
    }
  },
}));

/**
 * The shared clock, in milliseconds.
 *
 * `active` says whether this caller needs it to move. An inactive caller
 * selects a constant, so it does not re-render every second for a clock it is
 * not showing, and it does not hold the interval open either.
 */
export function useTick(active: boolean): number {
  const ticking = useTickStore((state) => (active ? state.now : 0));

  useEffect(() => {
    if (!active) return;

    const { subscribe, unsubscribe } = useTickStore.getState();
    subscribe();
    return unsubscribe;
  }, [active]);

  return active ? ticking : Date.now();
}

/** Test seam: drops the interval and the count between tests. */
export function resetTickStore(): void {
  if (interval) clearInterval(interval);
  interval = null;
  useTickStore.setState({ now: Date.now(), listeners: 0 });
}
