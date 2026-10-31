'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  BOAR_BODY,
  BOAR_LEGS_DOWN,
  BOAR_LEGS_UP,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  type SpritePixel,
} from '@/lib/boarSprite';
import { WEBGL_PALETTE } from '@/components/webgl/palette';

const VOXEL = 0.032;
const DEPTH_LAYERS = 3;
const RADIUS_X = 1.4;
const RADIUS_Z = 0.95;
const ORBIT_SPEED = 0.42;
const LEG_SWAP_SECONDS = 0.14;
const BOB_HEIGHT = 0.012;

function VoxelLayer({
  pixels,
  meshRef,
}: {
  pixels: SpritePixel[];
  meshRef?: React.RefObject<THREE.InstancedMesh | null>;
}) {
  const localRef = useRef<THREE.InstancedMesh>(null);
  const ref = meshRef ?? localRef;
  const geometry = useMemo(() => new THREE.BoxGeometry(VOXEL, VOXEL, VOXEL), []);
  const count = pixels.length * DEPTH_LAYERS;

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    let index = 0;

    for (const pixel of pixels) {
      color.set(pixel.color);
      for (let layer = 0; layer < DEPTH_LAYERS; layer++) {
        matrix.setPosition(
          (pixel.x - SPRITE_WIDTH / 2) * VOXEL,
          (SPRITE_HEIGHT - pixel.y) * VOXEL,
          (layer - (DEPTH_LAYERS - 1) / 2) * VOXEL
        );
        mesh.setMatrixAt(index, matrix);
        mesh.setColorAt(index, color);
        index += 1;
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [pixels, ref]);

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, count]} frustumCulled={false}>
      <meshBasicMaterial />
    </instancedMesh>
  );
}

/** The site mascot in 3D, walking laps around the monitor. */
export default function WalkingBoar({ groundY }: { groundY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const legsDownRef = useRef<THREE.InstancedMesh>(null);
  const legsUpRef = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const time = state.clock.elapsedTime;
    const angle = time * ORBIT_SPEED;
    const legsDown = Math.floor(time / LEG_SWAP_SECONDS) % 2 === 0;

    group.position.set(
      Math.cos(angle) * RADIUS_X,
      groundY + (legsDown ? 0 : BOB_HEIGHT),
      Math.sin(angle) * RADIUS_Z
    );
    group.rotation.y = Math.atan2(-Math.cos(angle) * RADIUS_Z, -Math.sin(angle) * RADIUS_X);

    if (legsDownRef.current) legsDownRef.current.visible = legsDown;
    if (legsUpRef.current) legsUpRef.current.visible = !legsDown;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[SPRITE_WIDTH * VOXEL, DEPTH_LAYERS * VOXEL * 1.6]} />
        <meshBasicMaterial color={WEBGL_PALETTE.ink} transparent opacity={0.22} />
      </mesh>
      <VoxelLayer pixels={BOAR_BODY} />
      <VoxelLayer pixels={BOAR_LEGS_DOWN} meshRef={legsDownRef} />
      <VoxelLayer pixels={BOAR_LEGS_UP} meshRef={legsUpRef} />
    </group>
  );
}
