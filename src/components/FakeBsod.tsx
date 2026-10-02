'use client';

import { useEffect } from 'react';

export interface FakeBsodContent {
  title: string;
  rebootHint: string;
  lines: string[];
}

interface FakeBsodProps {
  open: boolean;
  onClose: () => void;
  content: FakeBsodContent;
}

export default function FakeBsod({ open, onClose, content }: FakeBsodProps) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] bg-[#2945FF] text-[#F4F3ED] p-6 md:p-12 font-mono text-sm md:text-base leading-relaxed pointer-events-auto animate-iris"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="bsod-title"
    >
      <div className="max-w-3xl border-4 border-[#F4F3ED] shadow-[12px_12px_0px_#0C0C0C] p-6 md:p-8 bg-[#0C0C0C] text-[#F4F3ED]">
        <h2 id="bsod-title" className="uppercase tracking-widest text-lg md:text-xl mb-6 text-[#FFD700]">
          {content.title}
        </h2>
        <pre className="whitespace-pre-wrap uppercase tracking-wide text-xs md:text-sm opacity-95 mb-8">
          {content.lines.join('\n')}
        </pre>
        <p className="uppercase tracking-widest text-xs md:text-sm border-t-4 border-[#F4F3ED] pt-4 animate-led-blink">
          {content.rebootHint}
        </p>
      </div>
    </div>
  );
}
