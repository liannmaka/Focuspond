"use client";

import Button from "@/components/ui/Button";
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
          <div className="mt-8 flex space-x-4">
            <Button
              href="/signup"
              size="lg"
              aria-label="Sign up for FocusPond"
              className="font-semibold tracking-wider"
            >
              Start free
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
                  className="size-4 self-center group-hover:translate-x-1 will-change-transform"
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Visual Section */}
        <div className="md:mb-14 lg:mb-16">
          <Lottie animationData={heroImage} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
