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
      <div className="border-b border-line pb-2.5 lg:last:border-b-0">
        <button
          aria-expanded={isOpen}
          aria-controls={`faq-content-${index}`}
          onClick={onClick}
          className="flex justify-between items-center w-full text-left px-4 pb-4 font-medium font-sora cursor-pointer text-ink rounded-md"
        >
          <span className="pr-2">{question}</span>
          <ChevronDown
            className={`shrink-0 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          ref={contentRef}
          className="px-4 overflow-hidden transition-all duration-500 ease-in-out text-ink"
          id={`faq-content-${index}`}
          role="region"
          aria-labelledby={`faq-header-${index}`}
          style={{
            maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(-4px)",
          }}
        >
          <p className="py-2 text-sm text-ink-muted font-manrope">{answer}</p>
        </div>
      </div>
    );
  }
);

FaqItem.displayName = "FaqItem";

export default FaqItem;
