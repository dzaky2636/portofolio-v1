'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import ScatterScene from '@/components/webgl/ScatterScene';

function subscribeMediaQuery(query: string, onChange: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => subscribeMediaQuery(query, onChange),
    () => window.matchMedia(query).matches,
    () => false
  );
}

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
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isVisible = usePageVisible();

  const camera = useMemo(
    () => ({ position: [0, 0, 8] as [number, number, number], fov: 80 }),
    []
  );

  const gl = useMemo(() => ({ antialias: true, alpha: true }), []);

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas
        camera={camera}
        gl={gl}
        dpr={[1, 1.25]}
        frameloop={isVisible ? 'always' : 'never'}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        onCreated={({ gl: renderer, scene }) => {
          renderer.setClearColor(0x000000, 0);
          scene.background = null;
        }}
      >
        {!isMobile && <ScatterScene />}
        <View.Port />
      </Canvas>
    </div>
  );
}
