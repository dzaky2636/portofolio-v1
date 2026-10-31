'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { playRetroClick } from '@/lib/retroClick';
import {
  BOAR_BODY,
  BOAR_LEGS_DOWN,
  BOAR_LEGS_UP,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  type SpritePixel,
} from '@/lib/boarSprite';

const PIXEL_SIZE = 3;
const WIDTH = SPRITE_WIDTH * PIXEL_SIZE;
const HEIGHT = SPRITE_HEIGHT * PIXEL_SIZE;

const WALK_SPEED = 42;
const RAGE_SPEED = 320;
const RAGE_MS = 3000;
const RAGE_CLICKS = 5;
const RAGE_WINDOW_MS = 3000;
const LEG_SWAP_MS = 140;
const PERCH_CHECK_MS = 800;
const BUBBLE_MS = 2400;
const HEADER_CLEARANCE = 110;
const MIN_PERCH_WIDTH = 140;

type ReactionKey = 'email' | 'cv' | 'live' | 'cousin';

export interface BoarMascotContent {
  click: string[];
  rage: string;
  reactions: Record<ReactionKey, string>;
}

interface Hop {
  fromX: number;
  fromY: number;
  toX: number;
  startedAt: number;
  durationMs: number;
  height: number;
}

function SpritePixels({ pixels }: { pixels: SpritePixel[] }) {
  return pixels.map(({ x, y, color }) => (
    <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
  ));
}

function visiblePerches() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-boar-perch]')).filter((el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.width >= MIN_PERCH_WIDTH &&
      rect.top >= HEADER_CLEARANCE &&
      rect.top <= window.innerHeight - HEIGHT
    );
  });
}

function pickRandom<T>(items: T[]): T | undefined {
  return items[Math.floor(Math.random() * items.length)];
}

function randomXOn(rect: DOMRect) {
  return rect.left + Math.random() * Math.max(0, rect.width - WIDTH);
}

function surfaceY(perch: HTMLElement) {
  return perch.getBoundingClientRect().top + window.scrollY - HEIGHT;
}

export default function BoarMascot({ content }: { content: BoarMascotContent }) {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const legsDownRef = useRef<SVGGElement>(null);
  const legsUpRef = useRef<SVGGElement>(null);
  const pokeRef = useRef<() => void>(() => {});
  const [bubble, setBubble] = useState<{ text: string; alignRight: boolean } | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const root = rootRef.current;
    const flip = flipRef.current;
    const legsDown = legsDownRef.current;
    const legsUp = legsUpRef.current;
    if (!root || !flip || !legsDown || !legsUp) return;

    let raf = 0;
    let lastFrame = performance.now();
    let lastPerchCheck = 0;
    let lastLegSwap = 0;
    let legsAreDown = true;
    let perch: HTMLElement | null = null;
    let hop: Hop | null = null;
    let x = 0;
    let y = 0;
    let dir = 1;
    let idleUntil = 0;
    let nextIdleAt = 0;
    let rageUntil = 0;
    let clickIndex = 0;
    let clickTimes: number[] = [];
    let bubbleTimer = 0;

    const startHop = (target: HTMLElement, toX: number, height: number, durationMs: number) => {
      perch = target;
      hop = { fromX: x, fromY: y, toX, startedAt: performance.now(), durationMs, height };
      if (toX !== x) dir = toX > x ? 1 : -1;
    };

    const dropIn = () => {
      const target = pickRandom(visiblePerches());
      if (!target) return false;
      const toX = randomXOn(target.getBoundingClientRect());
      x = toX;
      y = window.scrollY - HEIGHT;
      startHop(target, toX, 0, 420);
      root.style.visibility = 'visible';
      return true;
    };

    const perchInView = () => {
      if (!perch?.isConnected) return false;
      const rect = perch.getBoundingClientRect();
      return rect.width > 0 && rect.top >= 70 && rect.top <= window.innerHeight;
    };

    const say = (text: string) => {
      if (!perchInView()) dropIn();
      window.clearTimeout(bubbleTimer);
      setBubble({ text, alignRight: x > window.innerWidth / 2 });
      bubbleTimer = window.setTimeout(() => setBubble(null), BUBBLE_MS);
    };

    const hopToAnother = () => {
      const target = pickRandom(visiblePerches().filter((el) => el !== perch));
      if (!target) {
        dir = -dir;
        return;
      }
      const rect = target.getBoundingClientRect();
      const distance = Math.abs(rect.top + window.scrollY - HEIGHT - y);
      startHop(target, randomXOn(rect), 70 + Math.min(distance, 240) * 0.3, 700);
    };

    pokeRef.current = () => {
      playRetroClick();

      const now = performance.now();
      clickTimes = [...clickTimes.filter((t) => now - t < RAGE_WINDOW_MS), now];

      if (clickTimes.length >= RAGE_CLICKS) {
        clickTimes = [];
        rageUntil = now + RAGE_MS;
        idleUntil = 0;
        say(content.rage);
        return;
      }

      say(content.click[clickIndex % content.click.length]);
      clickIndex += 1;
      if (perch && !hop) startHop(perch, x, 26, 320);
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const key = event.target
        .closest<HTMLElement>('[data-boar-react]')
        ?.getAttribute('data-boar-react');
      if (key && key in content.reactions) say(content.reactions[key as ReactionKey]);
    };
    document.addEventListener('click', handleDocumentClick);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - lastFrame, 250) / 1000;
      lastFrame = now;

      if (document.documentElement.classList.contains('boot-lock')) return;

      if (!hop && now - lastPerchCheck > PERCH_CHECK_MS) {
        lastPerchCheck = now;
        if (!perchInView()) dropIn();
      }
      if (!perch) return;

      const raging = now < rageUntil;
      let moving = true;

      if (hop) {
        const progress = Math.min((now - hop.startedAt) / hop.durationMs, 1);
        const toY = perch.isConnected ? surfaceY(perch) : hop.fromY;
        x = hop.fromX + (hop.toX - hop.fromX) * progress;
        y = hop.fromY + (toY - hop.fromY) * progress - hop.height * 4 * progress * (1 - progress);
        if (progress >= 1) hop = null;
      } else if (perch.isConnected) {
        const rect = perch.getBoundingClientRect();
        const minX = rect.left;
        const maxX = rect.right - WIDTH;
        y = rect.top + window.scrollY - HEIGHT;

        if (!raging && now >= nextIdleAt) {
          idleUntil = now + 1200 + Math.random() * 1800;
          nextIdleAt = idleUntil + 4000 + Math.random() * 5000;
        }

        if (raging || now >= idleUntil) {
          x += dir * (raging ? RAGE_SPEED : WALK_SPEED) * dt;
          if (x <= minX || x >= maxX) {
            x = Math.min(Math.max(x, minX), maxX);
            if (raging || Math.random() < 0.4) dir = x <= minX ? 1 : -1;
            else hopToAnother();
          }
        } else {
          moving = false;
        }
      }

      if (moving && now - lastLegSwap > (raging ? LEG_SWAP_MS / 3 : LEG_SWAP_MS)) {
        lastLegSwap = now;
        legsAreDown = !legsAreDown;
      }
      if (!moving) legsAreDown = true;

      legsDown.style.display = legsAreDown ? '' : 'none';
      legsUp.style.display = legsAreDown ? 'none' : '';
      flip.style.transform = `scaleX(${dir})`;
      root.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(bubbleTimer);
      document.removeEventListener('click', handleDocumentClick);
      pokeRef.current = () => {};
    };
  }, [reducedMotion, content]);

  if (reducedMotion) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="absolute left-0 top-0 z-50 pointer-events-none"
      style={{ width: WIDTH, height: HEIGHT, visibility: 'hidden' }}
    >
      {bubble && (
        <p
          className={`absolute bottom-full mb-2 w-max max-w-[150px] bg-white border-2 border-black shadow-[3px_3px_0px_#0C0C0C] px-2 py-1 font-mono uppercase tracking-widest text-[10px] leading-snug text-[#0C0C0C] ${
            bubble.alignRight ? 'right-0' : 'left-0'
          }`}
        >
          {bubble.text}
        </p>
      )}
      <button
        type="button"
        tabIndex={-1}
        onPointerDown={() => pokeRef.current()}
        className="absolute -inset-1.5 p-1.5 bg-transparent border-0 cursor-pointer pointer-events-auto"
      >
        <div ref={flipRef}>
          <svg
            viewBox={`0 0 ${SPRITE_WIDTH} ${SPRITE_HEIGHT}`}
            width={WIDTH}
            height={HEIGHT}
            shapeRendering="crispEdges"
            className="block"
          >
            <SpritePixels pixels={BOAR_BODY} />
            <g ref={legsDownRef}>
              <SpritePixels pixels={BOAR_LEGS_DOWN} />
            </g>
            <g ref={legsUpRef} style={{ display: 'none' }}>
              <SpritePixels pixels={BOAR_LEGS_UP} />
            </g>
          </svg>
        </div>
      </button>
    </div>
  );
}
