'use client';

import { useCallback, useState } from 'react';
import KonamiAchievement, {
  type KonamiAchievementContent,
} from '@/components/KonamiAchievement';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import {
  KONAMI_SHOW_EVERY_COMPLETION,
  KONAMI_STORAGE_KEY,
} from '@/lib/konamiSequence';

interface KonamiCheatListenerProps {
  content: KonamiAchievementContent;
}

export default function KonamiCheatListener({ content }: KonamiCheatListenerProps) {
  const [open, setOpen] = useState(false);

  const handleComplete = useCallback(() => {
    try {
      const seen = localStorage.getItem(KONAMI_STORAGE_KEY);
      if (!seen) {
        localStorage.setItem(KONAMI_STORAGE_KEY, '1');
      }
      if (KONAMI_SHOW_EVERY_COMPLETION || !seen) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  useKonamiCode({ onComplete: handleComplete });

  const close = useCallback(() => setOpen(false), []);

  return <KonamiAchievement open={open} onClose={close} content={content} />;
}
