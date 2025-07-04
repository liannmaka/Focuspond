"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AlertCircle, Zap, Sun, BarChart2 } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface PainSolutionData {
  title: string;
  problem: string;
  promise: string;
  payoff: string;
  Icon: LucideIcon;
}

const painSolutionData: PainSolutionData[] = [
  {
    title: "Procrastination & Overwhelm",
    problem:
      "It’s hard to begin when a task feels too big, vague, or intimidating. So you delay it altogether.",
    promise: "FocusPond helps you break the inertia.",
    payoff:
      "You’ll pick your Frog of the Day and dive straight into a focused 25-minute Pomodoro to gain momentum.",
    Icon: AlertCircle,
  },
  {
    title: "Low Energy Slumps",
    problem:
      "You want to work, but low energy or mental fatigue keeps you stuck and frustrated.",
    promise: "FocusPond meets you where you are.",
    payoff:
      "Use Mini‑Frog Mode to complete small wins and keep your streak alive on tough days.",
    Icon: Zap,
  },
  {
    title: "Burnout & Unsustainable Routines",
    problem:
      "Overworking leads to burnout, making it harder to stay consistent.",
    promise: "FocusPond encourages balance, not hustle.",
    payoff:
      "Alternate Pomodoros with mindful breaks, and never feel punished for missing a Frog, just keep moving.",
    Icon: Sun,
  },
  {
    title: "Lack of Insight & No Sense of Progress",
    problem:
      "You’re busy all day but have no clear sense of what you’ve accomplished.",
    promise: "FocusPond makes progress visible.",
    payoff:
      "See every Frog and Pomodoro logged in your dashboard, and earn garden blooms that track real focus.",
    Icon: BarChart2,
  },
];

const PainSolutionSection = () => {
  return (
    <section className="py-2 bg-[#fdf9f3]">
      {painSolutionData.map(
        ({ title, problem, promise, payoff, Icon }, idx) => (
          <motion.div
            key={idx}
            className={`flex flex-col md:flex-row ${
              idx % 2 ? "md:flex-row-reverse" : ""
            } items-center py-9 px-7 gap-13
                      `}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
          >
            {/* Text Column */}
            <div className="md:w-1/2 space-y-4">
              <div className="flex items-center space-x-3">
                <Icon className="w-6 h-6 text-[#ff9472]" />
                <h3 className="text-xl font-semibold text-[#8b5e3c]">
                  {title}
                </h3>
              </div>
              <p className="text-sm text-[#5c4a38]/90 italic">{problem}</p>
              <p className="text-sm text-[#5c4a38] font-medium">{promise}</p>
              <p className="text-sm text-[#5c4a38]">{payoff}</p>
            </div>

            {/* Illustration Column */}
            <div className="md:w-1/2 bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-lg ring-1 ring-white/10">
              <Image
                src={`/svgs/solution-${idx + 1}.svg`}
                alt={title}
                width={400}
                height={300}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        )
      )}
    </section>
  );
};

export default PainSolutionSection;
