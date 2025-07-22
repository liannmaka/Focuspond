"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui";

const testimonials = [
  {
    name: "Ada O.",
    role: "Student, UI Lagos",
    quote:
      "Focuspond helped me finally stop procrastinating my final year project. The vibe switcher? Underrated magic.",
  },
  {
    name: "Tunde A.",
    role: "Frontend Developer",
    quote:
      "I’ve used so many Pomodoro tools, but this one actually makes me want to work. It’s calm and intentional.",
  },
  {
    name: "Chisom E.",
    role: "Product Designer",
    quote:
      "Starting with my Frog of the Day changed everything. Now I stop overthinking and just start.",
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
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Title + Description */}
        <div>
          <Badge title="Voices from the Pond" />
          <h2 className="text-3xl md:text-4xl font-sora font-semibold leading-tight">
            What our users are saying
          </h2>
          <p className="mt-4 font-manrope text-base sm:text-lg max-w-md">
            Focuspond gives users space to think, plan, and stay on track.
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
              duration: 40, // Adjust speed
            }}
          >
            {scrollingTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="min-h-[150px] min-w-[280px] md:min-w-[320px] flex flex-col rounded-2xl shadow-md bg-white/80 backdrop-blur-sm ring-1 ring-white/10 p-6 transition hover:shadow-lg"
              >
                <p className="text-sm">“{testimonial.quote}”</p>
                <div className="mt-auto pt-4 text-sm font-semibold">
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
