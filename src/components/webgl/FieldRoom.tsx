'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fieldState } from '@/components/webgl/fieldState';
import { mulberry32 } from '@/components/webgl/osWindowLayout';

const FLOOR_Y = -6.5;
const CEILING_Y = 7.5;
const ROOM_HALF_WIDTH = 15;
const ROOM_NEAR_Z = 8;
const ROOM_FAR_Z = -64;
const GRID_STEP = 3;
const WALL_STEP = 3.5;
const PORTAL_STEP = 6;
const FOOT_MARK_SIZE = 0.18;

const VERT = `
uniform float pointScale;
varying float vFade;

void main() {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  float distance = -viewPosition.z;
  vFade = smoothstep(1.5, 8.0, distance) * (1.0 - smoothstep(22.0, 46.0, distance));
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = clamp(pointScale / distance, 1.0, 4.0);
}
`;

const FRAG = `
uniform vec3 color;
uniform float opacity;
varying float vFade;

void main() {
  gl_FragColor = vec4(color, opacity * vFade);
  #include <colorspace_fragment>
}
`;

function RoomMaterial({ opacity, pointScale = 0 }: { opacity: number; pointScale?: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      color: { value: fieldState.edge.clone() },
      opacity: { value: opacity },
      pointScale: { value: pointScale },
    }),
    [opacity, pointScale]
  );

  useFrame(() => {
    materialRef.current?.uniforms.color.value.copy(fieldState.edge);
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      vertexShader={VERT}
      fragmentShader={FRAG}
      transparent
      depthWrite={false}
    />
  );
}

/** A long corridor of nested portals, so every line leads to one vanishing point. */
function buildRoomSegments(): number[] {
  const segments: number[] = [];
  const west = -ROOM_HALF_WIDTH;
  const east = ROOM_HALF_WIDTH;

  for (let x = west; x <= east; x += GRID_STEP) {
    segments.push(x, FLOOR_Y, ROOM_NEAR_Z, x, FLOOR_Y, ROOM_FAR_Z);
    segments.push(x, CEILING_Y, ROOM_NEAR_Z, x, CEILING_Y, ROOM_FAR_Z);
  }

  for (let y = FLOOR_Y + WALL_STEP; y < CEILING_Y; y += WALL_STEP) {
    segments.push(west, y, ROOM_NEAR_Z, west, y, ROOM_FAR_Z);
    segments.push(east, y, ROOM_NEAR_Z, east, y, ROOM_FAR_Z);
  }

  for (let z = ROOM_NEAR_Z; z >= ROOM_FAR_Z; z -= PORTAL_STEP) {
    segments.push(west, FLOOR_Y, z, east, FLOOR_Y, z);
    segments.push(west, CEILING_Y, z, east, CEILING_Y, z);
    segments.push(west, FLOOR_Y, z, west, CEILING_Y, z);
    segments.push(east, FLOOR_Y, z, east, CEILING_Y, z);
  }

  return segments;
}

/** A plumb line from a window to the floor, ending in a cross, so it reads as grounded. */
function buildTetherSegments(anchors: [number, number, number][]): number[] {
  return anchors.flatMap(([x, y, z]) => [
    x, y, z, x, FLOOR_Y, z,
    x - FOOT_MARK_SIZE, FLOOR_Y, z, x + FOOT_MARK_SIZE, FLOOR_Y, z,
    x, FLOOR_Y, z - FOOT_MARK_SIZE, x, FLOOR_Y, z + FOOT_MARK_SIZE,
  ]);
}

function buildSpeckPoints(count: number): number[] {
  const rand = mulberry32(0x2945ff);
  return Array.from({ length: count }, () => [
    (rand() - 0.5) * 2 * ROOM_HALF_WIDTH,
    FLOOR_Y + rand() * (CEILING_Y - FLOOR_Y),
    ROOM_NEAR_Z + rand() * (ROOM_FAR_Z - ROOM_NEAR_Z),
  ]).flat();
}

function positionsGeometry(positions: number[]) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

interface FieldRoomProps {
  /** Bottom edge of each section window, in world space. */
  anchors: [number, number, number][];
  compact: boolean;
}

export default function FieldRoom({ anchors, compact }: FieldRoomProps) {
  const { roomGeo, tetherGeo, speckGeo } = useMemo(
    () => ({
      roomGeo: positionsGeometry(buildRoomSegments()),
      tetherGeo: positionsGeometry(buildTetherSegments(anchors)),
      speckGeo: positionsGeometry(buildSpeckPoints(compact ? 40 : 90)),
    }),
    [anchors, compact]
  );

  useEffect(() => {
    return () => {
      roomGeo.dispose();
      tetherGeo.dispose();
      speckGeo.dispose();
    };
  }, [roomGeo, tetherGeo, speckGeo]);

  return (
    <>
      <lineSegments geometry={roomGeo} renderOrder={-1} frustumCulled={false}>
        <RoomMaterial opacity={0.17} />
      </lineSegments>
      <lineSegments geometry={tetherGeo} renderOrder={-1} frustumCulled={false}>
        <RoomMaterial opacity={0.24} />
      </lineSegments>
      <points geometry={speckGeo} renderOrder={-1} frustumCulled={false}>
        <RoomMaterial opacity={0.3} pointScale={26} />
      </points>
    </>
  );
}
