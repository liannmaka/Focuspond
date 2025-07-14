"use client";

import Badge from "@/components/ui/Badge";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Focuspond?",
    answer:
      "Focuspond is your quiet corner of the internet to plan, focus, and feel less overwhelmed. It's a calm productivity space for deep thinkers, with a Pomodoro timer, daily tasks, frog picking, and mood check-ins, all saved on your device with no account needed.",
  },
  {
    question: "Is Focuspond free?",
    answer:
      "Yes, Focuspond is completely free while we’re in our early stage. You’ll always have access to the basics, even when premium features arrive later.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Absolutely. Focuspond is built as a PWA, so you can plan and focus even without data or Wi-Fi.",
  },
  {
    question: "What is the 'Frog of the Day'?",
    answer:
      "Your Frog of the Day is the most important task you choose to tackle first. It’s not necessarily urgent, just the thing that’ll make you feel accomplished once it’s done.",
  },
  {
    question: "How do I identify a 'Frog task'?",
    answer:
      "A Frog task is the one you’re most likely to avoid, usually because it feels big, challenging, or meaningful. Ideally, it should take 1 to 4 hours. If it feels overwhelming, break it into smaller steps.",
  },
  {
    question: "Can I use Focuspond without creating an account?",
    answer:
      "Yes, you can use Focuspond without signing up. But if you want to back up your data or use it on multiple devices, you can create an account anytime.",
  },
  {
    question: "What is the vibe switcher?",
    answer:
      "It lets you choose how the app 'talks' to you, formal, friendly, or full-on pidgin. Change the tone to match your mood or mindset.",
  },
];

const FaqItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-dark-accent/20 pb-2.5">
      <button
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
    </div>
  );
};

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative bg-secondary-accent/10 pb-16">
      <div className="container mx-auto px-7">
        <Badge title="FAQs" />

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-sora font-semibold">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-walnut-brown/80 font-manrope text-base md:text-lg">
            Everything you need to know to get started with FocusPond.
          </p>
        </div>

        <div className="grid gap-9 sm:grid-cols-1 lg:grid-cols-2">
          {faqs.map(({ question, answer }, idx) => (
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
