'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Palette ─── */
const PALETTE = {
  paper: '#F4F3ED',
  ink: '#0C0C0C',
  blue: '#2945FF',
  yellow: '#FFD700',
};

const COLORS = [PALETTE.blue, PALETTE.yellow, PALETTE.ink, PALETTE.paper];
const WIREFRAME_COLOR = PALETTE.ink;

/* ─── Shared scroll + mouse state ─── */
const globalInput = { x: 0, y: 0, scroll: 0 };

/* ─── Geometry Factory ─── */
type GeoType = 'dodecahedron' | 'icosahedron' | 'octahedron' | 'tetrahedron' | 'box' | 'cone' | 'torusKnot' | 'ring' | 'cylinder';

function createGeometry(type: GeoType) {
  switch (type) {
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(1, 0);
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(1, 0);
    case 'octahedron':
      return new THREE.OctahedronGeometry(1, 0);
    case 'tetrahedron':
      return new THREE.TetrahedronGeometry(1, 0);
    case 'box':
      return new THREE.BoxGeometry(1.4, 1.4, 1.4);
    case 'cone':
      return new THREE.ConeGeometry(0.8, 1.6, 5);
    case 'torusKnot':
      return new THREE.TorusKnotGeometry(0.6, 0.2, 32, 6);
    case 'ring':
      return new THREE.RingGeometry(0.5, 1, 6);
    case 'cylinder':
      return new THREE.CylinderGeometry(0.6, 0.6, 1.4, 6);
    default:
      return new THREE.IcosahedronGeometry(1, 0);
  }
}

/* ─── PS1 Vertex Snap Wobble ─── */
function usePS1Wobble(geometry: THREE.BufferGeometry, intensity: number, speed: number) {
  const originalPositions = useMemo(() => {
    const pos = geometry.attributes.position;
    return new Float32Array(pos.array);
  }, [geometry]);

  const wobbleRef = useRef({ geometry, originalPositions, intensity, speed });
  wobbleRef.current = { geometry, originalPositions, intensity, speed };

  useFrame((state) => {
    const { geometry: geo, originalPositions: orig, intensity: intens, speed: spd } = wobbleRef.current;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const time = state.clock.getElapsedTime();
    const snapGrid = 0.06;
    const jitter = intens * 0.04;

    for (let i = 0; i < posAttr.count; i++) {
      const ox = orig[i * 3];
      const oy = orig[i * 3 + 1];
      const oz = orig[i * 3 + 2];

      const wx = Math.sin(time * spd + ox * 4) * jitter;
      const wy = Math.cos(time * spd * 0.8 + oy * 4) * jitter;
      const wz = Math.sin(time * spd * 1.2 + oz * 4) * jitter;

      posAttr.setXYZ(
        i,
        Math.round((ox + wx) / snapGrid) * snapGrid,
        Math.round((oy + wy) / snapGrid) * snapGrid,
        Math.round((oz + wz) / snapGrid) * snapGrid
      );
    }
    posAttr.needsUpdate = true;
  });
}

/* ─── Main Shape Component ─── */
interface ShapeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  baseScale: number;
  geoType: GeoType;
  rotSpeed: [number, number, number];
  wobbleIntensity: number;
  wobbleSpeed: number;
  fillOpacity: number;
}

function PS1Shape({
  position,
  rotation,
  baseScale,
  geoType,
  rotSpeed,
  wobbleIntensity,
  wobbleSpeed,
  fillOpacity,
}: ShapeProps) {
  const [hovered, setHovered] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const groupRef = useRef<THREE.Group>(null);

  const { geometry, edgesGeometry } = useMemo(() => {
    const geo = createGeometry(geoType);
    geo.computeVertexNormals();
    const edges = new THREE.EdgesGeometry(geo, 20);
    return { geometry: geo, edgesGeometry: edges };
  }, [geoType]);

  usePS1Wobble(geometry, wobbleIntensity, wobbleSpeed);

  useEffect(() => {
    return () => {
      geometry.dispose();
      edgesGeometry.dispose();
    };
  }, [geometry, edgesGeometry]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x += delta * (rotSpeed[0] + globalInput.y * 2.0);
    groupRef.current.rotation.y += delta * (rotSpeed[1] + globalInput.x * 2.0);
    groupRef.current.rotation.z += delta * rotSpeed[2];
  });

  const currentScale = hovered ? baseScale * 1.25 : baseScale;
  const currentColor = COLORS[colorIndex];

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={currentScale}
    >
      {/* Invisible hit target to prevent flickering */}
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
        <sphereGeometry args={[1.8, 12, 12]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Filled low-poly body */}
      <mesh geometry={geometry} frustumCulled={false}>
        <meshBasicMaterial
          color={currentColor}
          side={THREE.DoubleSide}
          transparent
          opacity={hovered ? Math.min(fillOpacity + 0.08, 0.25) : fillOpacity}
        />
      </mesh>

      {/* Harsh wireframe edges */}
      <lineSegments geometry={edgesGeometry} frustumCulled={false}>
        <lineBasicMaterial color={WIREFRAME_COLOR} transparent opacity={hovered ? 0.55 : 0.35} />
      </lineSegments>
    </group>
  );
}

/* ─── Debris Particle ─── */
interface DebrisProps {
  position: [number, number, number];
  scale: number;
  geoType: GeoType;
  rotSpeed: number;
  color: string;
}

function DebrisParticle({ position, scale, geoType, rotSpeed, color }: DebrisProps) {
  const ref = useRef<THREE.Group>(null);

  const geometry = useMemo(() => createGeometry(geoType), [geoType]);
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry, 20), [geometry]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      edgesGeometry.dispose();
    };
  }, [geometry, edgesGeometry]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * (rotSpeed + globalInput.y * 1.4);
    ref.current.rotation.y += delta * (rotSpeed * 0.7 + globalInput.x * 1.4);
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.12} />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color={WIREFRAME_COLOR} transparent opacity={0.22} />
      </lineSegments>
    </group>
  );
}

/* ─── Constellation Lines ─── */
interface ConstellationProps {
  shapePositions: [number, number, number][];
}

function ConstellationLines({ shapePositions }: ConstellationProps) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const { geometry, edgePairs } = useMemo(() => {
    const pairs: [number, number][] = [];
    const threshold = 10;
    for (let i = 0; i < shapePositions.length; i++) {
      for (let j = i + 1; j < shapePositions.length; j++) {
        const a = new THREE.Vector3(...shapePositions[i]);
        const b = new THREE.Vector3(...shapePositions[j]);
        if (a.distanceTo(b) < threshold) {
          pairs.push([i, j]);
        }
      }
    }

    const positions = new Float32Array(pairs.length * 6);
    let idx = 0;
    for (const [i, j] of pairs) {
      positions[idx++] = shapePositions[i][0];
      positions[idx++] = shapePositions[i][1];
      positions[idx++] = shapePositions[i][2];
      positions[idx++] = shapePositions[j][0];
      positions[idx++] = shapePositions[j][1];
      positions[idx++] = shapePositions[j][2];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, edgePairs: pairs };
  }, [shapePositions]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    const time = state.clock.getElapsedTime();
    mat.opacity = 0.08 + Math.sin(time * 0.5) * 0.04;
  });

  if (edgePairs.length === 0) return null;

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={PALETTE.blue} transparent opacity={0.025} />
    </lineSegments>
  );
}

/* ─── Grid Floor ─── */
function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const mat = gridRef.current.material as THREE.LineBasicMaterial;
    mat.transparent = true;
    mat.opacity = 0.008;
  }, []);

  useFrame((state) => {
    if (!gridRef.current) return;
    const time = state.clock.getElapsedTime();
    const mat = gridRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.008 + Math.sin(time * 0.3) * 0.004;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[60, 30, PALETTE.ink, PALETTE.ink]}
      position={[0, -12, -5]}
      rotation={[0, 0, 0]}
    />
  );
}

/* ─── Floating Geometric Rings ─── */
function FloatingRing({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(time * speed) * 0.3 + globalInput.y * 0.6;
    ref.current.rotation.y = time * speed * 0.5 + globalInput.x * 0.6;
  });

  const geometry = useMemo(() => new THREE.RingGeometry(0.6, 1, 6), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 20), [geometry]);

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={PALETTE.yellow} side={THREE.DoubleSide} transparent opacity={0.08} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={PALETTE.ink} transparent opacity={0.30} />
      </lineSegments>
    </group>
  );
}

/* ─── Floating Panel (like a 3D OS window) ─── */
function FloatingPanel({ position, scale, speed, color }: { position: [number, number, number]; scale: number; speed: number; color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(time * speed * 0.4) * 0.2 + globalInput.y * 0.5;
    ref.current.rotation.y = time * speed * 0.3 + globalInput.x * 0.5;
    ref.current.rotation.z = Math.cos(time * speed * 0.5) * 0.1;
  });

  const { geometry, edgesGeometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1.6, 1);
    const edges = new THREE.EdgesGeometry(geo, 10);
    return { geometry: geo, edgesGeometry: edges };
  }, []);

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.05} />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color={PALETTE.ink} transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

/* ─── Data Generation ─── */
const GEO_TYPES: GeoType[] = ['dodecahedron', 'icosahedron', 'octahedron', 'tetrahedron', 'box', 'cone', 'torusKnot', 'cylinder'];
const DEBRIS_TYPES: GeoType[] = ['tetrahedron', 'box', 'octahedron'];

interface MainShapeData {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  geoType: GeoType;
  rotSpeed: [number, number, number];
  wobbleIntensity: number;
  wobbleSpeed: number;
  fillOpacity: number;
  floatSpeed: number;
}

interface DebrisData {
  id: number;
  position: [number, number, number];
  scale: number;
  geoType: GeoType;
  rotSpeed: number;
  color: string;
}

/* ─── Even spatial distribution helpers ─── */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function stratifiedGridPositions(
  count: number,
  width: number,
  height: number,
  cols: number,
  rows: number,
  jitterRatio = 0.35
): [number, number][] {
  const cells: [number, number][] = [];
  const cellW = width / cols;
  const cellH = height / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = (col + 0.5) * cellW - width / 2;
      const cy = (row + 0.5) * cellH - height / 2;
      cells.push([cx, cy]);
    }
  }
  const picked = shuffle(cells).slice(0, count);
  return picked.map(([x, y]) => {
    const jx = (Math.random() - 0.5) * cellW * jitterRatio;
    const jy = (Math.random() - 0.5) * cellH * jitterRatio;
    return [x + jx, y + jy] as [number, number];
  });
}

function layeredZ(count: number, near: number, far: number): number[] {
  const layers = 4;
  const perLayer = Math.ceil(count / layers);
  const zs: number[] = [];
  for (let i = 0; i < count; i++) {
    const layer = Math.floor(i / perLayer);
    const layerNear = near + ((far - near) / layers) * layer;
    const layerFar = near + ((far - near) / layers) * (layer + 1);
    zs.push(layerNear + Math.random() * (layerFar - layerNear));
  }
  return shuffle(zs);
}

/* ─── Scene Content ─── */
function Scene() {
  const { shapes, debris, rings, panels } = useMemo(() => {
    const s: MainShapeData[] = [];
    const d: DebrisData[] = [];
    const r: { id: number; position: [number, number, number]; scale: number; speed: number }[] = [];
    const p: { id: number; position: [number, number, number]; scale: number; speed: number; color: string }[] = [];

    /* Main shapes — 5×6 grid, 26 of 30 cells, 4 depth layers */
    const mainXY = stratifiedGridPositions(26, 38, 28, 6, 5, 0.45);
    const mainZ = layeredZ(26, -2, -12);
    for (let i = 0; i < 26; i++) {
      s.push({
        id: i,
        position: [mainXY[i][0], mainXY[i][1], mainZ[i]],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        scale: 0.45 + Math.random() * 0.75,
        geoType: GEO_TYPES[Math.floor(Math.random() * GEO_TYPES.length)],
        rotSpeed: [
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.3,
        ],
        wobbleIntensity: 0.5 + Math.random() * 1.5,
        wobbleSpeed: 1.5 + Math.random() * 2.5,
        fillOpacity: 0.04 + Math.random() * 0.05,
        floatSpeed: 0.6 + Math.random() * 1.4,
      });
    }

    /* Debris — 8×8 grid, 60 of 64 cells, scattered depth */
    const debrisXY = stratifiedGridPositions(60, 42, 32, 8, 8, 0.55);
    const debrisZ = layeredZ(60, -1, -13);
    for (let i = 0; i < 60; i++) {
      d.push({
        id: i,
        position: [debrisXY[i][0], debrisXY[i][1], debrisZ[i]],
        scale: 0.12 + Math.random() * 0.28,
        geoType: DEBRIS_TYPES[Math.floor(Math.random() * DEBRIS_TYPES.length)],
        rotSpeed: 0.5 + Math.random() * 2,
        color: Math.random() > 0.6 ? PALETTE.blue : Math.random() > 0.5 ? PALETTE.yellow : PALETTE.ink,
      });
    }

    /* Rings — 4×2 grid, all 8 cells, offset from shape grid */
    const ringXY = stratifiedGridPositions(8, 32, 24, 4, 2, 0.5);
    const ringZ = layeredZ(8, -2, -10);
    for (let i = 0; i < 8; i++) {
      r.push({
        id: i,
        position: [ringXY[i][0], ringXY[i][1], ringZ[i]],
        scale: 0.55 + Math.random() * 0.85,
        speed: 0.3 + Math.random() * 0.8,
      });
    }

    /* Panels — 5×2 grid, all 10 cells */
    const panelXY = stratifiedGridPositions(10, 34, 24, 5, 2, 0.5);
    const panelZ = layeredZ(10, -2, -11);
    for (let i = 0; i < 10; i++) {
      p.push({
        id: i,
        position: [panelXY[i][0], panelXY[i][1], panelZ[i]],
        scale: 0.45 + Math.random() * 0.65,
        speed: 0.2 + Math.random() * 0.5,
        color: [PALETTE.blue, PALETTE.yellow, '#FFFFFF', PALETTE.paper][Math.floor(Math.random() * 4)],
      });
    }

    return { shapes: s, debris: d, rings: r, panels: p };
  }, []);

  const shapePositions = useMemo(() => shapes.map((s) => s.position), [shapes]);

  return (
    <ScrollScene>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight position={[-10, -5, -5]} intensity={0.4} color={PALETTE.blue} />
      <pointLight position={[5, -8, -3]} intensity={0.3} color={PALETTE.yellow} />

      {/* Constellation lines between nearby shapes */}
      <ConstellationLines shapePositions={shapePositions} />

      {/* Grid floor for depth */}
      <GridFloor />

      {/* Main shapes with Float */}
      {shapes.map((shape) => (
        <Float
          key={shape.id}
          speed={shape.floatSpeed}
          rotationIntensity={0.15}
          floatIntensity={0.4}
        >
          <PS1Shape
            position={shape.position}
            rotation={shape.rotation}
            baseScale={shape.scale}
            geoType={shape.geoType}
            rotSpeed={shape.rotSpeed}
            wobbleIntensity={shape.wobbleIntensity}
            wobbleSpeed={shape.wobbleSpeed}
            fillOpacity={shape.fillOpacity}
          />
        </Float>
      ))}

      {/* Floating rings */}
      {rings.map((ring) => (
        <FloatingRing
          key={`ring-${ring.id}`}
          position={ring.position}
          scale={ring.scale}
          speed={ring.speed}
        />
      ))}

      {/* Floating panels (3D OS window fragments) */}
      {panels.map((panel) => (
        <FloatingPanel
          key={`panel-${panel.id}`}
          position={panel.position}
          scale={panel.scale}
          speed={panel.speed}
          color={panel.color}
        />
      ))}

      {/* Debris particles */}
      {debris.map((d) => (
        <DebrisParticle
          key={`debris-${d.id}`}
          position={d.position}
          scale={d.scale}
          geoType={d.geoType}
          rotSpeed={d.rotSpeed}
          color={d.color}
        />
      ))}
    </ScrollScene>
  );
}

/* ─── Scroll-Driven Scene Group ─── */
function ScrollScene({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const s = globalInput.scroll;
    groupRef.current.position.y = s * 0.005;
    groupRef.current.rotation.x = s * 0.00012;
    groupRef.current.rotation.z = s * 0.00004;
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ─── Camera Parallax Hook ─── */
function ParallaxCamera() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const targetRef = useRef({ mx: 0, my: 0, scroll: 0 });

  useFrame((_, delta) => {
    const lerp = 1 - Math.exp(-delta * 3);

    targetRef.current.mx += (mouseRef.current.x - targetRef.current.mx) * lerp;
    targetRef.current.my += (mouseRef.current.y - targetRef.current.my) * lerp;
    targetRef.current.scroll += (scrollRef.current - targetRef.current.scroll) * lerp;

    const s = targetRef.current.scroll;

    /* Camera flies downward through the scene as user scrolls */
    camera.position.x = targetRef.current.mx * 0.8;
    camera.position.y = targetRef.current.my * 0.5 - s * 0.008;
    camera.position.z = 8 + s * 0.003;

    /* Gentle orbit + dive tilt on scroll */
    camera.rotation.y = s * 0.0004;
    camera.rotation.x = s * 0.00012;

    camera.lookAt(0, -s * 0.006, -5);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = -(e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current.x = nx;
      mouseRef.current.y = ny;
      globalInput.x = nx;
      globalInput.y = ny;
    };
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
      globalInput.scroll = window.scrollY;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
}

/* ─── Main Export ─── */
export default function Interactive3DScatter() {
  const camera = useMemo(
    () => ({ position: [0, 0, 8] as [number, number, number], fov: 80 }),
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
        dpr={[1, 1.5]}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        onCreated={({ gl: renderer, scene }) => {
          renderer.setClearColor(0x000000, 0);
          scene.background = null;
        }}
      >
        <ParallaxCamera />
        <Scene />
      </Canvas>
    </div>
  );
}
