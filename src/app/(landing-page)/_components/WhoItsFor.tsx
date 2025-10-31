"use client";

import clsx from "clsx";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui";
import { whoitsfor } from "@/data/landing-page/whoitsfor";
import Image from "next/image";

const WhoitsFor = () => {
  const [selected, setSelected] = useState<string>(whoitsfor[0].id);
  const person = whoitsfor.find((x) => x.id === selected)!;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <section className="pt-8 pb-20">
      <div className="content-center">
        <div className="text-center mb-14">
          <Badge title="Who it's for" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-sora leading-tight">
            Your flow, your way
          </h2>
          <p className="mt-4 max-w-md mx-auto text-base font-manrope sm:text-lg">
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
                    className={clsx(
                      "px-3 py-1.5 font-sora rounded-full text-xs font-medium transition-all duration-200 focus:outline-none cursor-pointer",
                      active
                        ? "bg-accent-button ring-2 ring-accent-button/40 text-white shadow-sm"
                        : "bg-white/80 border border-white/80 hover:shadow-sm"
                    )}
                  >
                    {persona.label}
                  </button>
                );
              })}
            </div>

            <h3 className="text-xl font-semibold mb-4 font-sora">
              {person.headline}
            </h3>

            <ul className="space-y-3 mb-6">
              {person.bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.28 }}
                  className="text-sm font-manrope"
                >
                  • {b}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* RIGHT: crossfade */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md h-64 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg flex items-center justify-center overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex items-center justify-center relative"
                >
                  {person.image && !isError ? (
                    <Image
                      src={person.image}
                      alt={person.headline}
                      fill
                      className={`object-contain p-6 transition-opacity duration-500 ${
                        isLoading ? "opacity-0" : "opacity-100"
                      }`}
                      onLoadingComplete={() => setIsLoading(false)}
                      onError={() => {
                        setIsError(true);
                        setIsLoading(false);
                      }}
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-700 text-sm">👤</span>
                      </div>
                      <p className="text-sm text-gray-700 font-manrope">
                        {isError ? "Image unavailable" : "Loading your flow…"}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoitsFor;
