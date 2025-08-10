const SectionDivider = () => {
  return (
    <div className="relative my-6">
      <div className="h-px bg-light-background/30 w-full" />
      {/* 2. Centered “drop” diamond */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="size-3.5 bg-accent-button rotate-45" />
      </div>
    </div>
  );
};

export default SectionDivider;
