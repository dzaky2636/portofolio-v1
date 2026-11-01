'use client';

/* eslint-disable @next/next/no-img-element -- pixel icon must stay a crisp small SVG */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import HeaderSystemClock from '@/components/HeaderSystemClock';
import type { NavLink } from '@/components/SiteHeader';

export interface TaskbarLabels {
  start: string;
  menuAria: string;
  brand: string;
  programs: string;
  goTo: string;
  system: string;
  terminal: string;
  snake: string;
  subway: string;
  nonogram: string;
  crt: string;
  music: string;
  cv: string;
  boar: string;
}

const ITEM_CLASS =
  'block w-full px-3 py-1.5 text-left font-mono uppercase tracking-widest text-xs text-[#0C0C0C] hover:bg-[#2945FF] hover:text-white focus-visible:bg-[#2945FF] focus-visible:text-white outline-none';

function MenuGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b-2 border-black py-1 last:border-b-0">
      <p className="px-3 py-1 font-mono uppercase tracking-widest text-[10px] text-[#2945FF]">
        {title}
      </p>
      {children}
    </div>
  );
}

function runInTerminal(command: string) {
  window.dispatchEvent(new CustomEvent('terminal:run', { detail: command }));
}

export default function Taskbar({
  labels,
  navLinks,
  cvFile,
  timezoneLabel,
}: {
  labels: TaskbarLabels;
  navLinks: NavLink[];
  cvFile: string;
  timezoneLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    menuRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      startRef.current?.focus();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  const programs = [
    { command: 'snake', label: labels.snake },
    { command: 'subway', label: labels.subway },
    { command: 'nonogram', label: labels.nonogram },
  ];

  return (
    <div
      ref={rootRef}
      className="fixed inset-x-0 bottom-0 z-[190] flex h-11 items-center gap-2 border-t-4 border-black bg-[#F4F3ED] px-2 pointer-events-auto"
    >
      {isOpen && (
        <div
          ref={menuRef}
          id="start-menu"
          aria-label={labels.menuAria}
          onClick={() => setIsOpen(false)}
          className="absolute bottom-full left-2 mb-1 flex max-h-[calc(100vh-4rem)] w-64 max-w-[calc(100vw-1rem)] border-4 border-black bg-white shadow-[6px_6px_0px_#0C0C0C] animate-iris"
        >
          <div
            aria-hidden="true"
            className="flex shrink-0 items-end justify-center bg-[#2945FF] px-1 py-2 font-mono text-sm font-bold uppercase tracking-widest text-white [writing-mode:vertical-rl] rotate-180"
          >
            {labels.brand}
          </div>
          <div className="min-w-0 flex-1 overflow-y-auto">
            <MenuGroup title={labels.programs}>
              <button type="button" data-terminal-open className={ITEM_CLASS}>
                {labels.terminal}
              </button>
              {programs.map(({ command, label }) => (
                <button
                  key={command}
                  type="button"
                  onClick={() => runInTerminal(command)}
                  className={ITEM_CLASS}
                >
                  {label}
                </button>
              ))}
            </MenuGroup>
            <MenuGroup title={labels.goTo}>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className={ITEM_CLASS}>
                  {link.label}
                </a>
              ))}
            </MenuGroup>
            <MenuGroup title={labels.system}>
              <button type="button" data-crt-toggle className={ITEM_CLASS}>
                {labels.crt}
              </button>
              <button type="button" data-music-toggle className={ITEM_CLASS}>
                {labels.music}
              </button>
              <button type="button" onClick={() => runInTerminal('boar')} className={ITEM_CLASS}>
                {labels.boar}
              </button>
              <a href={cvFile} download data-boar-react="cv" className={ITEM_CLASS}>
                {labels.cv}
              </a>
            </MenuGroup>
          </div>
        </div>
      )}

      <button
        ref={startRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="start-menu"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex shrink-0 items-center gap-1.5 border-2 border-black px-2 py-1 font-mono uppercase tracking-widest text-xs font-bold retro-focus ${
          isOpen
            ? 'bg-[#2945FF] text-white shadow-none translate-x-[1px] translate-y-[1px]'
            : 'bg-white shadow-[2px_2px_0px_#0C0C0C] hover:border-[#2945FF]'
        }`}
      >
        <img src="/boar.svg" alt="" width={16} height={16} className="block" />
        {labels.start}
      </button>

      <div id="taskbar-tasks" className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden" />

      <HeaderSystemClock timezoneLabel={timezoneLabel} />
    </div>
  );
}
