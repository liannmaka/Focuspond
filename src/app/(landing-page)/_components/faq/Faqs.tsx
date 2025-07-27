"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import FaqItem from "./FaqItem";
import { faqs } from "@/data/faq";
import { FaqData } from "@/types/landing-page";
import { useState } from "react";

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative bg-secondary-accent/10 md:pt-10 pb-16">
      <div className="container mx-auto px-7">
        <Badge
          title="FAQs"
          className="text-center"
        />

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-sora font-semibold leading-tight">
            Frequently asked questions
          </h2>
          <p className="mt-4 font-manrope text-base sm:text-lg max-w-md mx-auto">
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

        <div className="text-center mt-12 font-sora">
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
