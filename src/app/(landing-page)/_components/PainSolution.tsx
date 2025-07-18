"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui";
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
