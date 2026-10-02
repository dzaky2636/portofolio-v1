'use client';

import type { MouseEvent } from 'react';

interface SkipToContentProps {
  label: string;
  targetId: string;
}

export default function SkipToContent({ label, targetId }: SkipToContentProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView();
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  };

  return (
    <a href={`#${targetId}`} className="skip-to-content pointer-events-auto" onClick={handleClick}>
      {label}
    </a>
  );
}
