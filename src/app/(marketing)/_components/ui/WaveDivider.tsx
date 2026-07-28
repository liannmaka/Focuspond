type WaveDividerProps = {
  className?: string;
  /**
   * Tailwind fill utility for the wave. A `fill="..."` attribute can't resolve
   * `var()`, so the colour has to arrive as a class for it to follow the theme.
   */
  fillClassName?: string;
};

const WaveDivider = ({
  className = "",
  fillClassName = "fill-surface",
}: WaveDividerProps) => {
  return (
    <svg
      viewBox="0 0 1440 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-full h-[100px] sm:h-[140px] md:h-[200px] ${className}`}
    >
      <path
        className={fillClassName}
        d="M0,80 Q720,200 1440,80 L1440,200 L0,200 Z"
      />
    </svg>
  );
};

export default WaveDivider;
