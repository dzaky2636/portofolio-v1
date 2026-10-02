'use client';

import { useState } from 'react';

const VISIBLE_COUNT = 8;

interface TechStackTagsProps {
  tags: string[];
  showMoreLabel: string;
}

export default function TechStackTags({ tags, showMoreLabel }: TechStackTagsProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? tags : tags.slice(0, VISIBLE_COUNT);
  const hiddenCount = tags.length - VISIBLE_COUNT;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((tech) => (
        <span
          key={tech}
          className="relative font-mono uppercase tracking-widest text-[10px] border-2 border-black px-2 py-1 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] active:translate-y-[3px] active:shadow-[0px_0px_0px_#0C0C0C] transition-all duration-75 cursor-default select-none"
        >
          {tech}
        </span>
      ))}
      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="font-mono uppercase tracking-widest text-[10px] border-2 border-black px-2 py-1 bg-[#FFD700] text-[#0C0C0C] shadow-[2px_2px_0px_#0C0C0C] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] transition-all duration-75 retro-focus"
        >
          {showMoreLabel.replace('{count}', String(hiddenCount))}
        </button>
      )}
    </div>
  );
}
