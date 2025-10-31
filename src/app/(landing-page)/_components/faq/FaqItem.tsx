import { memo, useRef } from "react";
import { ChevronDown } from "lucide-react";

type FaqItemProp = {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

const FaqItem = memo(
  ({ index, question, answer, isOpen, onClick }: FaqItemProp) => {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
      <div className="border-b border-dark-accent/20 pb-2.5 lg:last:border-b-0">
        <button
          aria-expanded={isOpen}
          aria-controls={`faq-content-${index}`}
          onClick={onClick}
          className="flex justify-between items-center w-full text-left px-4 pb-4 font-medium font-sora cursor-pointer text-[#5a3a24] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a8c686]/40 rounded-md"
        >
          <span className="pr-2">{question}</span>
          <ChevronDown
            className={`flex-shrink-0 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          ref={contentRef}
          className="px-4 overflow-hidden transition-all duration-500 ease-in-out text-[#5a3a24]"
          id={`faq-content-${index}`}
          role="region"
          aria-labelledby={`faq-header-${index}`}
          style={{
            maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(-4px)",
          }}
        >
          <p className="py-2 text-sm text-walnut-brown/80 font-manrope ">
            {answer}
          </p>
        </div>
      </div>
    );
  }
);

FaqItem.displayName = "FaqItem";

export default FaqItem;
