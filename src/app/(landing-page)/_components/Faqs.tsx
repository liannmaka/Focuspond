"use client";

import Badge from "@/components/ui/Badge";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/faqs";

interface FaqItemProp {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

interface FaqData {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProp> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-dark-accent/20 pb-2.5">
      <button
        aria-expanded={isOpen}
        aria-controls={`faq-content-${question}`}
        onClick={onClick}
        className="flex justify-between w-full text-left px-4 pb-4 font-medium font-sora cursor-pointer"
      >
        <span>{question}</span>
        <ChevronDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        ref={contentRef}
        className="px-4 overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="py-2 text-sm text-walnut-brown/80 font-manrope">
          {answer}
        </p>
      </div>

      {/* <div
        className={`px-4 overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "h-auto opacity-100 py-2" : "h-0 opacity-0 py-0"
        }`}
        id={`faq-content-${question}`}
        role="region"
        aria-labelledby={`faq-header-${question}`}
      >
        {isOpen && (
          <p className="text-sm text-walnut-brown/80 font-manrope">{answer}</p>
        )}
      </div> */}
    </div>
  );
};

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
          <h2 className="text-3xl md:text-4xl font-sora font-semibold">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-walnut-brown/80 font-manrope text-base md:text-lg">
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
