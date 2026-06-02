'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
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
    groupRef.current.rotation.x += delta * rotSpeed[0];
    groupRef.current.rotation.y += delta * rotSpeed[1];
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
          opacity={hovered ? Math.min(fillOpacity + 0.15, 0.6) : fillOpacity}
        />
      </mesh>

      {/* Harsh wireframe edges */}
      <lineSegments geometry={edgesGeometry} frustumCulled={false}>
        <lineBasicMaterial color={WIREFRAME_COLOR} transparent opacity={hovered ? 1 : 0.85} />
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
    ref.current.rotation.x += delta * rotSpeed;
    ref.current.rotation.y += delta * rotSpeed * 0.7;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.35} />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color={WIREFRAME_COLOR} transparent opacity={0.5} />
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
    const threshold = 7;
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
      <lineBasicMaterial color={PALETTE.blue} transparent opacity={0.1} />
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
    mat.opacity = 0.04;
  }, []);

  useFrame((state) => {
    if (!gridRef.current) return;
    const time = state.clock.getElapsedTime();
    const mat = gridRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.04 + Math.sin(time * 0.3) * 0.02;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[40, 20, PALETTE.ink, PALETTE.ink]}
      position={[0, -8, -5]}
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
    ref.current.rotation.x = Math.sin(time * speed) * 0.3;
    ref.current.rotation.y = time * speed * 0.5;
  });

  const geometry = useMemo(() => new THREE.RingGeometry(0.6, 1, 6), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 20), [geometry]);

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={PALETTE.yellow} side={THREE.DoubleSide} transparent opacity={0.25} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={PALETTE.ink} transparent opacity={0.6} />
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
    ref.current.rotation.x = Math.sin(time * speed * 0.4) * 0.2;
    ref.current.rotation.y = time * speed * 0.3;
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
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.15} />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color={PALETTE.ink} transparent opacity={0.7} />
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

/* ─── Scene Content ─── */
function Scene() {
  const { shapes, debris, rings, panels } = useMemo(() => {
    const s: MainShapeData[] = [];
    const d: DebrisData[] = [];
    const r: { id: number; position: [number, number, number]; scale: number; speed: number }[] = [];
    const p: { id: number; position: [number, number, number]; scale: number; speed: number; color: string }[] = [];

    // 22 main shapes with diverse geometry
    for (let i = 0; i < 22; i++) {
      s.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 16,
          -4 - Math.random() * 8,
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        scale: 0.3 + Math.random() * 0.55,
        geoType: GEO_TYPES[Math.floor(Math.random() * GEO_TYPES.length)],
        rotSpeed: [
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.3,
        ],
        wobbleIntensity: 0.5 + Math.random() * 1.5,
        wobbleSpeed: 1.5 + Math.random() * 2.5,
        fillOpacity: 0.12 + Math.random() * 0.18,
        floatSpeed: 0.6 + Math.random() * 1.4,
      });
    }

    // 50 tiny debris particles
    for (let i = 0; i < 50; i++) {
      d.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 24,
          (Math.random() - 0.5) * 18,
          -2 - Math.random() * 10,
        ],
        scale: 0.08 + Math.random() * 0.18,
        geoType: DEBRIS_TYPES[Math.floor(Math.random() * DEBRIS_TYPES.length)],
        rotSpeed: 0.5 + Math.random() * 2,
        color: Math.random() > 0.6 ? PALETTE.blue : Math.random() > 0.5 ? PALETTE.yellow : PALETTE.ink,
      });
    }

    // 6 floating rings
    for (let i = 0; i < 6; i++) {
      r.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 14,
          -3 - Math.random() * 6,
        ],
        scale: 0.4 + Math.random() * 0.6,
        speed: 0.3 + Math.random() * 0.8,
      });
    }

    // 8 floating panels (3D OS window fragments)
    for (let i = 0; i < 8; i++) {
      p.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 14,
          -3 - Math.random() * 7,
        ],
        scale: 0.35 + Math.random() * 0.45,
        speed: 0.2 + Math.random() * 0.5,
        color: [PALETTE.blue, PALETTE.yellow, '#FFFFFF', PALETTE.paper][Math.floor(Math.random() * 4)],
      });
    }

    return { shapes: s, debris: d, rings: r, panels: p };
  }, []);

  const shapePositions = useMemo(() => shapes.map((s) => s.position), [shapes]);

  return (
    <>
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
    </>
  );
}

/* ─── Camera Parallax Hook ─── */
function ParallaxCamera() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * delta * 2;
    targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * delta * 2;
    camera.position.x = targetRef.current.x * 1.5;
    camera.position.y = targetRef.current.y * 1.0;
    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return null;
}

/* ─── Main Export ─── */
export default function Interactive3DScatter() {
  const camera = useMemo(
    () => ({ position: [0, 0, 14] as [number, number, number], fov: 55 }),
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
