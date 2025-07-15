// components/Testimonials.tsx
"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Badge from "@/components/ui/Badge"; // optional

const testimonials = [
  {
    name: "Ada O.",
    role: "Student, UI Lagos",
    quote:
      "FocusPond helped me finally stop procrastinating my final year project. The vibe switcher is underrated!",
  },
  {
    name: "Tunde A.",
    role: "Frontend Developer",
    quote:
      "I've tried many Pomodoro apps, but this one feels calm and intentional. I actually enjoy using it.",
  },
  {
    name: "Chisom E.",
    role: "Product Designer",
    quote:
      "Being able to just dive into my Frog of the Day changed how I start my mornings.",
  },
  {
    name: "Ibrahim K.",
    role: "Researcher",
    quote:
      "Offline support means I can take this anywhere. It’s helped me stay consistent even during travel.",
  },
];

const Testimonial = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate testimonials to create seamless infinite loop
  const scrollingTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="relative py-24 bg-[#a8c686]/10 overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Title + Description */}
        <div>
          <Badge title="Testimonials" />
          <h2 className="text-3xl md:text-4xl font-sora font-semibold mt-2">
            People love FocusPond
          </h2>
          <p className="mt-4 text-walnut-brown/80 font-manrope text-base sm:text-lg max-w-md">
            Hear how FocusPond is helping people get clear, consistent, and calm
            with their day.
          </p>
        </div>
        {/* Right Column: Sliding Testimonials */}
        <div className="relative overflow-hidden w-full">
          <motion.div
            className="flex gap-6"
            ref={trackRef}
            animate={{ x: [0, -1000] }} // Adjust value based on content width
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              duration: 10, // Adjust speed
            }}
          >
            {scrollingTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="min-h-[150px] min-w-[280px] md:min-w-[320px] font-manrope bg-white/80 p-6 rounded-3xl flex flex-col"
              >
                <p className="text-sm">“{testimonial.quote}”</p>
                <div className="mt-auto pt-2 text-sm font-semibold">
                  — {testimonial.name},{" "}
                  <span className="font-normal">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
