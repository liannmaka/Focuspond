import { describe, expect, it } from "vitest";

import { sectionFor, sections, tabs } from "./navigation";

describe("sectionFor", () => {
  /** Most specific first: /home/timer lives under /home but is its own place. */
  it("puts the focus screen in its own section", () => {
    expect(sectionFor("/home/timer/free")).toBe("focus");
    expect(sectionFor("/home/timer/7")).toBe("focus");
  });

  it("puts every task list under tasks", () => {
    for (const { href } of tabs) {
      expect(sectionFor(href)).toBe("home");
    }
  });

  it("knows progress and mood", () => {
    expect(sectionFor("/analytics")).toBe("analytics");
    expect(sectionFor("/mood")).toBe("mood");
  });

  it("has an answer for anywhere else", () => {
    expect(sectionFor("/login")).toBe("others");
    expect(sectionFor("/")).toBe("others");
  });
});

describe("the sections themselves", () => {
  /**
   * The rail and the bottom bar read this same list. They used to hold
   * different ones, which is how a phone ended up with no way to reach
   * Progress, Mood or a free focus session at all.
   */
  it("gives every section a destination that resolves back to it", () => {
    for (const { href, section } of sections) {
      expect(sectionFor(href)).toBe(section);
    }
  });

  it("covers the four places the app goes", () => {
    expect(sections.map((s) => s.key)).toEqual([
      "tasks",
      "focus",
      "progress",
      "mood",
    ]);
  });

  it("has no duplicate destinations", () => {
    const hrefs = sections.map((s) => s.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
