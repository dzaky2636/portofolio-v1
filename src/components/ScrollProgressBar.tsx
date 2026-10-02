'use client';

import { useEffect, useMemo, useState } from 'react';

/** Enough glyphs to span the flex track at mono 10px (clipped, not counted for progress). */
const TRACK_GLYPHS = 128;

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

  const trackEmpty = useMemo(() => '░'.repeat(TRACK_GLYPHS), []);
  const trackFilled = useMemo(() => '█'.repeat(TRACK_GLYPHS), []);

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
        <div className="relative flex-1 min-w-0 h-[1em] overflow-hidden">
          <span
            className="absolute inset-0 whitespace-nowrap opacity-40 select-none pointer-events-none"
            aria-hidden
          >
            {trackEmpty}
          </span>
          <span
            className="absolute inset-0 overflow-hidden whitespace-nowrap"
            style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
            aria-hidden
          >
            {trackFilled}
          </span>
        </div>
        <span className="tabular-nums shrink-0">{progress}%</span>
      </div>
    </div>
  );
}
