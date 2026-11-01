'use client';

import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'dzaky-corner-crt';
const POWER_ON_MS = 450;

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

function store(enabled: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
  } catch {
    /* the setting just won't survive a reload */
  }
}

function apply(enabled: boolean) {
  const root = document.documentElement;
  if (enabled) root.dataset.crt = 'on';
  else delete root.dataset.crt;

  document.querySelectorAll('[data-crt-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(enabled));
  });
}

export default function CrtController() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apply(readStored());

    let powerTimer = 0;

    const toggle = () => {
      const enabled = document.documentElement.dataset.crt !== 'on';
      apply(enabled);
      store(enabled);

      const overlay = overlayRef.current;
      if (!overlay || !enabled) return;
      overlay.classList.add('crt-power-on');
      window.clearTimeout(powerTimer);
      powerTimer = window.setTimeout(() => overlay.classList.remove('crt-power-on'), POWER_ON_MS);
    };

    const handleClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-crt-toggle]')) toggle();
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('crt:toggle', toggle);

    return () => {
      window.clearTimeout(powerTimer);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('crt:toggle', toggle);
    };
  }, []);

  return (
    <div ref={overlayRef} aria-hidden="true" className="crt-overlay">
      <div className="crt-roll" />
    </div>
  );
}
