"use client";

import React from "react";
import { Brain, Turtle, Zap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import SectionDivider from "@/components/ui/SectionDivider";
import Badge from "./../../../components/ui/Badge";
import { LucideIcon } from "lucide-react";

interface AudienceData {
  Icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
}

const styles = {
  section: "py-10 px-7 lg:px-10 bg-[#fdf9f3] relative container mx-auto",
  grid: "grid grid-cols-1 sm:grid-cols-2 gap-8",
  cardBase:
    "relative rounded-2xl shadow-md border border-light-background/40 p-6 pt-10 hover:shadow-lg transition-shadow",
  title: "text-base font-semibold tracking-wide font-sora",
  description: "mt-2 text-sm text-[#5c4a38] leading-relaxed font-manrope",
};

const audience: AudienceData[] = [
  {
    Icon: Brain,
    iconColor: "text-[#ff9472]",
    title: "Overthinkers & Perfectionists",
    description:
      "Stop wondering where to begin, pick your “frog of the day” and dive right in.",
  },
  {
    Icon: Turtle,
    iconColor: "text-[#a8c686]",
    title: "Chronic Procrastinators",
    description:
      "Break big tasks into a single “frog of the day” so you actually get started.",
  },
  {
    Icon: Zap,
    iconColor: "text-yellow-500",
    title: "Neurodivergent Brains",
    description:
      "Flexible energy check + mini‑frog option keeps you moving without shame.",
  },
  {
    Icon: BookOpen,
    iconColor: "text-[#8b5e3c]",
    title: "Busy Students & Remote Workers",
    description:
      "Prioritize your top task, then use Pomodoro sprints to power through.",
  },
];

const WhoItsForSection = () => {
  return (
    <>
      <SectionDivider />
      <motion.section
        className={styles.section}
        aria-labelledby="who-this-is-for"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, visible: {} }}
      >
        <Badge title="Who This App Is For" />
        <div>
          <div className={styles.grid}>
            {audience.map(({ Icon, iconColor, title, description }, idx) => {
              const bgColor =
                idx % 2 === 0 ? "bg-[#ffe5b4]/10" : "bg-[#a8c686]/10";
              return (
                <motion.div
                  key={idx}
                  className="h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                >
                  <div
                    className={`${styles.cardBase} ${bgColor} flex flex-col h-full`}
                  >
                    {/* Floating icon */}
                    <div className={`absolute -top-4 ${iconColor}/20`}>
                      <Icon
                        size={32}
                        className={`${iconColor}`}
                      />
                    </div>
                    <div>
                      <h3 className={styles.title}>{title}</h3>
                      <p className={styles.description}>{description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default WhoItsForSection;
