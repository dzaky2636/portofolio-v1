'use client';

import { useEffect } from 'react';
import { setBackgroundMusicEnabled } from '@/lib/backgroundMusic';

const STORAGE_KEY = 'dzaky-corner-music';

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
  if (enabled) root.dataset.music = 'on';
  else delete root.dataset.music;

  document.querySelectorAll('[data-music-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(enabled));
  });
}

export default function MusicController() {
  useEffect(() => {
    const stored = readStored();
    apply(stored);

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-music-toggle]')) return;
      const enabled = document.documentElement.dataset.music !== 'on';
      apply(enabled);
      store(enabled);
      setBackgroundMusicEnabled(enabled);
    };

    // A returning visitor's "on" has to wait for their first gesture before audio is allowed.
    const resumeOnGesture = () => {
      window.removeEventListener('keydown', resumeOnGesture);
      document.removeEventListener('click', resumeOnGesture, true);
      if (document.documentElement.dataset.music === 'on') setBackgroundMusicEnabled(true);
    };

    document.addEventListener('click', handleClick);
    if (stored) {
      window.addEventListener('keydown', resumeOnGesture);
      document.addEventListener('click', resumeOnGesture, true);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', resumeOnGesture);
      document.removeEventListener('click', resumeOnGesture, true);
    };
  }, []);

  return null;
}
