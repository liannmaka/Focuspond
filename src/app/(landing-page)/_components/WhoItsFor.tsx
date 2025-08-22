"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui";

const PERSONAS = [
  {
    id: "student",
    label: "Student",
    headline: "Focus during study sessions",
    bullets: [
      "Break big assignments into one Frog.",
      "25-min sprints reduce burnout.",
      "Mood checks help you pace study days.",
    ],
    image: "/svgs/solution-1.svg",
  },
  {
    id: "remote",
    label: "Remote worker",
    headline: "Get deep work done, from anywhere",
    bullets: [
      "Block distractions during async work.",
      "Quick notes capture ideas fast.",
      "End-of-day reflection clears tomorrow.",
    ],
    image: "/svgs/solution-1.svg",
  },
  {
    id: "side",
    label: "Side-hustler",
    headline: "Ship work without losing your day job",
    bullets: [
      "Mini-Frogs for short focused sessions.",
      "Streaks reward steady progress.",
      "Save priority frogs for later.",
    ],
    image: "/svgs/solution-1.svg",
  },
  {
    id: "nd",
    label: "Neurodivergent",
    headline: "Gentle, predictable structure",
    bullets: [
      "Vibe switcher matches your tone.",
      "One Frog reduces overwhelm.",
      "Mindful breaks for fluctuating focus.",
    ],
    image: "/svgs/solution-1.svg",
  },
];

const WhoitsFor = () => {
  const [selected, setSelected] = useState(PERSONAS[0].id);
  const p = PERSONAS.find((x) => x.id === selected)!;

  return (
    <section className="pt-8 pb-20">
      <div className="content-center">
        <div className="text-center mb-14">
          <Badge title="Who it's for" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-sora leading-tight">
            Find the flow that fits you
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base font-manrope sm:text-lg">
            A few ways Focuspond helps people like you get into meaningful work,
            without burning out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* LEFT: persona chips + bullets */}
          <div>
            <div className="flex gap-3 flex-wrap justify-start mb-6">
              {PERSONAS.map((persona) => {
                const active = persona.id === selected;
                return (
                  <button
                    key={persona.id}
                    onClick={() => setSelected(persona.id)}
                    aria-pressed={active}
                    className={`px-3 py-1.5 font-sora rounded-full text-xs font-medium transition-all duration-200 focus:outline-none ${
                      active
                        ? "bg-[#ff9472] text-white shadow-sm"
                        : "bg-white/80 text-[#8b5e3c] border border-white/60 hover:shadow-sm"
                    }`}
                  >
                    {persona.label}
                  </button>
                );
              })}
            </div>

            <h3 className="text-xl font-semibold text-[#5a3a24] mb-3 font-sora">
              {p.headline}
            </h3>

            <ul className="space-y-3 mb-6">
              {p.bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.28 }}
                  className="text-sm text-[#5a3a24]/85"
                >
                  • {b}
                </motion.li>
              ))}
            </ul>

            <div>
              <Button
                href="/signup"
                size="sm"
                className="font-medium"
              >
                Try Focuspond — No signup
              </Button>
            </div>
          </div>

          {/* RIGHT: mockup / crossfade */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md h-64 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={p.id}
                  src={p.image}
                  alt={p.headline}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45 }}
                  className="object-contain w-full h-full p-6"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoitsFor;
