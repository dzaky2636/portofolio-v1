'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  clearBootLock,
  markBootSessionComplete,
  hasBootedThisSession,
  BOOT_SURFACE_COLOR,
} from '@/lib/bootSession';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const BOOT_TARGET_MS = 4500;
const STEP_MS = 750;
const EXIT_MS = 300;

function holdAfterMs(lineCount: number) {
  const transitions = Math.max(0, lineCount - 1);
  return BOOT_TARGET_MS - EXIT_MS - transitions * STEP_MS;
}

interface BootSequenceOverlayProps {
  lines: string[];
}

export default function BootSequenceOverlay({ lines }: BootSequenceOverlayProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [portalReady, setPortalReady] = useState(false);

  useLayoutEffect(() => {
    setPortalReady(true);

    if (reducedMotion) {
      markBootSessionComplete();
      clearBootLock();
      return;
    }
    if (hasBootedThisSession()) {
      clearBootLock();
      return;
    }

    setActive(true);
    setLineIndex(0);
    setExiting(false);
    document.body.style.overflow = 'hidden';
  }, [reducedMotion]);

  useEffect(() => {
    if (!active) return;

    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);

  useEffect(() => {
    if (!active || lines.length === 0) return;

    if (lineIndex < lines.length - 1) {
      const t = window.setTimeout(() => setLineIndex((i) => i + 1), STEP_MS);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      setExiting(true);
      window.setTimeout(() => {
        markBootSessionComplete();
        clearBootLock();
        setActive(false);
        document.body.style.overflow = '';
      }, EXIT_MS);
    }, holdAfterMs(lines.length));

    return () => window.clearTimeout(t);
  }, [active, lineIndex, lines.length]);

  if (!portalReady || !active) return null;

  const displayLines = lines.slice(0, lineIndex + 1);

  const overlay = (
    <div
      data-boot-overlay
      className="fixed inset-0 flex items-center justify-center p-6 pointer-events-auto"
      style={{ zIndex: 9999, backgroundColor: BOOT_SURFACE_COLOR }}
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
    >
      <div
        className={`w-full max-w-xl text-[#F4F3ED] ${
          exiting ? 'animate-iris-out' : 'animate-iris'
        }`}
      >
        <div className="border-4 border-[#F4F3ED] shadow-[10px_10px_0px_#0C0C0C] bg-[#0C0C0C] p-6 md:p-8 font-mono text-xs md:text-sm uppercase tracking-widest leading-relaxed">
          {displayLines.map((line, i) => (
            <p
              key={`${i}-${line}`}
              className={
                i === displayLines.length - 1 && !exiting
                  ? 'text-[#FFD700] animate-led-blink'
                  : 'opacity-90'
              }
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
