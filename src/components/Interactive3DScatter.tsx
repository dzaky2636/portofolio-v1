'use client';

import { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = ['#2945FF', '#FFD700', '#0C0C0C'];

/* ─── Sub-Component: The Mutating Shape ─── */
interface MutatingShapeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  baseScale: number;
}

function MutatingShape({ position, rotation, baseScale }: MutatingShapeProps) {
  const [hovered, setHovered] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const meshRef = useRef<THREE.Mesh>(null);

  /* Slow idle tumble */
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.06;
    meshRef.current.rotation.y += delta * 0.1;
  });

  const currentScale = hovered ? baseScale * 1.2 : baseScale;
  const currentDistort = hovered ? 0.6 : 0.2;
  const currentSpeed = hovered ? 6 : 1.5;

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={currentScale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        setColorIndex((prev) => (prev + 1) % COLORS.length);
      }}
    >
      <icosahedronGeometry args={[1, 1]} />
      <MeshDistortMaterial
        color={COLORS[colorIndex]}
        distort={currentDistort}
        speed={currentSpeed}
        transparent
        opacity={0.25}
      />
    </mesh>
  );
}

/* ─── Scene Content ─── */
interface ShapeData {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  floatSpeed: number;
}

function Scene() {
  const shapes = useMemo<ShapeData[]>(() => {
    const data: ShapeData[] = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 24,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 10 - 2,
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        scale: 0.35 + Math.random() * 0.65,
        floatSpeed: 0.6 + Math.random() * 1.4,
      });
    }
    return data;
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 8, 5]} intensity={0.7} />
      <pointLight position={[-8, -8, -5]} intensity={0.3} color="#2945FF" />

      {shapes.map((shape) => (
        <Float
          key={shape.id}
          speed={shape.floatSpeed}
          rotationIntensity={0.3}
          floatIntensity={0.7}
        >
          <MutatingShape
            position={shape.position}
            rotation={shape.rotation}
            baseScale={shape.scale}
          />
        </Float>
      ))}
    </>
  );
}

/* ─── Main Export ─── */
export default function Interactive3DScatter() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
