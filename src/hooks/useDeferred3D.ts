'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const IDLE_TIMEOUT_MS = 2000;

/** Turns true once the page is idle, so Three.js never competes with the first paint. */
export function useDeferred3D() {
  const reducedMotion = usePrefersReducedMotion();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback !== 'function') {
      const timer = window.setTimeout(() => setIdle(true), 300);
      return () => window.clearTimeout(timer);
    }

    const handle = window.requestIdleCallback(() => setIdle(true), { timeout: IDLE_TIMEOUT_MS });
    return () => window.cancelIdleCallback(handle);
  }, []);

  return idle && !reducedMotion;
}
