'use client';

import { useState } from 'react';

interface LanguageToggleProps {
  currentLang: string;
}

export default function LanguageToggle({ currentLang }: LanguageToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const targetLang = currentLang === 'en' ? 'id' : 'en';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAnimating) {
      e.preventDefault();
      return;
    }
    setIsAnimating(true);
    // Let navigation happen after a brief animation beat
    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div
      className={`flex items-center border-2 border-black bg-white overflow-hidden ${
        isAnimating ? 'animate-twitch' : ''
      }`}
    >
      <span className="px-3 py-1 font-mono uppercase tracking-widest text-xs bg-[#0C0C0C] text-white">
        {currentLang.toUpperCase()}
      </span>
      <a
        href={`/${targetLang}`}
        onClick={handleClick}
        className="relative px-3 py-1 font-mono uppercase tracking-widest text-xs hover:bg-[#2945FF] hover:text-white transition-colors duration-75"
      >
        {targetLang.toUpperCase()}
      </a>
    </div>
  );
}
