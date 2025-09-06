import WaveDivider from "./ui/WaveDivider";
import { Button } from "@/components/ui";

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
        <Button
          href="/signup"
          size="lg"
          aria-label="Sign up for FocusPond"
          className="relative overflow-hidden font-semibold mt-6 group"
        >
          <span className="relative z-10">Start for free</span>
          <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>

      {/* SVG Curve at Bottom */}
      <div className="absolute bottom-0 left-0 w-full leading-none">
        <WaveDivider fill="#a8c6861a" />
      </div>
    </section>
  );
};

export default CtaBanner;
