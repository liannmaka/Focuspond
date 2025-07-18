"use client";

import { useState, useRef, useEffect } from "react";

interface AccordionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, icon, children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      el.style.maxHeight = open ? `${el.scrollHeight}px` : "0px";
    }
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      const el = contentRef.current;
      if (open && el) {
        el.style.maxHeight = `${el.scrollHeight}px`;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  return (
    <div className="bg-[#fffaf3] shadow-sm rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-[15px] leading-[1.5] font-sora font-semibold hover:bg-walnut-brown/10 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-accent-button">{icon}</span>
          <h3 className="p-1">{title}</h3>
        </div>
        <span>{open ? "-" : "+"}</span>
      </button>
      <div
        ref={contentRef}
        className="max-h-0 overflow-hidden px-4 transition-[max-height] duration-300 ease-out"
      >
        <div className="pb-4 font-manrope text-sm text-walnut-brown/90">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
