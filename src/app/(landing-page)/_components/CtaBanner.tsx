import Link from "next/link";

const CtaBanner = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="content-center pt-28 pb-20 md:pb-28 text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sora font-semibold">
          Start your day with clarity
        </h2>
        <p className="mt-4 font-manrope text-base sm:text-lg">
          No account needed. Works offline. Zero pressure.
        </p>
        <Link
          href="/signup"
          aria-label="Sign up for FocusPond"
          className="inline-block mt-6 bg-accent-button text-white font-semibold px-6 py-3 rounded-lg tracking-wider shadow-md hover:scale-[1.02] transition duration-200 text-sm sm:text-base sm:px-6 sm:py-3 font-sora"
        >
          Start free
        </Link>
      </div>

      {/* SVG Curve at Bottom */}
      <div className="absolute bottom-0 left-0 w-full leading-none">
        <svg
          viewBox="0 0 1440 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="block w-full h-[100px] sm:h-[140px] md:h-[200px]"
        >
          <path
            fill="#a8c6861a"
            d="M0,80 Q720,200 1440,80 L1440,200 L0,200 Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default CtaBanner;
