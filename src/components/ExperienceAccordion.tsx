"use client";

import { useState } from "react";

export interface Experience {
  role: string;
  company: string;
  duration?: string;
  details: string;
}

interface ExperienceAccordionProps {
  experiences: Experience[];
}

export default function ExperienceAccordion({
  experiences,
}: ExperienceAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-4">
      {experiences.map((exp, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index}>
            {/* Directory Tab Header */}
            <button
              type="button"
              onClick={() => handleToggle(index)}
              className={`w-full flex items-center justify-between gap-4 border-[3px] border-black p-4 md:p-6 text-left rounded-none ${
                isOpen
                  ? "bg-[#FFD700] text-black"
                  : "bg-white text-[#0C0C0C]"
              } hover:bg-[#2945FF] hover:text-white`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <span className="font-mono uppercase text-sm font-bold">
                  {exp.role}
                </span>
                <span className="font-mono uppercase text-sm font-bold hidden md:inline">
                  //
                </span>
                <span className="font-mono uppercase text-sm font-bold">
                  {exp.company}
                </span>
                {exp.duration && (
                  <span className="font-mono uppercase text-sm font-bold opacity-70">
                    [{exp.duration}]
                  </span>
                )}
              </div>

              <span className="font-mono uppercase text-sm font-bold shrink-0">
                {isOpen ? "[ - ]" : "[ + ]"}
              </span>
            </button>

            {/* Expanded Content - Instant toggle, no animation */}
            {isOpen && (
              <div className="border-[3px] border-t-0 border-black bg-white shadow-[4px_4px_0px_#0C0C0C] p-6 md:p-8">
                <p className="font-serif text-lg md:text-xl leading-relaxed text-[#0C0C0C]">
                  {exp.details}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
