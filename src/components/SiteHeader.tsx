'use client';

import { useCallback, useEffect, useState } from 'react';
import LanguageToggle from '@/components/LanguageToggle';

export interface NavLink {
  href: string;
  label: string;
}

interface SiteHeaderProps {
  navLinks: NavLink[];
  currentLang: string;
  menuOpen: string;
  menuClose: string;
}

export default function SiteHeader({
  navLinks,
  currentLang,
  menuOpen,
  menuClose,
}: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  return (
    <header className="sticky top-0 z-50 bg-[#F4F3ED] border-b-4 border-black pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div
          data-twitch
          className="font-mono uppercase tracking-widest text-xs font-bold border-2 border-black px-2 py-1 bg-white shadow-[4px_4px_0px_#0C0C0C] animate-flicker"
        >
          {"DZAKY'S CORNER"}
        </div>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative font-mono uppercase tracking-widest text-xs hover:text-[#2945FF] transition-colors duration-75 hover-jam pointer-events-auto"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 pointer-events-auto">
          <LanguageToggle currentLang={currentLang} />
          <button
            type="button"
            className="md:hidden font-mono uppercase tracking-widest text-xs border-2 border-black px-2 py-1 bg-white shadow-[4px_4px_0px_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0C0C0C] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#0C0C0C] transition-all duration-75"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-panel"
            aria-label={isOpen ? menuClose : menuOpen}
          >
            {isOpen ? menuClose : menuOpen}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="mobile-nav-panel"
          className="md:hidden border-t-4 border-black bg-white shadow-[8px_8px_0px_#0C0C0C] mx-4 mb-4 animate-iris"
          aria-label="Main mobile"
        >
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`block w-full font-mono uppercase tracking-widest text-xs px-4 py-3 hover:bg-[#F4F3ED] hover:text-[#2945FF] active:translate-x-[2px] transition-colors duration-75 pointer-events-auto ${
                index < navLinks.length - 1 ? 'border-b-2 border-black' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
