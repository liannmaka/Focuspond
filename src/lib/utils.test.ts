import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cn, getTimeBasedGreeting, getTimeBasedQuestion } from "@/lib/utils";

describe("cn", () => {
  it("merges conditional classes and dedupes conflicting Tailwind utilities", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe(
      "text-sm font-bold"
    );
  });
});

describe("getTimeBasedGreeting", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const at = (hour: number) => {
    vi.setSystemTime(new Date(2026, 0, 1, hour, 0, 0));
    return getTimeBasedGreeting();
  };

  it("returns 'morning' between 05:00 and 11:59", () => {
    expect(at(5)).toBe("morning");
    expect(at(11)).toBe("morning");
  });

  it("returns 'afternoon' between 12:00 and 16:59", () => {
    expect(at(12)).toBe("afternoon");
    expect(at(16)).toBe("afternoon");
  });

  it("returns 'evening' between 17:00 and 21:59", () => {
    expect(at(17)).toBe("evening");
    expect(at(21)).toBe("evening");
  });

  it("returns 'night' between 22:00 and 04:59", () => {
    expect(at(22)).toBe("night");
    expect(at(0)).toBe("night");
    expect(at(4)).toBe("night");
  });
});

describe("getTimeBasedQuestion", () => {
  it("embeds the current greeting", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9, 0, 0));
    expect(getTimeBasedQuestion()).toBe("How are you feeling this morning?");
    vi.useRealTimers();
  });
});
