"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import heroImage from "../../../../public/lotties/hero-illustration-3.json";
import { ChevronsRight } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="relative py-14 px-7 overflow-hidden min-h-[calc(100vh-var(--header-height))] flex items-center justify-center container mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center h-full p-">
        {/* Text Section */}
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-sora font-semibold leading-tight">
            Crush your goals, not your energy.
          </h1>
          <p className="font-manrope mt-6 text-base sm:text-lg max-w-md">
            Turn your low-energy days into consistent wins with focused, mindful
            progress.
          </p>
          <div className="mt-8 flex space-x-4 md:space-x-6 font-sora">
            <Link
              href="/signup"
              aria-label="Sign up for FocusPond"
              className="bg-accent-button text-white font-semibold px-4 py-3 rounded-lg tracking-wider shadow-md hover:scale-[1.02] transition text-sm sm:text-base sm:px-6 sm:py-3"
            >
              Start free
            </Link>

            <Link
              href="#"
              className="group text-xs font-medium hover:underline self-center sm:text-sm inline-flex"
            >
              <span>Learn More</span>
              <ChevronsRight
                aria-hidden="true"
                className="size-4 self-center group-hover:translate-x-1 will-change-transform"
              />
            </Link>
          </div>
        </div>

        {/* Visual Section */}
        <div className=" bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-lg ring-1 ring-white/10">
          <Lottie animationData={heroImage} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
