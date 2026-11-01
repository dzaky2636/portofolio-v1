'use client';

import { useEffect } from 'react';
import { trackAction, type TrackedAction } from '@/lib/actionTracking';

const TRACKED_REACTIONS: Record<string, TrackedAction> = {
  cv: 'cv-download',
  email: 'email-copy',
};

export default function ActionTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const reaction = event.target.closest('[data-boar-react]')?.getAttribute('data-boar-react');
      const action = reaction ? TRACKED_REACTIONS[reaction] : undefined;
      if (action) trackAction(action);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
