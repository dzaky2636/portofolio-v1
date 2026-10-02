'use client';

import { useSyncExternalStore } from 'react';

function subscribeMediaQuery(query: string, onChange: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => subscribeMediaQuery(query, onChange),
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
