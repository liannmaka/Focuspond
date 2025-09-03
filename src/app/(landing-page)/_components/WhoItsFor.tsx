"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui";
import { whoitsfor } from "@/data/landing-page/whoitsfor";

const WhoitsFor = () => {
  const [selected, setSelected] = useState<string>(whoitsfor[0].id);
  const person = whoitsfor.find((x) => x.id === selected)!;
  console.log("person", person);

  return (
    <section className="pt-8 pb-20">
      <div className="content-center">
        <div className="text-center mb-14">
          <Badge title="Who it's for" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-sora leading-tight">
            Your flow, your way
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base font-manrope sm:text-lg">
            Different paths, same goal: calm, meaningful progress without the
            burnout.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: persona chips + bullets */}
          <div>
            <div className="flex gap-3 flex-wrap justify-start mb-8">
              {whoitsfor.map((persona) => {
                const active = persona.id === selected;
                return (
                  <button
                    key={persona.id}
                    onClick={() => setSelected(persona.id)}
                    aria-pressed={active}
                    className={`px-3 py-1.5 font-sora rounded-full text-xs font-medium transition-all duration-200 focus:outline-none ${
                      active
                        ? "bg-[#ff9472] text-white shadow-sm"
                        : "bg-white/80 text-[#8b5e3c] border border-white/80 hover:shadow-sm"
                    }`}
                  >
                    {persona.label}
                  </button>
                );
              })}
            </div>

            <h3 className="text-xl font-semibold text-[#5a3a24] mb-3 font-sora">
              {person.headline}
            </h3>

            <ul className="space-y-3 mb-6">
              {person.bullets.map((b, i) => (
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
          </div>

          {/* RIGHT: mockup / crossfade */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md h-64 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={person.id}
                  src={person.image}
                  alt={person.headline}
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
