'use client';

import { useEffect, useMemo, useState } from 'react';

const BLOCKS = 24;

interface ScrollProgressBarProps {
  label: string;
}

export default function ScrollProgressBar({ label }: ScrollProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
      setProgress(next);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const blockMeter = useMemo(() => {
    const filled = Math.round((progress / 100) * BLOCKS);
    return `${'█'.repeat(filled)}${'░'.repeat(BLOCKS - filled)}`;
  }, [progress]);

  return (
    <div
      className="border-t-2 border-black bg-[#0C0C0C] text-[#F4F3ED]"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label} ${progress}%`}
    >
      <div className="max-w-7xl mx-auto px-4 py-1 flex items-center gap-2 font-mono uppercase tracking-widest text-[10px] leading-none">
        <span className="shrink-0 text-[#FFD700]">{label}</span>
        <span className="hidden sm:inline flex-1 overflow-hidden whitespace-nowrap opacity-90" aria-hidden>
          {blockMeter}
        </span>
        <span className="tabular-nums shrink-0 ml-auto">{progress}%</span>
      </div>
    </div>
  );
}
