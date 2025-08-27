"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import FaqItem from "./FaqItem";
import { faqs } from "@/data/landing-page/faq";
import { FaqData } from "@/types/landing-page";
import { useState } from "react";

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative bg-secondary-accent/10 pt-8 pb-16">
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
          {faqs.map(({ question, answer }: FaqData, idx: number) => (
            <FaqItem
              key={idx}
              question={question}
              answer={answer}
              isOpen={activeIndex === idx}
              onClick={() => handleToggle(idx)}
            />
          ))}
        </div>

        <div className="text-center mt-12 font-sora text-[#5a3a24]">
          <p className="font-medium text-sm">Still have questions?</p>
          <a
            href="/contact"
            className="underline underline-offset-4 text-xs"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
