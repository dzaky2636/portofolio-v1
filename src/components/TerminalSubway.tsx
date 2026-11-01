'use client';

import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import {
  playGameStart,
  playSubwayCoin,
  playSubwayCrash,
  playSubwayJump,
  playSubwayLane,
  playSubwayMagnet,
  playSubwayRoll,
  playSubwayStumble,
} from '@/lib/gameSounds';
import {
  MAX_SPEED,
  START_SPEED,
  createSubwayGame,
  jump,
  moveLane,
  roll,
  stepSubway,
  subwayScore,
  type SubwayState,
} from '@/lib/subwayGame';
import { setSubwayMusicRate, startSubwayMusic, stopSubwayMusic } from '@/lib/subwayMusic';
import { drawSubway, SUBWAY_HEIGHT, SUBWAY_WIDTH } from '@/lib/subwayRender';
import type { TerminalSubwayLabels } from '@/lib/terminalCommands';

const MAX_STEP_SECONDS = 1 / 30;
const SWIPE_MIN_PX = 20;
const BEST_SCORE_KEY = 'dzaky-corner-subway-best';
const MAX_MUSIC_SPEED_UP = 0.2;

type SubwayAction = (state: SubwayState) => SubwayState;

const KEY_ACTIONS: Record<string, SubwayAction> = {
  arrowleft: (state) => moveLane(state, -1),
  arrowright: (state) => moveLane(state, 1),
  arrowup: jump,
  arrowdown: roll,
  a: (state) => moveLane(state, -1),
  d: (state) => moveLane(state, 1),
  w: jump,
  s: roll,
  ' ': jump,
};

function playActionSound(before: SubwayState, after: SubwayState) {
  if (before.status === 'ready') playGameStart();

  if (after.status === 'over') playSubwayCrash();
  else if (after.stumbleTimer > before.stumbleTimer) playSubwayStumble();
  else if (after.lane !== before.lane) playSubwayLane();
  else if (after.rollTimer > before.rollTimer) playSubwayRoll();
  else if (after.velocityY > 0 && before.velocityY <= 0) playSubwayJump();
}

function playStepSound(before: SubwayState, after: SubwayState) {
  if (after.status === 'over') playSubwayCrash();
  else if (after.magnetTimer > before.magnetTimer) playSubwayMagnet();
  else if (after.coins > before.coins) playSubwayCoin();

  // A jump buffered before landing fires on this step, not on the key press.
  if (after.velocityY > 0 && before.velocityY <= 0) playSubwayJump();
}

function musicRate(speed: number) {
  return 1 + ((speed - START_SPEED) / (MAX_SPEED - START_SPEED)) * MAX_MUSIC_SPEED_UP;
}

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

export default function TerminalSubway({
  labels,
  onExit,
}: {
  labels: TerminalSubwayLabels;
  onExit: (score: number, coins: number, best: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SubwayState>(createSubwayGame());
  const bestRef = useRef(0);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<SubwayState['status']>('ready');

  const render = useCallback((time: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) drawSubway(ctx, stateRef.current, time);
  }, []);

  const recordBest = useCallback(() => {
    const final = subwayScore(stateRef.current);
    if (final <= bestRef.current) return;
    bestRef.current = final;
    setBest(final);
    saveBest(final);
  }, []);

  const restart = useCallback(() => {
    stateRef.current = createSubwayGame();
    setScore(0);
    setCoins(0);
    setStatus('ready');
    render(performance.now());
  }, [render]);

  const exit = useCallback(() => {
    recordBest();
    onExit(subwayScore(stateRef.current), stateRef.current.coins, bestRef.current);
  }, [onExit, recordBest]);

  const act = useCallback(
    (action: SubwayAction) => {
      const before = stateRef.current;
      stateRef.current = action(before);
      playActionSound(before, stateRef.current);
      setStatus(stateRef.current.status);
      if (stateRef.current.status === 'over') recordBest();
    },
    [recordBest]
  );

  useEffect(() => {
    bestRef.current = readBest();
    setBest(bestRef.current);
    rootRef.current?.focus();
    render(performance.now());
  }, [render]);

  useEffect(() => {
    if (status !== 'playing') return;

    startSubwayMusic();
    return stopSubwayMusic;
  }, [status]);

  useEffect(() => {
    if (status !== 'playing') return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, MAX_STEP_SECONDS);
      last = now;

      const before = stateRef.current;
      const next = stepSubway(before, dt);
      stateRef.current = next;
      playStepSound(before, next);
      setSubwayMusicRate(musicRate(next.speed));
      render(now);
      setScore(subwayScore(next));
      setCoins(next.coins);

      if (next.status !== 'playing') {
        recordBest();
        setStatus(next.status);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [recordBest, render, status]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const action = KEY_ACTIONS[key];

      if (action) {
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat) act(action);
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
  }, [act, exit, restart]);

  const handleTouchStart = (event: TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    touchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  // Swipes fire as soon as they pass the threshold; waiting for the finger to lift feels late here.
  const handleTouchMove = (event: TouchEvent<HTMLCanvasElement>) => {
    const start = touchRef.current;
    if (!start) return;

    const touch = event.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN_PX) return;

    touchRef.current = null;
    if (Math.abs(dx) > Math.abs(dy)) act((state) => moveLane(state, dx > 0 ? 1 : -1));
    else act(dy > 0 ? roll : jump);
  };

  const handleTouchEnd = () => {
    if (!touchRef.current) return;
    touchRef.current = null;

    if (status === 'over') restart();
    else act(jump);
  };

  const message =
    status === 'ready' ? labels.start : status === 'over' ? labels.gameOver : labels.controls;

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className="flex min-h-0 flex-1 flex-col items-center gap-2 px-4 py-3 outline-none"
    >
      <div className="flex w-full max-w-[640px] justify-between gap-2 text-xs uppercase tracking-widest text-[#FFD700]">
        <span>
          {labels.score} {score}
        </span>
        <span>
          {labels.coins} {coins}
        </span>
        <span>
          {labels.best} {best}
        </span>
      </div>
      <div className="flex min-h-0 w-full flex-1 justify-center [container-type:size]">
        <canvas
          ref={canvasRef}
          width={SUBWAY_WIDTH}
          height={SUBWAY_HEIGHT}
          aria-label={labels.aria}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="block aspect-[4/3] touch-none self-center border-2 border-[#F4F3ED]"
          style={{ width: 'min(100cqw, 133.33cqh, 640px)', imageRendering: 'pixelated' }}
        />
      </div>
      <p className="w-full max-w-[640px] text-xs text-[#F4F3ED]">{message}</p>
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
