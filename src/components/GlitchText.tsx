'use client';

import { useEffect, useState, useCallback } from 'react';

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

interface GlitchTextProps {
  text: string;
  className?: string;
  trigger?: 'hover' | 'interval';
  intervalMs?: number;
}

export default function GlitchText({
  text,
  className = '',
  trigger = 'hover',
  intervalMs = 8000,
}: GlitchTextProps) {
  const [display, setDisplay] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  const scramble = useCallback(() => {
    if (isGlitching) return;
    setIsGlitching(true);

    let iterations = 0;
    const maxIterations = 6;

    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (idx < iterations) return text[idx];
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );

      iterations += 1;
      if (iterations > maxIterations) {
        clearInterval(interval);
        setDisplay(text);
        setIsGlitching(false);
      }
    }, 40);
  }, [text, isGlitching]);

  useEffect(() => {
    if (trigger !== 'interval') return;
    const id = setInterval(scramble, intervalMs);
    return () => clearInterval(id);
  }, [trigger, intervalMs, scramble]);

  return (
    <span
      className={`${className} inline-block ${isGlitching ? 'animate-twitch' : ''}`}
      onMouseEnter={trigger === 'hover' ? scramble : undefined}
    >
      {display}
    </span>
  );
}
