'use client';

import { useEffect, useRef } from 'react';

export default function EnvironmentalEffects() {
  const scanlineRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   // Scanline follows scroll with lag
  //   const scanline = scanlineRef.current;
  //   if (!scanline) return;

  //   let rafId: number;
  //   let currentY = 0;

  //   const handleScroll = () => {
  //     const targetY = window.scrollY + window.innerHeight * 0.3;
  //     const step = () => {
  //       currentY += (targetY - currentY) * 0.15;
  //       if (scanline) scanline.style.transform = `translateY(${currentY}px)`;
  //       rafId = requestAnimationFrame(step);
  //     };
  //     cancelAnimationFrame(rafId);
  //     rafId = requestAnimationFrame(step);
  //   };

  //   window.addEventListener('scroll', handleScroll, { passive: true });
  //   handleScroll();

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //     cancelAnimationFrame(rafId);
  //   };
  // }, []);

  useEffect(() => {
    // Random relay twitch on elements
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

  useEffect(() => {
    // Fan vibration burst on viewport
    const vibrateInterval = setInterval(() => {
      document.body.classList.add('animate-fan');
      setTimeout(() => document.body.classList.remove('animate-fan'), 2000);
    }, 20000);

    return () => clearInterval(vibrateInterval);
  }, []);

  return (
    <>
      {/* CRT Scanline follower — DISABLED */}
      {/* <div
        ref={scanlineRef}
        className="fixed left-0 right-0 h-16 pointer-events-none z-[1]"
        style={{
          willChange: 'transform',
          background: `
            repeating-linear-gradient(
              to bottom,
              rgba(0,0,0,0.22) 0px,
              rgba(0,0,0,0.22) 1px,
              transparent 1px,
              transparent 3px
            )
          `,
        }}
      >
        <div
          className="absolute left-0 right-0 h-[2px] bg-[#0C0C0C]/40"
          style={{
            top: 0,
            boxShadow: `
              0 0 6px 1px rgba(12,12,12,0.15),
              0 2px 8px 0px rgba(12,12,12,0.10)
            `,
          }}
        />
        <div
          className="absolute left-0 right-0 h-8"
          style={{
            top: '2px',
            background: `
              linear-gradient(
                to bottom,
                rgba(244,243,237,0.06) 0%,
                transparent 100%
              )
            `,
          }}
        />
      </div> */}
    </>
  );
}
