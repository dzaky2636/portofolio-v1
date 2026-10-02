'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks which hash section is most visible in the viewport.
 */
export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds.join('|')]);

  return activeId;
}
