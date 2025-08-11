"use client";

import Button from "@/components/ui/Button";
import Lottie from "lottie-react";
import clsx from "clsx";
import heroImage from "../../../../public/lotties/hero-illustration-3.json";
import { ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  console.log("isLoaded", isLoaded);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      console.log("inside setTimer isLoaded", isLoaded);
    }, 400);
    console.log("outside setTimer isLoaded", isLoaded);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section-wrapper flex-center content-center">
      <div className="grid lg:grid-cols-2 lg:gap-12 gap-4 items-center h-full">
        {/* Text Section */}
        <div>
          <h1>Crush your goals, not your energy.</h1>
          <p className="font-manrope mt-6 text-base sm:text-lg max-w-md">
            Turn your low-energy days into consistent wins with focused, mindful
            progress.
          </p>
          <div className="mt-8 flex space-x-4">
            {/* <Button
              href="/signup"
              size="lg"
              aria-label="Sign up for FocusPond"
              className="relative overflow-hidden font-semibold tracking-wider group"
            >
              <span className="relative z-10">Start free</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="absolute inset-0 animate-shimmer" />
              </span>
            </Button> */}

            <Button
              href="/signup"
              size="lg"
              aria-label="Sign up for FocusPond"
              className="relative overflow-hidden font-semibold tracking-wider group"
            >
              <span className="relative z-10">Start free</span>
              <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <Button
              variant="ghost"
              href="#benefits"
              size="sm"
            >
              <div className="group inline-flex font-medium hover:underline tracking-wide">
                <span>Learn More</span>
                <ChevronsRight
                  aria-hidden="true"
                  className="size-4 self-center group-hover:translate-x-0.5 will-change-transform transition-transform duration-300"
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Visual Section */}
        <div
          className={clsx(
            "md:mb-14 lg:mb-16 relative",
            !isLoaded ? "min-h-[300px] md:min-h-[400px]" : ""
          )}
        >
          {!isLoaded && (
            <>
              <div className="absolute inset-0 bg-gray-300/30 rounded-xl mt-8 w-full h-full " />
              <span className="absolute inset-0 animate-shimmer" />
            </>
          )}
          <Lottie
            animationData={heroImage}
            className={clsx(
              "transition-opacity duration-500",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
