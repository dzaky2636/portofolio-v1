'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface KonamiAchievementContent {
  title: string;
  subtitle: string;
  dismissHint: string;
  quote: string;
}

interface KonamiAchievementProps {
  open: boolean;
  onClose: () => void;
  content: KonamiAchievementContent;
}

export default function KonamiAchievement({
  open,
  onClose,
  content,
}: KonamiAchievementProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!open || !mounted) return null;

  return createPortal(
    <div
      data-system-overlay
      className="fixed inset-0 bg-[#0C0C0C]/85 p-6 md:p-12 flex items-center justify-center pointer-events-auto animate-iris"
      style={{ zIndex: 10001 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="konami-title"
    >
      <div className="max-w-2xl w-full border-4 border-[#0C0C0C] shadow-[12px_12px_0px_#2945FF] bg-[#F4F3ED] text-[#0C0C0C]">
        <div className="font-mono uppercase tracking-widest text-xs border-b-4 border-[#0C0C0C] bg-[#2945FF] text-white px-4 py-2 flex justify-between gap-2">
          <span id="konami-title" className="truncate">{content.title}</span>
          <span className="shrink-0 text-[#FFD700]">[ OK ]</span>
        </div>
        <div className="p-6 md:p-8 space-y-6">
          <p className="font-mono uppercase tracking-widest text-xs text-[#2945FF]">
            {content.subtitle}
          </p>
          <blockquote className="font-serif text-xl md:text-2xl leading-relaxed border-l-4 border-[#FFD700] pl-4">
            {content.quote}
          </blockquote>
          <p className="font-mono uppercase tracking-widest text-xs border-t-4 border-[#0C0C0C] pt-4 animate-led-blink">
            {content.dismissHint}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
