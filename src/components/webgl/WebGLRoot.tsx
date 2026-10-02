'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import ScatterScene from '@/components/webgl/ScatterScene';
import { useMediaQuery } from '@/hooks/useMediaQuery';

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

function usePageVisible() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true
  );
}

export default function WebGLRoot() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isVisible = usePageVisible();

  const gl = useMemo(() => ({ antialias: true, alpha: true }), []);

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas
        gl={gl}
        dpr={[1, 1.25]}
        frameloop={isVisible ? 'always' : 'never'}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        onCreated={({ gl: renderer, scene }) => {
          renderer.setClearColor(0x000000, 0);
          scene.background = null;
        }}
      >
        <ScatterScene />
        <View.Port />
      </Canvas>
    </div>
  );
}
