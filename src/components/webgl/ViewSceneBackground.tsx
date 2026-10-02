'use client';

import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { WEBGL_PALETTE } from '@/components/webgl/palette';

/** Fills the entire drei View scissor with paper (no inset plane). */
export default function ViewSceneBackground() {
  const scene = useThree((s) => s.scene);

  useLayoutEffect(() => {
    const previous = scene.background;
    scene.background = new THREE.Color(WEBGL_PALETTE.paper);
    return () => {
      scene.background = previous;
    };
  }, [scene]);

  return null;
}
