import React from "react";
import { FaqItemProp } from "@/types/landing-page";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

const FaqItem: React.FC<FaqItemProp> = React.memo(
  ({ question, answer, isOpen, onClick }) => {
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
          id={`faq-content-${question}`}
          role="region"
          aria-labelledby={`faq-header-${question}`}
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
            <p className="text-sm text-walnut-brown/80 font-manrope">
              {answer}
            </p>
          )}
        </div> */}
      </div>
    );
  }
);

FaqItem.displayName = "FaqItem";

export default FaqItem;
