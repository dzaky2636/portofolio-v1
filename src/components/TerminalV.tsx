'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { playGameOver, playGameStart, playVCorrect, playVCross, playVHold, playVWrong } from '@/lib/gameSounds';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import type { TerminalVLabels } from '@/lib/terminalCommands';
import {
  createVGame,
  crossesFor,
  hold,
  press,
  startV,
  stepV,
  type VSide,
  type VState,
} from '@/lib/vGame';
import { drawV, V_HEIGHT, V_WIDTH } from '@/lib/vRender';

const MAX_STEP_MS = 100;
const BEST_CHANNEL_KEY = 'dzaky-corner-v-best';

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_CHANNEL_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(channel: number) {
  try {
    localStorage.setItem(BEST_CHANNEL_KEY, String(channel));
  } catch {
    /* the best channel just won't survive a reload */
  }
}

export default function TerminalV({
  labels,
  onExit,
}: {
  labels: TerminalVLabels;
  onExit: (channel: number, cp: number, best: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState(() => createVGame());
  const stateRef = useRef(game);
  const tunedAtRef = useRef(0);
  const bestRef = useRef(0);
  const [best, setBest] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const { status } = game;

  const render = useCallback(
    (now: number) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      const state = stateRef.current;
      const name = labels.colors[state.signal.word];
      drawV(ctx, state, {
        word: state.signal.reversed ? [...name].reverse().join('') : name,
        colorName: (color) => labels.colors[color],
        swappedLabel: labels.swapped,
        channelLabel: labels.channel,
        sinceTuneMs: now - tunedAtRef.current,
        reducedMotion,
      });
    },
    [labels.channel, labels.colors, labels.swapped, reducedMotion]
  );

  const recordBest = useCallback(() => {
    const reached = stateRef.current.channel;
    if (reached <= bestRef.current) return;
    bestRef.current = reached;
    setBest(reached);
    saveBest(reached);
  }, []);

  const apply = useCallback(
    (update: (state: VState) => VState) => {
      const before = stateRef.current;
      const next = update(before);
      if (next === before) return;

      stateRef.current = next;
      setGame(next);
      if (next.signal !== before.signal) tunedAtRef.current = performance.now();

      if (next.status === 'over') {
        playGameOver();
        recordBest();
      } else if (next.lives < before.lives) {
        playVWrong();
      } else if (crossesFor(next.streak) > crossesFor(before.streak)) {
        playVCross();
      } else if (next.channel > before.channel) {
        playVCorrect(next.streak);
      }
    },
    [recordBest]
  );

  const restart = useCallback(() => {
    recordBest();
    const next = createVGame();
    stateRef.current = next;
    setGame(next);
    render(performance.now());
  }, [recordBest, render]);

  const answer = useCallback(
    (side: VSide) => {
      if (stateRef.current.status === 'ready') {
        playGameStart();
        apply(startV);
        tunedAtRef.current = performance.now();
      } else {
        apply((state) => press(state, side));
      }
    },
    [apply]
  );

  const holdChannel = useCallback(() => {
    if (stateRef.current.holds > 0) playVHold();
    apply((state) => hold(state));
  }, [apply]);

  const exit = useCallback(() => {
    recordBest();
    onExit(stateRef.current.channel, stateRef.current.cp, bestRef.current);
  }, [onExit, recordBest]);

  useEffect(() => {
    bestRef.current = readBest();
    setBest(bestRef.current);
    rootRef.current?.focus();
    render(performance.now());
  }, [render]);

  useEffect(() => {
    render(performance.now());
    if (status !== 'playing') return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, MAX_STEP_MS);
      last = now;
      apply((state) => stepV(state, dt));
      render(now);
      if (stateRef.current.status === 'playing') frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [apply, render, status]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      let handled = true;

      if (key === 'arrowleft' || key === 'a') {
        if (!event.repeat) answer('left');
      } else if (key === 'arrowright' || key === 'd') {
        if (!event.repeat) answer('right');
      } else if (key === 'h') holdChannel();
      else if (key === 'r') restart();
      else if (key === 'escape' || key === 'q' || key === '`' || key === '~') exit();
      else handled = false;

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [answer, exit, restart, holdChannel]);

  const handleCanvasClick = (event: MouseEvent<HTMLCanvasElement>) => {
    if (stateRef.current.status === 'over') {
      restart();
      return;
    }
    const { left, width } = event.currentTarget.getBoundingClientRect();
    answer(event.clientX - left < width / 2 ? 'left' : 'right');
  };

  const handleCanvasMenu = (event: MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    answer('right');
  };

  const swapped = game.signal.swapped && status === 'playing';
  const message =
    status === 'ready' ? labels.start : status === 'over' ? labels.gameOver : labels.controls;
  const buttonClass = 'border-2 border-[#F4F3ED] px-2 py-0.5 hover:bg-[#2945FF] retro-focus';

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className="flex min-h-0 flex-1 flex-col items-center gap-2 px-4 py-3 outline-none"
    >
      <div className="flex w-full max-w-[640px] justify-between gap-2 text-xs uppercase tracking-widest text-[#FFD700]">
        <span>
          {labels.signal} {'#'.repeat(game.lives).padEnd(3, '-')}
        </span>
        <span>
          {labels.cp} {game.cp}
        </span>
        <span>
          {labels.best} {best}
        </span>
      </div>
      <div className="flex min-h-0 w-full flex-1 justify-center [container-type:size]">
        <canvas
          ref={canvasRef}
          width={V_WIDTH}
          height={V_HEIGHT}
          aria-label={labels.aria}
          onClick={handleCanvasClick}
          onContextMenu={handleCanvasMenu}
          className="block aspect-[4/3] touch-manipulation self-center border-2 border-[#F4F3ED]"
          style={{ width: 'min(100cqw, 133.33cqh, 640px)', imageRendering: 'pixelated' }}
        />
      </div>
      <p className="w-full max-w-[640px] text-xs text-[#F4F3ED]">{message}</p>
      <div className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-widest text-[#F4F3ED]">
        <button type="button" onClick={() => answer('left')} className={buttonClass}>
          {swapped ? labels.leftNo : labels.leftMatch}
        </button>
        <button type="button" onClick={() => answer('right')} className={buttonClass}>
          {swapped ? labels.rightMatch : labels.rightNo}
        </button>
        <button type="button" onClick={holdChannel} disabled={game.holds === 0} className={`${buttonClass} disabled:opacity-40`}>
          {labels.hold.replace('{n}', String(game.holds))}
        </button>
        <button type="button" onClick={exit} className={buttonClass}>
          {labels.quit}
        </button>
      </div>
    </div>
  );
}
