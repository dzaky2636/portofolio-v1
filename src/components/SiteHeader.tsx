'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import LanguageToggle from '@/components/LanguageToggle';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { useActiveSection } from '@/hooks/useActiveSection';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import FakeBsod, { type FakeBsodContent } from '@/components/FakeBsod';
import { playRetroClick } from '@/lib/retroClick';

export interface NavLink {
  href: string;
  label: string;
}

interface SiteHeaderProps {
  navLinks: NavLink[];
  currentLang: string;
  menuOpen: string;
  menuClose: string;
  scrollBufferLabel: string;
  bsod: FakeBsodContent;
}

function hrefToId(href: string) {
  return href.startsWith('#') ? href.slice(1) : href;
}

export default function SiteHeader({
  navLinks,
  currentLang,
  menuOpen,
  menuClose,
  scrollBufferLabel,
  bsod,
}: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bsodOpen, setBsodOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLElement>(null);
  const logoClickTimesRef = useRef<number[]>([]);

  const sectionIds = navLinks.map((link) => hrefToId(link.href));
  const activeSection = useActiveSection(sectionIds);
  const reducedMotion = usePrefersReducedMotion();

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleLogoClick = useCallback(() => {
    playRetroClick();

    const now = Date.now();
    const recent = logoClickTimesRef.current.filter((t) => now - t < 2000);
    recent.push(now);
    logoClickTimesRef.current = recent;

    if (recent.length >= 3) {
      logoClickTimesRef.current = [];
      setBsodOpen(true);
    }
  }, []);

  const closeBsod = useCallback(() => setBsodOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  useEffect(() => {
    if (!isOpen || !mobilePanelRef.current) return;

    const panel = mobilePanelRef.current;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => {
      document.removeEventListener('keydown', handleTab);
      menuButtonRef.current?.focus();
    };
  }, [isOpen]);

  const linkClass = (href: string, block = false) => {
    const isActive = activeSection === hrefToId(href);
    const base = block
      ? 'block w-full font-mono uppercase tracking-widest text-xs px-4 py-3 hover:bg-[#F4F3ED] hover:text-[#2945FF] active:translate-x-[2px] transition-colors duration-75 pointer-events-auto retro-focus'
      : 'relative font-mono uppercase tracking-widest text-xs hover:text-[#2945FF] transition-colors duration-75 hover-jam pointer-events-auto retro-focus';

    const active = isActive
      ? ' text-[#2945FF] border-b-2 border-[#2945FF]'
      : '';

    return `${base}${active}`;
  };

  return (
    <header className="sticky top-0 z-[60] bg-[#F4F3ED] border-b-4 border-black pointer-events-auto shadow-[0_4px_0_#0C0C0C] isolate">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleLogoClick}
          {...(!reducedMotion ? { 'data-twitch': true } : {})}
          className={`font-mono uppercase tracking-widest text-xs font-bold border-2 border-black px-2 py-1 bg-white shadow-[4px_4px_0px_#0C0C0C] cursor-pointer hover:border-[#2945FF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[3px_3px_0px_#0C0C0C] transition-all duration-75 retro-focus ${
            reducedMotion ? '' : 'animate-flicker'
          }`}
          aria-label={"Dzaky's Corner"}
        >
          {"DZAKY'S CORNER"}
        </button>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main">
          {navLinks.map((link) => {
            const isActive = activeSection === hrefToId(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={linkClass(link.href)}
                aria-current={isActive ? 'location' : undefined}
              >
                {isActive ? `[ * ] ${link.label}` : link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 pointer-events-auto">
          <LanguageToggle currentLang={currentLang} />
          <button
            ref={menuButtonRef}
            type="button"
            className="md:hidden font-mono uppercase tracking-widest text-xs border-2 border-black px-2 py-1 bg-white shadow-[4px_4px_0px_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0C0C0C] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#0C0C0C] transition-all duration-75 retro-focus"
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
          ref={mobilePanelRef}
          id="mobile-nav-panel"
          className="md:hidden border-t-4 border-black bg-white shadow-[8px_8px_0px_#0C0C0C] mx-4 mb-4 animate-iris"
          aria-label="Main mobile"
        >
          {navLinks.map((link, index) => {
            const isActive = activeSection === hrefToId(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`${linkClass(link.href, true)} ${
                  index < navLinks.length - 1 ? 'border-b-2 border-black' : ''
                }`}
                aria-current={isActive ? 'location' : undefined}
              >
                {isActive ? `[ * ] ${link.label}` : link.label}
              </a>
            );
          })}
        </nav>
      )}

      <ScrollProgressBar label={scrollBufferLabel} />

      <FakeBsod open={bsodOpen} onClose={closeBsod} content={bsod} />
    </header>
  );
}
