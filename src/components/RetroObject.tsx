'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function RetroObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  const { geometry, edgesGeometry, originalPositions } = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(1.5, 0);
    const positions = geo.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      const displacement = Math.sin(x * 3) * 0.15 + Math.cos(y * 2) * 0.1;
      positions.setXYZ(i, x + displacement, y + displacement * 0.5, z + displacement);
    }

    positions.needsUpdate = true;
    geo.computeVertexNormals();

    const edges = new THREE.EdgesGeometry(geo);
    const origPos = new Float32Array(positions.array);

    return { geometry: geo, edgesGeometry: edges, originalPositions: origPos };
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    const edges = edgesRef.current;
    if (!mesh || !edges) return;

    const time = state.clock.getElapsedTime();

    mesh.rotation.x = time * 0.4;
    mesh.rotation.y = time * 0.3;
    mesh.rotation.z = time * 0.2;
    edges.rotation.copy(mesh.rotation);

    const posAttr = mesh.geometry.attributes.position;
    const snapGrid = 0.08;
    const jitterAmount = 0.04;

    for (let i = 0; i < posAttr.count; i++) {
      const origX = originalPositions[i * 3];
      const origY = originalPositions[i * 3 + 1];
      const origZ = originalPositions[i * 3 + 2];

      const wobbleX = Math.sin(time * 3 + origX * 4) * jitterAmount;
      const wobbleY = Math.cos(time * 2.5 + origY * 4) * jitterAmount;
      const wobbleZ = Math.sin(time * 2.8 + origZ * 4) * jitterAmount;

      posAttr.setXYZ(
        i,
        Math.round((origX + wobbleX) / snapGrid) * snapGrid,
        Math.round((origY + wobbleY) / snapGrid) * snapGrid,
        Math.round((origZ + wobbleZ) / snapGrid) * snapGrid
      );
    }

    posAttr.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial color="#2945FF" side={THREE.DoubleSide} />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#0C0C0C" linewidth={2} />
      </lineSegments>
    </group>
  );
}
