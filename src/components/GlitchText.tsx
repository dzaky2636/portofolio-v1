'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

interface GlitchTextProps {
  text: string;
  className?: string;
  trigger?: 'hover' | 'interval';
  intervalMs?: number;
  texts?: string[];
}

function pickRandom(arr: string[], exclude?: string): string {
  if (arr.length === 1) return arr[0];
  let picked = arr[Math.floor(Math.random() * arr.length)];
  while (picked === exclude && arr.length > 1) {
    picked = arr[Math.floor(Math.random() * arr.length)];
  }
  return picked;
}

export default function GlitchText({
  text,
  className = '',
  trigger = 'hover',
  intervalMs = 8000,
  texts,
}: GlitchTextProps) {
  const [display, setDisplay] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const [currentText, setCurrentText] = useState(text);
  const currentTextRef = useRef(currentText);
  currentTextRef.current = currentText;

  const scramble = useCallback(() => {
    if (isGlitching) return;
    setIsGlitching(true);

    const target = texts
      ? pickRandom(texts, currentTextRef.current)
      : currentTextRef.current;
    setCurrentText(target);

    let iterations = 0;
    const maxIterations = 6;

    const interval = setInterval(() => {
      setDisplay(
        target
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (idx < iterations) return target[idx];
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );

      iterations += 1;
      if (iterations > maxIterations) {
        clearInterval(interval);
        setDisplay(target);
        setIsGlitching(false);
      }
    }, 40);
  }, [isGlitching, texts]);

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
