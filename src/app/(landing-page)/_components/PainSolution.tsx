// "use client";

// import React from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { AlertCircle, Zap, Sun, BarChart2 } from "lucide-react";
// import { LucideIcon } from "lucide-react";

// interface PainSolutionData {
//   title: string;
//   problem: string;
//   promise: string;
//   payoff: string;
//   Icon: LucideIcon;
// }

// const painSolutionData: PainSolutionData[] = [
//   {
//     title: "Procrastination & Overwhelm",
//     problem:
//       "It’s hard to begin when a task feels too big, vague, or intimidating. So you delay it altogether.",
//     promise: "FocusPond helps you break the inertia.",
//     payoff:
//       "You’ll pick your Frog of the Day and dive straight into a focused 25-minute Pomodoro to gain momentum.",
//     Icon: AlertCircle,
//   },
//   {
//     title: "Low Energy Slumps",
//     problem:
//       "You want to work, but low energy or mental fatigue keeps you stuck and frustrated.",
//     promise: "FocusPond meets you where you are.",
//     payoff:
//       "Use Mini‑Frog Mode to complete small wins and keep your streak alive on tough days.",
//     Icon: Zap,
//   },
//   {
//     title: "Burnout & Unsustainable Routines",
//     problem:
//       "Overworking leads to burnout, making it harder to stay consistent.",
//     promise: "FocusPond encourages balance, not hustle.",
//     payoff:
//       "Alternate Pomodoros with mindful breaks, and never feel punished for missing a Frog, just keep moving.",
//     Icon: Sun,
//   },
//   {
//     title: "Lack of Insight & No Sense of Progress",
//     problem:
//       "You’re busy all day but have no clear sense of what you’ve accomplished.",
//     promise: "FocusPond makes progress visible.",
//     payoff:
//       "See every Frog and Pomodoro logged in your dashboard, and earn garden blooms that track real focus.",
//     Icon: BarChart2,
//   },
// ];

// const PainSolutionSection = () => {
//   return (
//     <section className="py-6 container mx-auto">
//       {painSolutionData.map(
//         ({ title, problem, promise, payoff, Icon }, idx) => (
//           <motion.div
//             key={idx}
//             className={`flex flex-col md:flex-row ${
//               idx % 2 ? "md:flex-row-reverse" : ""
//             } items-center py-9 px-7 gap-13
//                       `}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ delay: idx * 0.1, duration: 0.6 }}
//           >
//             {/* Text Column */}
//             <div className="md:w-1/2 space-y-4">
//               <div className="flex items-center space-x-3">
//                 <Icon className="w-6 h-6 text-[#ff9472]" />
//                 <h3 className="text-xl font-semibold text-[#8b5e3c]">
//                   {title}
//                 </h3>
//               </div>
//               <p className="text-sm text-[#5c4a38]/90 italic">{problem}</p>
//               <p className="text-sm text-[#5c4a38] font-medium">{promise}</p>
//               <p className="text-sm text-[#5c4a38]">{payoff}</p>
//             </div>

//             {/* Illustration Column */}
//             <div className="md:w-1/2 bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-lg ring-1 ring-white/10">
//               <Image
//                 src={`/svgs/solution-${idx + 1}.svg`}
//                 alt={title}
//                 width={400}
//                 height={300}
//                 className="w-full h-auto"
//               />
//             </div>
//           </motion.div>
//         )
//       )}
//     </section>
//   );
// };

// export default PainSolutionSection;

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Badge from "./../../../components/ui/Badge";
// import SectionDivider from "@/components/ui/SectionDivider";

interface Benefit {
  title: string;
  paragraph: string;
  badge: string;
  image: string;
}

const benefits: Benefit[] = [
  {
    badge: "Break the inertia",
    title: "Overcome procrastination",
    paragraph:
      "Start your day with your Frog of the Day and a short Pomodoro session. Small wins add up to big progress.",
    image: "/svgs/solution-1.svg",
  },
  {
    badge: "Work with your energy",
    title: "Power through low-motivation days",
    paragraph:
      "Use Mini-Frog Mode to complete light tasks, even on rough days. Stay steady without burning out.",
    image: "/svgs/solution-2.svg",
  },
  {
    badge: "Consistency without burnout",
    title: "Focus, rest, repeat",
    paragraph:
      "Alternate Pomodoro sprints with mindful breaks. Stay balanced, not drained.",
    image: "/svgs/solution-3.svg",
  },
  {
    badge: "See your growth",
    title: "Make your progress visible",
    paragraph:
      "Track your Frogs and focus sessions. Watch your garden bloom as you build momentum.",
    image: "/svgs/solution-4.svg",
  },
];

const StickyScrollBenefits = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx"));
            setActiveIndex(idx);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0.1 }
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* <SectionDivider /> */}
      <section className="bg-[#ffe5b4]/10 w-full py-20 px-7 ">
        <div className="container mx-auto flex flex-col md:flex-row gap-10">
          {/* Left: Scrollable Text */}
          <div className="flex-1 space-y-60 relative">
            {benefits.map((item, idx) => (
              <div
                key={idx}
                data-idx={idx}
                ref={(el) => {
                  sectionsRef.current[idx] = el;
                }}
              >
                <Badge title={item.badge} />
                <h3 className="text-3xl md:text-4xl font-sora font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-walnut-brown/80 font-manrope text-base sm:text-lg max-w-md">
                  {item.paragraph}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Sticky Image */}
          <div className="flex-1 hidden md:block sticky top-32 h-[400px]">
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={benefits[activeIndex].image}
                alt={benefits[activeIndex].title}
                width={500}
                height={350}
                className="rounded-3xl shadow-md object-contain bg-white/30 backdrop-blur-lg ring-1 ring-white/10 p-8"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StickyScrollBenefits;
