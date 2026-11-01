'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { View } from '@react-three/drei';
import OsWindowFieldScene from '@/components/webgl/OsWindowFieldScene';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { getTerminalGameRunning, subscribeTerminalGame } from '@/lib/terminalGameStore';

const TARGET_FPS = 30;
// Slack keeps a 60Hz display on every second frame instead of drifting to every third.
const MIN_FRAME_MS = 1000 / TARGET_FPS - 2;

/** Requests frames at a fixed rate, and none at all while a terminal game has the stage. */
function FrameLimiter() {
  const invalidate = useThree((s) => s.invalidate);
  const gameRunning = useSyncExternalStore(
    subscribeTerminalGame,
    getTerminalGameRunning,
    () => false
  );

  useEffect(() => {
    if (gameRunning) return;

    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last >= MIN_FRAME_MS) {
        last = now;
        invalidate();
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [gameRunning, invalidate]);

  return null;
}

export default function WebGLRoot() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const gl = useMemo(() => ({ antialias: true, alpha: true }), []);

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas
        gl={gl}
        dpr={[1, 1.25]}
        frameloop="demand"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        onCreated={({ gl: renderer, scene }) => {
          renderer.setClearColor(0x000000, 0);
          scene.background = null;
        }}
      >
        <FrameLimiter />
        <OsWindowFieldScene />
        <View.Port />
      </Canvas>
    </div>
  );
}
