'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Window from '@/components/Window';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { playRetroClick } from '@/lib/retroClick';

export interface Experience {
  role: string;
  company: string;
  duration?: string;
  details: string;
}

export interface ExperienceLogViewerLabels {
  windowTitle: string;
  windowStatus: string;
  detailTitle: string;
  listLabel: string;
  emptyHint: string;
  lineAria: string;
}

interface ExperienceLogViewerProps {
  experiences: Experience[];
  labels: ExperienceLogViewerLabels;
}

function isActiveDuration(duration: string | undefined): boolean {
  if (!duration) return false;
  const upper = duration.toUpperCase();
  return upper.includes('NOW') || upper.includes('SEKARANG');
}

function formatLineAria(
  template: string,
  index: number,
  exp: Experience
): string {
  const logId = `LOG-${String(index + 1).padStart(3, '0')}`;
  const duration = exp.duration ?? '';
  return template
    .replace('{index}', logId)
    .replace('{role}', exp.role)
    .replace('{company}', exp.company)
    .replace('{duration}', duration);
}

export default function ExperienceLogViewer({
  experiences,
  labels,
}: ExperienceLogViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listboxId = useId();
  const detailRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const selected =
    experiences.length > 0 && selectedIndex >= 0 && selectedIndex < experiences.length
      ? experiences[selectedIndex]
      : null;

  const selectIndex = useCallback((index: number, withSound = false) => {
    if (index < 0 || index >= experiences.length) return;
    setSelectedIndex(index);
    if (withSound) playRetroClick();
  }, [experiences.length]);

  useEffect(() => {
    const el = detailRef.current;
    if (!el || reducedMotion) return;
    el.classList.remove('animate-guillotine');
    void el.offsetWidth;
    el.classList.add('animate-guillotine');
  }, [selectedIndex, reducedMotion]);

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (experiences.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectIndex(Math.min(selectedIndex + 1, experiences.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectIndex(Math.max(selectedIndex - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      selectIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      selectIndex(experiences.length - 1);
    }
  };

  return (
    <div className="animate-rack-in pointer-events-auto" style={{ animationFillMode: 'both' }}>
      <Window
        title={labels.windowTitle}
        status={labels.windowStatus}
        interactive={false}
        bodyClassName="p-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 border-t-4 border-black">
          <div className="lg:col-span-5 bg-[#0C0C0C] text-[#F4F3ED]">
            <div
              className="font-mono uppercase tracking-widest text-[10px] border-b-2 border-[#F4F3ED]/30 px-4 py-2 text-[#FFD700]"
            >
              {labels.listLabel}
            </div>
            <div
              id={listboxId}
              role="listbox"
              aria-label={labels.listLabel}
              tabIndex={0}
              onKeyDown={handleListKeyDown}
              className="max-h-[min(420px,50vh)] overflow-y-auto retro-focus outline-none"
            >
              {experiences.map((exp, index) => {
                const isSelected = selectedIndex === index;
                const logId = `LOG-${String(index + 1).padStart(3, '0')}`;
                const optionId = `${listboxId}-option-${index}`;
                const active = isActiveDuration(exp.duration);
                const duration = exp.duration ?? '—';

                return (
                  <button
                    key={`${exp.company}-${exp.role}-${index}`}
                    id={optionId}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-label={formatLineAria(labels.lineAria, index, exp)}
                    onClick={() => selectIndex(index, true)}
                    className={`w-full text-left font-mono uppercase tracking-widest text-xs md:text-sm px-4 py-3 border-b border-[#F4F3ED]/15 transition-colors duration-75 retro-focus ${
                      isSelected
                        ? 'border-l-4 border-l-[#2945FF] bg-white/10 text-white'
                        : 'border-l-4 border-l-transparent hover:bg-[#2945FF] hover:text-white'
                    }`}
                  >
                    <span className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
                      <span className="shrink-0 text-[#FFD700]">
                        {active ? '█' : '░'} [{logId}]
                      </span>
                      <span className="tabular-nums shrink-0 opacity-90">[{duration}]</span>
                      <span className="min-w-0 break-words">{exp.role}</span>
                      <span className="hidden sm:inline opacity-70">@</span>
                      <span className="min-w-0 break-words opacity-90">{exp.company}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 border-t-4 lg:border-t-0 lg:border-l-4 border-black bg-white flex flex-col min-h-[200px]">
            <div
              className="font-mono uppercase tracking-widest text-xs border-b-4 border-black bg-[#F4F3ED] px-4 py-2 flex justify-between gap-2"
            >
              <span>{labels.detailTitle}</span>
              {selected?.duration && (
                <span className="tabular-nums shrink-0 text-[#2945FF]">
                  [{selected.duration}]
                </span>
              )}
            </div>
            <div className="flex-1 p-6 md:p-8">
              {selected ? (
                <div ref={detailRef}>
                  <p className="font-mono uppercase tracking-widest text-xs text-[#2945FF] mb-3">
                    {selected.role} // {selected.company}
                  </p>
                  <p
                    data-packet
                    className="font-serif text-lg md:text-xl leading-relaxed text-[#0C0C0C]"
                  >
                    {selected.details}
                  </p>
                </div>
              ) : (
                <p className="font-mono uppercase tracking-widest text-sm text-[#0C0C0C]/60">
                  {labels.emptyHint}
                </p>
              )}
            </div>
          </div>
        </div>
      </Window>
    </div>
  );
}
