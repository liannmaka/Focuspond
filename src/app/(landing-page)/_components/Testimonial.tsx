"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui";
import { testimonials } from "@/data/landing-page/testimonial";

const Testimonial = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate testimonials to create seamless infinite loop
  const scrollingTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="relative py-24 bg-secondary-accent/10 overflow-hidden">
      <div className="content-center grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Title + Description */}
        <div>
          <Badge title="Voices From The Pond" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sora font-semibold leading-tight text-darker-accent">
            What our users are saying
          </h2>
          <p className="paragraph-for-gb max-w-md text-wrap">
            FocusPond gives users space to think, plan, and stay on track.
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
                className="text-[#5a3a24] min-h-[150px] min-w-[280px] md:min-w-[320px] flex flex-col rounded-2xl shadow-md bg-white/80 backdrop-blur-sm ring-1 ring-white/10 p-6 transition hover:shadow-lg"
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
