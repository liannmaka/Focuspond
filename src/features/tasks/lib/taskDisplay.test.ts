import { describe, expect, it } from "vitest";

import { energyRank, energyTagKey, focusBlocksFor } from "./taskDisplay";

describe("focusBlocksFor", () => {
  it("rounds a partial block up — a 30-minute task needs two sittings", () => {
    expect(focusBlocksFor(30)).toBe(2);
    expect(focusBlocksFor(26)).toBe(2);
  });

  it("maps exact multiples without inflating them", () => {
    expect(focusBlocksFor(25)).toBe(1);
    expect(focusBlocksFor(50)).toBe(2);
  });

  it("never returns zero — a five-minute task is still one sitting", () => {
    expect(focusBlocksFor(5)).toBe(1);
    expect(focusBlocksFor(0)).toBe(1);
  });
});

describe("energyTagKey", () => {
  it("namespaces under `energy.` so the catalog owns the copy", () => {
    expect(energyTagKey("high")).toBe("energy.high");
    expect(energyTagKey("low")).toBe("energy.low");
  });
});

describe("energyRank", () => {
  it("orders low < medium < high", () => {
    expect(energyRank("low")).toBeLessThan(energyRank("medium"));
    expect(energyRank("medium")).toBeLessThan(energyRank("high"));
  });

  /**
   * The rule the frog picker will use in M2: a task fits when it demands no
   * more than the reader has. Pinned here so the ordering can't silently flip.
   */
  it("lets a lighter task fit a higher energy, but not the reverse", () => {
    expect(energyRank("low") <= energyRank("high")).toBe(true);
    expect(energyRank("high") <= energyRank("low")).toBe(false);
  });
});
