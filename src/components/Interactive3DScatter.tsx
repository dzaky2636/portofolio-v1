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
  const groupRef = useRef<THREE.Group>(null);

  /* Slow idle tumble on the whole group */
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x += delta * 0.04;
    groupRef.current.rotation.y += delta * 0.07;
  });

  const currentScale = hovered ? baseScale * 1.2 : baseScale;
  const currentDistort = hovered ? 0.5 : 0.15;
  const currentSpeed = hovered ? 5 : 1.2;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={currentScale}
    >
      {/* 
        Invisible hit-target sphere.
        MeshDistortMaterial displaces vertices in the GPU shader, which means
        the CPU-side geometry bounding box used by the raycaster does NOT match
        the visible distorted mesh. Without a stable hit target, rapid distort
        changes cause the raycaster to miss, creating a hover/unhover loop that
        makes the shape flicker or appear to vanish.
      */}
      <mesh
        visible={false}
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
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Visible distorted shape */}
      <mesh frustumCulled={false}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={COLORS[colorIndex]}
          distort={currentDistort}
          speed={currentSpeed}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
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
    for (let i = 0; i < 10; i++) {
      data.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 14,
          -3 - Math.random() * 5,
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        scale: 0.35 + Math.random() * 0.5,
        floatSpeed: 0.5 + Math.random() * 1.2,
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
          rotationIntensity={0.2}
          floatIntensity={0.5}
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
  const camera = useMemo(
    () => ({ position: [0, 0, 12] as [number, number, number], fov: 60 }),
    []
  );

  const gl = useMemo(
    () => ({ antialias: true, alpha: true }),
    []
  );

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <Canvas
        camera={camera}
        gl={gl}
        dpr={[1, 2]}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        onCreated={({ gl: renderer, scene }) => {
          // Defensive: force transparent background so the canvas never
          // accidentally renders an opaque clear that covers the page.
          renderer.setClearColor(0x000000, 0);
          scene.background = null;
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
