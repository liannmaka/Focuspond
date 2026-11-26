"use client";

/**
 * The session's progress, drawn around the clock.
 *
 * Decorative in the strict sense: `elapsedFraction` says the same thing the
 * digits inside already say, so the ring is `aria-hidden` and the time keeps
 * its `role="timer"`. Nobody should have to hear a circle described.
 *
 * It fills **clockwise from twelve**, which is the one arrangement people read
 * without being told. The sweep is a stroke dash offset rather than an arc
 * path: an arc has to special-case the half-circle, and a dash does not.
 */
export default function TimerRing({
  fraction,
  children,
  size = 232,
  stroke = 6,
}: {
  /** 0 → 1 elapsed, from `elapsedFraction`. */
  fraction: number;
  /** The clock itself, centred inside the ring. */
  children: React.ReactNode;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Clamped here as well as upstream: this is drawing code, and a fraction
  // slightly outside the range (a clock a hair ahead, a rounding error) should
  // produce a full or empty ring, not a dash offset that wraps around.
  const progress = Math.min(1, Math.max(0, fraction));
  const offset = circumference * (1 - progress);

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-line"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          /*
            A one-second transition, matching the tick, so the ring sweeps
            instead of stepping. `motion-reduce` drops it: the clock still
            moves, but it moves without animating, which is what someone who
            asked for less motion asked for.
          */
          className="stroke-accent transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
