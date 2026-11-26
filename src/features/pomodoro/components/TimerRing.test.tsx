import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import TimerRing from "./TimerRing";

/** The sweeping circle is the second one; the first is the track behind it. */
const sweep = (container: HTMLElement) =>
  container.querySelectorAll("circle")[1];

const circumference = (container: HTMLElement) =>
  Number(sweep(container).getAttribute("stroke-dasharray"));

describe("TimerRing", () => {
  it("shows the clock it is drawn around", () => {
    render(
      <TimerRing fraction={0}>
        <span>24:59</span>
      </TimerRing>
    );

    expect(screen.getByText("24:59")).toBeInTheDocument();
  });

  /**
   * The ring says what the digits already say, so it is hidden from assistive
   * tech. Nobody should have to hear a circle described.
   */
  it("is hidden from assistive technology", () => {
    const { container } = render(
      <TimerRing fraction={0.5}>
        <span>12:30</span>
      </TimerRing>
    );

    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden");
  });

  it("draws nothing at the start of a session", () => {
    const { container } = render(
      <TimerRing fraction={0}>
        <span>25:00</span>
      </TimerRing>
    );

    expect(Number(sweep(container).getAttribute("stroke-dashoffset"))).toBe(
      circumference(container)
    );
  });

  it("closes the ring when the session is done", () => {
    const { container } = render(
      <TimerRing fraction={1}>
        <span>00:00</span>
      </TimerRing>
    );

    expect(Number(sweep(container).getAttribute("stroke-dashoffset"))).toBe(0);
  });

  it("is half drawn at half time", () => {
    const { container } = render(
      <TimerRing fraction={0.5}>
        <span>12:30</span>
      </TimerRing>
    );

    expect(
      Number(sweep(container).getAttribute("stroke-dashoffset"))
    ).toBeCloseTo(circumference(container) / 2);
  });

  /**
   * Drawing code clamps too: a fraction slightly outside the range — a clock a
   * hair ahead, a rounding error — should give a full or empty ring, never a
   * dash offset that wraps back around and reads as the opposite.
   */
  it("clamps a fraction that strays outside its range", () => {
    const over = render(
      <TimerRing fraction={1.4}>
        <span>00:00</span>
      </TimerRing>
    );
    expect(
      Number(sweep(over.container).getAttribute("stroke-dashoffset"))
    ).toBe(0);

    const under = render(
      <TimerRing fraction={-0.3}>
        <span>25:00</span>
      </TimerRing>
    );
    expect(
      Number(sweep(under.container).getAttribute("stroke-dashoffset"))
    ).toBe(circumference(under.container));
  });

  /** Someone who asked for less motion gets a clock that moves without it. */
  it("does not animate when motion is unwelcome", () => {
    const { container } = render(
      <TimerRing fraction={0.3}>
        <span>17:30</span>
      </TimerRing>
    );

    expect(sweep(container).getAttribute("class")).toContain(
      "motion-reduce:transition-none"
    );
  });
});
