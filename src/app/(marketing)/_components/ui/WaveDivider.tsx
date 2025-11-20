type WaveDividerProps = {
  className?: string;
  fill?: string;
};

const WaveDivider = ({ className, fill = "#fdf9f3" }: WaveDividerProps) => {
  return (
    <svg
      viewBox="0 0 1440 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={`block w-full h-[100px] sm:h-[140px] md:h-[200px]${className}`}
    >
      <path
        fill={fill}
        d="M0,80 Q720,200 1440,80 L1440,200 L0,200 Z"
      />
    </svg>
  );
};

export default WaveDivider;
