import * as THREE from 'three';
import { WEBGL_PALETTE } from '@/components/webgl/palette';

/** Per-frame values the camera writes and every window reads, without re-rendering React. */
export const fieldState = {
  cameraZ: 2,
  edge: new THREE.Color(WEBGL_PALETTE.ink),
  title: new THREE.Color(WEBGL_PALETTE.yellow),
};
