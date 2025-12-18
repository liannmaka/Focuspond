"use client";

import React from "react";
import WaveDivider from "./ui/WaveDivider";
import { Badge, Button } from "@/components/ui";
import { HowItWork } from "@/types/landing-page";
import { steps } from "@/data/landing-page/howitworks";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="pt-20 pb-28 bg-secondary-accent/10 relative overflow-hidden"
    >
      <div className="content-center">
        <div className="text-center">
          <Badge title="How It Works" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sora font-semibold leading-tight text-darker-accent">
            Flow through your day with ease.
          </h2>
          <p className="paragraph-for-gb max-w-xl mx-auto">
            Find your rhythm, plan with clarity, focus with calm, and end your
            day with intention.
          </p>
        </div>

        {/* Steps grid */}
        <div className="relative my-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-10 text-center">
            {steps.map(
              ({ Icon, title, description }: HowItWork, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col items-center px-2 text-[#5a3a24] transition-all duration-300 transform hover:-translate-y-1"
                  aria-hidden={false}
                >
                  <div className="bg-white/90 p-4 rounded-full mb-8 shadow-sm z-10">
                    <Icon className="w-6 h-6 text-[#ff9472]" />
                  </div>

                  <h3 className="text-base font-semibold font-sora mb-2">
                    {title}
                  </h3>

                  <p className="font-manrope text-sm max-w-xs leading-relaxed">
                    {description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center relative z-10">
          <Button
            href="/mood"
            size="lg"
            aria-label="Sign up for FocusPond"
            className="relative overflow-hidden font-semibold group"
          >
            <span className="relative z-10">Start for free</span>
            <span className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>
      </div>

      {/* Decorative Wave at Bottom */}
      <div className="absolute bottom-0 left-0 w-full leading-none">
        <WaveDivider />
      </div>
    </section>
  );
};

export default HowItWorks;
