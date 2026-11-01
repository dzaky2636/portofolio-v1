'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { playRetroClick } from '@/lib/retroClick';

const DRAG_QUERY = '(pointer: fine) and (min-width: 1024px)';
const HEADER_CLEARANCE = 96;
const BOTTOM_CLEARANCE = 48;
const SHADOW_ROOM = 12;
const DRAG_SHADOW = '12px 12px 0px #2945FF';

interface Offset {
  x: number;
  y: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export default function WindowDragManager({ resetLabel }: { resetLabel: string }) {
  const [hasMoved, setHasMoved] = useState(false);
  const offsetsRef = useRef(new Map<HTMLElement, Offset>());
  const raisedRef = useRef(new Set<HTMLElement>());

  const resetWindow = useCallback((shell: HTMLElement) => {
    shell.style.transform = '';
    offsetsRef.current.delete(shell);
    if (offsetsRef.current.size === 0) setHasMoved(false);
  }, []);

  const resetAll = useCallback(() => {
    offsetsRef.current.forEach((_, shell) => {
      shell.style.transform = '';
    });
    offsetsRef.current.clear();
    raisedRef.current.forEach((el) => {
      el.style.position = '';
      el.style.zIndex = '';
    });
    raisedRef.current.clear();
    setHasMoved(false);
  }, []);

  useEffect(() => {
    let topZ = 20;

    // Ancestors can form stacking contexts, so the whole chain under <main> is raised.
    const raise = (shell: HTMLElement) => {
      topZ += 1;
      for (
        let el: HTMLElement | null = shell;
        el && el.tagName !== 'MAIN';
        el = el.parentElement
      ) {
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.style.zIndex = String(topZ);
        raisedRef.current.add(el);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !window.matchMedia(DRAG_QUERY).matches) return;
      if (!(event.target instanceof Element)) return;

      const bar = event.target.closest<HTMLElement>('[data-window-bar]');
      const shell = bar?.closest<HTMLElement>('[data-draggable-window]');
      if (!bar || !shell) return;

      event.preventDefault();
      playRetroClick();
      raise(shell);

      const start = offsetsRef.current.get(shell) ?? { x: 0, y: 0 };
      const rect = shell.getBoundingClientRect();
      const baseLeft = rect.left - start.x;
      const baseTop = rect.top + window.scrollY - start.y;
      const pointerX = event.clientX;
      const pointerY = event.clientY + window.scrollY;
      const previousShadow = shell.style.boxShadow;

      shell.style.transition = 'none';
      shell.style.boxShadow = DRAG_SHADOW;

      const handleMove = (moveEvent: PointerEvent) => {
        const viewportWidth = document.documentElement.clientWidth;
        const x = clamp(
          start.x + moveEvent.clientX - pointerX,
          -baseLeft,
          viewportWidth - rect.width - SHADOW_ROOM - baseLeft
        );
        const y = clamp(
          start.y + moveEvent.clientY + window.scrollY - pointerY,
          window.scrollY + HEADER_CLEARANCE - baseTop,
          window.scrollY + window.innerHeight - BOTTOM_CLEARANCE - baseTop
        );

        offsetsRef.current.set(shell, { x, y });
        shell.style.transform = `translate(${x}px, ${y}px)`;
        setHasMoved(true);
        document.querySelectorAll<HTMLElement>('[data-drag-hint]').forEach((hint) => {
          hint.style.display = 'none';
        });
      };

      const handleUp = () => {
        shell.style.transition = '';
        shell.style.boxShadow = previousShadow;
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleUp);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);
    };

    const handleDoubleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const shell = event.target
        .closest('[data-window-bar]')
        ?.closest<HTMLElement>('[data-draggable-window]');
      if (shell) resetWindow(shell);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('dblclick', handleDoubleClick);
    window.addEventListener('resize', resetAll);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('dblclick', handleDoubleClick);
      window.removeEventListener('resize', resetAll);
    };
  }, [resetAll, resetWindow]);

  if (!hasMoved) return null;

  return (
    <button
      type="button"
      onClick={resetAll}
      className="fixed bottom-14 right-4 z-[55] bg-[#FFD700] text-[#0C0C0C] border-4 border-black px-4 py-2 font-mono uppercase tracking-widest text-xs shadow-[4px_4px_0px_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 retro-focus"
    >
      {resetLabel}
    </button>
  );
}
