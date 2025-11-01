"use client";

import clsx from "clsx";
import heroImage from "../../../../public/lotties/hero-illustration-3.json";
import { Button } from "@/components/ui";
import { useLottie } from "lottie-react";
import { ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const options = { animationData: heroImage, loop: true, autoplay: true };
  const { View, animationItem } = useLottie(options);

  useEffect(() => {
    if (animationItem) setIsLoaded(true);
  }, [animationItem]);

  return (
    // remove the px-26 below
    <section className="hero-section-wrapper content-center pb-5 md:pb-0 px-26">
      <div className="grid lg:grid-cols-2 lg:gap-12 gap-4 items-center">
        {/* Text Section */}
        {/* <div>
          <h1>Crush your goals, not your energy.</h1>
          <p className="font-manrope mt-6 text-base sm:text-lg max-w-md">
            Focuspond is a productivity and wellness web app that helps you stay
            focused, take mindful breaks, and end your day with calm clarity.
          </p>
          <div className="mt-8 flex sm:space-x-4">
            <Button
              href="/waitlist"
              size="lg"
              aria-label="Sign up for FocusPond"
              className="relative overflow-hidden font-semibold group"
            >
              <span className="relative z-10">Get Early Access</span>
              <span className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <div className="hidden sm:block">
              <Button
                variant="ghost"
                href="#benefits"
                size="sm"
              >
                <div className="inline-flex group font-medium hover:underline tracking-wide">
                  <span>Learn More</span>
                  <ChevronsRight
                    aria-hidden="true"
                    className="size-4 self-center group-hover:translate-x-0.5 will-change-transform transition-transform duration-300"
                  />
                </div>
              </Button>
            </div>
          </div>
        </div> */}

        {/* reverse this */}
        <div>
          <h1 className="text-3xl">Crush your goals, not your energy.</h1>
          <p className="font-manrope mt-6 text-base max-w-md">
           Your calm space to plan, focus, and reflect.         </p>
          <div className="mt-8 flex sm:space-x-4">
            <Button
              href="/waitlist"
              size="sm"
              aria-label="Sign up for FocusPond"
              className="relative overflow-hidden font-semibold group"
            >
              <span className="relative z-10">Get Early Access</span>
              <span className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <div className="hidden sm:block">
              <Button
                variant="ghost"
                href="#benefits"
                size="sm"
              >
                <div className="inline-flex group font-medium hover:underline tracking-wide">
                  <span>Learn More</span>
                  <ChevronsRight
                    aria-hidden="true"
                    className="size-4 self-center group-hover:translate-x-0.5 will-change-transform transition-transform duration-300"
                  />
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Visual Section */}
        <div
          className={clsx(
            "md:mb-14 lg:mb-16 relative aspect-146/101 overflow-hidden",
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
