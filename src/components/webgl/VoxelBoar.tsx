'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BOAR_VOXELS, voxelToWorld } from '@/components/webgl/boarVoxelData';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { WEBGL_PALETTE } from '@/components/webgl/palette';

const BOX = 0.075;

export default function VoxelBoar() {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  const voxels = useMemo(
    () =>
      BOAR_VOXELS.map((v) => ({
        position: voxelToWorld(v) as [number, number, number],
        color: v.color,
      })),
    []
  );

  const boxGeo = useMemo(() => new THREE.BoxGeometry(BOX, BOX, BOX * 1.1), []);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(boxGeo), [boxGeo]);

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.rotation.y += delta * 0.55;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0]} scale={1}>
      {voxels.map((voxel, index) => (
        <group key={index} position={voxel.position}>
          <mesh geometry={boxGeo}>
            <meshBasicMaterial color={voxel.color} />
          </mesh>
          <lineSegments geometry={edgeGeo} scale={1.002}>
            <lineBasicMaterial color={WEBGL_PALETTE.ink} transparent opacity={0.35} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}
