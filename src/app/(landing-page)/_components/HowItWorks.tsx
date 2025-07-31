"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Timer, HeartPulse, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui";

export default function HowItWorksIcons() {
  const steps = [
    {
      icon: <HeartPulse className="w-6 h-6 text-[#ff9472]" />,
      title: "Check Your Mood",
      desc: "Log how you feel to stay aware of your energy.",
    },
    {
      icon: <Calendar className="w-6 h-6 text-[#ff9472]" />,
      title: "Plan Your Day",
      desc: "Pick your Frog of the Day to focus on what matters most.",
    },
    {
      icon: <Timer className="w-6 h-6 text-[#ff9472]" />,
      title: "Start a Sprint",
      desc: "Use the Pomodoro timer to work deeply and rest mindfully.",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#ff9472]" />,
      title: "Reflect & Grow",
      desc: "Review your wins and lessons to reset for tomorrow.",
    },
  ];

  return (
    <section className="pt-20 pb-28 bg-[#a8c686]/10 relative overflow-hidden">
      <div className="container mx-auto px-7">
        <div>
          <Badge title="The FocusPond Way" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sora font-semibold leading-tight text-[#6f472d]">
            Flow through your day with ease.
          </h2>
          <p className="mt-4 font-manrope text-base sm:text-lg text-[#5a3a24]">
            A gentle rhythm to help you plan, focus, and reflect with ease.
          </p>
        </div>

        {/* Timeline Line + Icons + Text */}
        <div className="relative my-20">
          {/* Connecting line behind the icons */}
          <div className="absolute top-6 left-0 w-full h-px bg-gray-200 z-0 hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-10 text-center relative z-10">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center px-2 text-[#5a3a24]"
              >
                <div className="bg-white/60 p-4 rounded-full mb-10 shadow-sm z-10">
                  {step.icon}
                </div>
                <h3 className="text-base font-semibold font-sora">
                  {step.title}
                </h3>
                <p className="font-manrope text-sm mt-2 max-w-xs">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/signup"
            aria-label="Sign up for FocusPond"
            className="inline-block bg-accent-button text-white font-semibold px-6 py-3 rounded-lg tracking-wider shadow-md hover:scale-[1.02] transition duration-200 text-sm sm:text-base font-sora"
          >
            Pick Your First Frog
          </Link>
        </div>
      </div>

      {/* Decorative Wave at Bottom */}
      <div className="absolute bottom-0 left-0 w-full leading-none">
        <svg
          viewBox="0 0 1440 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="block w-full h-[100px] sm:h-[140px] md:h-[200px]"
        >
          <path
            fill="#fdf9f3"
            d="M0,80 Q720,200 1440,80 L1440,200 L0,200 Z"
          />
        </svg>
      </div>
    </section>
  );
}
