"use client";

import React from "react";
import WaveDivider from "./ui/WaveDivider";
import { Badge, Button } from "@/components/ui";
import { HowItWork } from "@/types/landing-page";
import { steps } from "@/data/landing-page/howitworks";

const HowItWorks = () => {
  return (
    <section className="pt-20 pb-28 bg-secondary-accent/10 relative overflow-hidden">
      <div className="content-center">
        <div>
          <Badge title="How It Works" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sora font-semibold leading-tight text-darker-accent">
            Flow through your day with ease.
          </h2>
          <p className="paragraph-for-gb">
            A gentle rhythm to help you plan, focus, and reflect with ease.
          </p>
        </div>

        {/* Timeline Line + Icons + Text */}
        <div className="relative my-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-10 text-center">
            {steps.map(
              ({ Icon, title, description }: HowItWork, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col items-center px-2 text-[#5a3a24]"
                >
                  <div className="bg-white/80 p-4 rounded-full mb-10 shadow-sm z-10">
                    <Icon className="w-6 h-6 text-[#ff9472]" />
                  </div>
                  <h3 className="text-base font-semibold font-sora">{title}</h3>
                  <p className="font-manrope text-sm mt-2 max-w-xs">
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
            href="/signup"
            aria-label="Sign up for FocusPond"
            className="font-medium"
          >
            Pick Your First Frog
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
