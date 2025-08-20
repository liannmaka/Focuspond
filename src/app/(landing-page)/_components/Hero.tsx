"use client";

import clsx from "clsx";
import heroImage from "../../../../public/lotties/hero-illustration-3.json";
import { Button } from "@/components/ui";
import { useLottie } from "lottie-react";
import { ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const options = { animationData: heroImage, loop: true, autoplay: true };
  const { View, animationItem } = useLottie(options);

  useEffect(() => {
    if (animationItem) setIsLoaded(true);
  }, [animationItem]);

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
            <Button
              href="/signup"
              size="lg"
              aria-label="Sign up for FocusPond"
              className="relative overflow-hidden font-semibold group"
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
            "md:mb-14 lg:mb-16 relative aspect-[146/101] overflow-hidden",
            !isLoaded && "bg-gray-300/30 rounded-xl mt-8 lg:mt-0"
          )}
        >
          {!isLoaded && <span className="absolute inset-0 animate-shimmer" />}

          <div
            className={clsx(
              "transition-opacity duration-500 w-full h-full",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          >
            {View}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
