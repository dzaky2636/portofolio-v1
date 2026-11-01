'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  clearBootLock,
  markBootSessionComplete,
  hasBootedThisSession,
  BOOT_SKIP_QUERY,
  BOOT_SURFACE_COLOR,
} from '@/lib/bootSession';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const BOOT_TARGET_MS = 900;
const STEP_MS = 120;
const EXIT_MS = 200;

function holdAfterMs(lineCount: number) {
  const transitions = Math.max(0, lineCount - 1);
  return BOOT_TARGET_MS - EXIT_MS - transitions * STEP_MS;
}

interface BootSequenceOverlayProps {
  lines: string[];
  skipHint: string;
}

export default function BootSequenceOverlay({ lines, skipHint }: BootSequenceOverlayProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [portalReady, setPortalReady] = useState(false);

  useLayoutEffect(() => {
    setPortalReady(true);

    if (reducedMotion || window.matchMedia(BOOT_SKIP_QUERY).matches) {
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
    if (!active || exiting || lines.length === 0) return;

    if (lineIndex < lines.length - 1) {
      const t = window.setTimeout(() => setLineIndex((i) => i + 1), STEP_MS);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => setExiting(true), holdAfterMs(lines.length));

    return () => window.clearTimeout(t);
  }, [active, exiting, lineIndex, lines.length]);

  useEffect(() => {
    if (!active || exiting) return;

    const skip = () => setExiting(true);
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);

    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [active, exiting]);

  useEffect(() => {
    if (!active || !exiting) return;

    const t = window.setTimeout(() => {
      markBootSessionComplete();
      clearBootLock();
      setActive(false);
      document.body.style.overflow = '';
    }, EXIT_MS);

    return () => window.clearTimeout(t);
  }, [active, exiting]);

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
          <p className="mt-4 text-[10px] opacity-70">{skipHint}</p>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
