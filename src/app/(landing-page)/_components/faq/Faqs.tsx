"use client";

import FaqItem from "./FaqItem";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { faqs } from "@/data/landing-page/faq";
import { useState } from "react";
import Footer from "../Footer";

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const leftFaqs = faqs.filter((_, idx) => idx % 2 === 0);

  const rightFaqs = faqs.filter((_, idx) => idx % 2 === 1);

  return (
    <>
      <section
        className="relative bg-secondary-accent/10 pt-8 pb-16"
        id="faqs"
      >
        <div className="content-center">
          <Badge
            title="FAQs"
            className="text-center"
          />

          <div className="text-center mb-10">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl
            font-sora font-semibold leading-tight text-darker-accent"
            >
              Frequently asked questions
            </h2>
            <p className="paragraph-for-gb max-w-2xl mx-auto">
              Everything you need to know to get started with FocusPond.
            </p>
          </div>

          <div className="grid gap-9 sm:grid-cols-1 lg:grid-cols-2">
            {/* left column */}
            <div className="flex flex-col gap-y-9">
              {leftFaqs.map((faq, idx) => {
                const actualIndex = idx * 2;
                return (
                  <FaqItem
                    key={actualIndex}
                    index={actualIndex}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={activeIndex === actualIndex}
                    onClick={() => handleToggle(actualIndex)}
                  />
                );
              })}
            </div>

            {/* right column */}
            <div className="flex flex-col gap-y-9">
              {rightFaqs.map((faq, idx) => {
                const actualIndex = idx * 2 + 1;
                return (
                  <FaqItem
                    key={actualIndex}
                    index={actualIndex}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={activeIndex === actualIndex}
                    onClick={() => handleToggle(actualIndex)}
                  />
                );
              })}
            </div>
          </div>

          <div className="text-center mt-12 font-sora text-[#5a3a24]">
            <p className="font-medium text-sm">Still have questions?</p>
            <Link
              href="/contact"
              className="relative text-xs underline underline-offset-4 decoration-[#5a3a24]/50
                after:absolute after:left-0 after:-bottom-[2px] 
                after:w-0 after:h-[1.5px] after:bg-[#5a3a24] 
                after:transition-all after:duration-300 
                hover:after:w-full"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Faqs;
