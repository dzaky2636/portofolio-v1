'use client';

import { useEffect } from 'react';

export default function EnvironmentalEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const twitchInterval = setInterval(() => {
      const elements = document.querySelectorAll('[data-twitch]');
      if (elements.length === 0) return;
      const target = elements[Math.floor(Math.random() * elements.length)];
      target.classList.add('animate-twitch');
      setTimeout(() => target.classList.remove('animate-twitch'), 100);
    }, 4000 + Math.random() * 6000);

    return () => clearInterval(twitchInterval);
  }, []);

  useEffect(() => {
    // Packet loss glitch on text
    const packetInterval = setInterval(() => {
      const texts = document.querySelectorAll('[data-packet]');
      if (texts.length === 0) return;
      const target = texts[Math.floor(Math.random() * texts.length)];
      const original = target.textContent || '';
      const chars = original.split('');
      const glitchIdx = Math.floor(Math.random() * chars.length);
      const glitchChar = chars[glitchIdx];
      chars[glitchIdx] = '\uFFFD'; // Unicode replacement character
      target.textContent = chars.join('');
      setTimeout(() => {
        if (target.textContent?.includes('\uFFFD')) {
          chars[glitchIdx] = glitchChar;
          target.textContent = chars.join('');
        }
      }, 120);
    }, 7000 + Math.random() * 8000);

    return () => clearInterval(packetInterval);
  }, []);

  return null;
}
