'use client';

import { useEffect, useMemo, useState } from 'react';

/** Covers a max-w-7xl track before measurement runs. */
const FALLBACK_GLYPHS = 320;

interface ScrollProgressBarProps {
  label: string;
}

function glyphCountFor(trackWidth: number, stride: number) {
  if (trackWidth <= 0 || stride <= 0) return FALLBACK_GLYPHS;
  return Math.ceil(trackWidth / stride) + 1;
}

export default function ScrollProgressBar({ label }: ScrollProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [glyphCount, setGlyphCount] = useState(FALLBACK_GLYPHS);
  const [track, setTrack] = useState<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!track) return;

    const probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    probe.style.whiteSpace = 'nowrap';
    track.appendChild(probe);

    const strideOf = (glyph: string) => {
      probe.textContent = glyph;
      const one = probe.getBoundingClientRect().width;
      probe.textContent = glyph + glyph;
      return probe.getBoundingClientRect().width - one;
    };

    const measure = () => {
      const next = Math.max(
        glyphCountFor(track.clientWidth, strideOf('█')),
        glyphCountFor(track.clientWidth, strideOf('░')),
      );
      setGlyphCount((current) => (current === next ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    void document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      observer.disconnect();
      probe.remove();
    };
  }, [track]);

  const trackEmpty = useMemo(() => '░'.repeat(glyphCount), [glyphCount]);
  const trackFilled = useMemo(() => '█'.repeat(glyphCount), [glyphCount]);

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
        <div ref={setTrack} className="relative flex-1 min-w-0 h-[1em] overflow-hidden">
          <span
            className="absolute inset-0 whitespace-nowrap opacity-40 select-none pointer-events-none"
            aria-hidden
          >
            {trackEmpty}
          </span>
          <span
            className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap"
            style={{ width: `${progress}%` }}
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
