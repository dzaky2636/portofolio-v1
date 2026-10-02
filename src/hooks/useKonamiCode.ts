'use client';

import { useEffect, useRef } from 'react';
import {
  playCheatComplete,
  playCheatCorrect,
  playCheatWrong,
} from '@/lib/cheatCodeSounds';
import {
  isKonamiKey,
  KONAMI_SEQUENCE,
  normalizeKonamiKey,
} from '@/lib/konamiSequence';

interface UseKonamiCodeOptions {
  onComplete: () => void;
  onProgress?: (stepIndex: number) => void;
}

export function useKonamiCode({ onComplete, onProgress }: UseKonamiCodeOptions) {
  const indexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);

  onCompleteRef.current = onComplete;
  onProgressRef.current = onProgress;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }

      if (!isKonamiKey(e.key)) return;

      const key = normalizeKonamiKey(e.key);
      const expected = KONAMI_SEQUENCE[indexRef.current];

      if (key === expected) {
        playCheatCorrect(indexRef.current);
        onProgressRef.current?.(indexRef.current);
        indexRef.current += 1;

        if (indexRef.current >= KONAMI_SEQUENCE.length) {
          indexRef.current = 0;
          playCheatComplete();
          onCompleteRef.current();
        }
      } else {
        playCheatWrong();
        indexRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
