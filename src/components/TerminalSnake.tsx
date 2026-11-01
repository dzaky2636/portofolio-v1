'use client';

import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import { createSnakeGame, queueTurn, stepSnake, type SnakeDirection, type SnakeState } from '@/lib/snakeGame';
import type { TerminalSnakeLabels } from '@/lib/terminalCommands';

const COLS = 28;
const ROWS = 16;
const CELL = 16;
const START_TICK_MS = 140;
const FASTEST_TICK_MS = 70;
const SPEED_UP_MS = 3;
const SWIPE_MIN_PX = 20;
const BEST_SCORE_KEY = 'dzaky-corner-snake-best';

const KEY_DIRECTIONS: Record<string, SnakeDirection> = {
  arrowup: 'up',
  arrowdown: 'down',
  arrowleft: 'left',
  arrowright: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
};

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(score: number) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    /* the best score just won't survive a reload */
  }
}

function drawGame(ctx: CanvasRenderingContext2D, state: SnakeState) {
  ctx.fillStyle = '#0C0C0C';
  ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

  ctx.fillStyle = '#FF3333';
  ctx.fillRect(state.food.x * CELL + 3, state.food.y * CELL + 3, CELL - 6, CELL - 6);

  state.snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? '#FFD700' : '#2945FF';
    ctx.fillRect(part.x * CELL + 1, part.y * CELL + 1, CELL - 2, CELL - 2);
  });
}

export default function TerminalSnake({
  labels,
  onExit,
}: {
  labels: TerminalSnakeLabels;
  onExit: (score: number, best: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SnakeState>(createSnakeGame(COLS, ROWS));
  const bestRef = useRef(0);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<SnakeState['status']>('ready');

  const render = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) drawGame(ctx, stateRef.current);
  }, []);

  const restart = useCallback(() => {
    stateRef.current = createSnakeGame(COLS, ROWS);
    setScore(0);
    setStatus('ready');
    render();
  }, [render]);

  const exit = useCallback(() => {
    onExit(stateRef.current.score, bestRef.current);
  }, [onExit]);

  const turn = useCallback((direction: SnakeDirection) => {
    stateRef.current = queueTurn(stateRef.current, direction);
    setStatus(stateRef.current.status);
  }, []);

  useEffect(() => {
    bestRef.current = readBest();
    setBest(bestRef.current);
    rootRef.current?.focus();
    render();
  }, [render]);

  useEffect(() => {
    if (status !== 'playing') return;

    let timer = 0;

    const tick = () => {
      const next = stepSnake(stateRef.current);
      stateRef.current = next;
      render();
      setScore(next.score);

      if (next.score > bestRef.current) {
        bestRef.current = next.score;
        setBest(next.score);
        saveBest(next.score);
      }

      if (next.status !== 'playing') {
        setStatus(next.status);
        return;
      }

      const delay = Math.max(FASTEST_TICK_MS, START_TICK_MS - next.score * SPEED_UP_MS);
      timer = window.setTimeout(tick, delay);
    };

    timer = window.setTimeout(tick, START_TICK_MS);
    return () => window.clearTimeout(timer);
  }, [render, status]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const direction = KEY_DIRECTIONS[key];

      if (direction) {
        event.preventDefault();
        event.stopPropagation();
        turn(direction);
      } else if (key === 'escape' || key === 'q' || key === '`' || key === '~') {
        event.preventDefault();
        event.stopPropagation();
        exit();
      } else if (key === 'r') {
        event.preventDefault();
        event.stopPropagation();
        restart();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [exit, restart, turn]);

  const handleTouchStart = (event: TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    touchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLCanvasElement>) => {
    const start = touchRef.current;
    const touch = event.changedTouches[0];
    touchRef.current = null;
    if (!start) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN_PX) {
      if (status === 'over' || status === 'won') restart();
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 'right' : 'left');
    else turn(dy > 0 ? 'down' : 'up');
  };

  const message =
    status === 'ready'
      ? labels.start
      : status === 'over'
        ? labels.gameOver
        : status === 'won'
          ? labels.won
          : labels.controls;

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto px-4 py-3 outline-none"
    >
      <div className="flex w-full max-w-[448px] justify-between gap-2 text-xs uppercase tracking-widest text-[#FFD700]">
        <span>
          {labels.score} {score}
        </span>
        <span>
          {labels.best} {best}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={COLS * CELL}
        height={ROWS * CELL}
        aria-label={labels.aria}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="block w-full max-w-[448px] touch-none border-2 border-[#F4F3ED]"
        style={{ imageRendering: 'pixelated' }}
      />
      <p className="w-full max-w-[448px] text-xs text-[#F4F3ED]">{message}</p>
      <button
        type="button"
        onClick={exit}
        className="border-2 border-[#F4F3ED] px-2 py-0.5 text-xs uppercase tracking-widest text-[#F4F3ED] hover:bg-[#2945FF] retro-focus"
      >
        {labels.quit}
      </button>
    </div>
  );
}
