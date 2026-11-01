'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fieldState } from '@/components/webgl/fieldState';
import { mulberry32 } from '@/components/webgl/osWindowLayout';

const FLOOR_Y = -9;
const CEILING_Y = 10;
const ROOM_HALF_WIDTH = 34;
const ROOM_NEAR_Z = 8;
const ROOM_FAR_Z = -64;
const GRID_STEP = 4;
const COLUMN_X = 19;
const COLUMN_STEP = 24;
const COLUMN_HALF_WIDTH = 0.8;
const FOOT_MARK_SIZE = 0.18;

const VERT = `
uniform float pointScale;
varying float vFade;

void main() {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  float distance = -viewPosition.z;
  vFade = smoothstep(1.5, 8.0, distance) * (1.0 - smoothstep(18.0, 40.0, distance));
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

function buildRoomSegments(): number[] {
  const segments: number[] = [];

  for (const y of [FLOOR_Y, CEILING_Y]) {
    for (let x = -ROOM_HALF_WIDTH; x <= ROOM_HALF_WIDTH; x += GRID_STEP) {
      segments.push(x, y, ROOM_NEAR_Z, x, y, ROOM_FAR_Z);
    }
    for (let z = ROOM_NEAR_Z; z >= ROOM_FAR_Z; z -= GRID_STEP) {
      segments.push(-ROOM_HALF_WIDTH, y, z, ROOM_HALF_WIDTH, y, z);
    }
  }

  for (const side of [-1, 1]) {
    for (let z = ROOM_NEAR_Z - COLUMN_STEP; z > ROOM_FAR_Z; z -= COLUMN_STEP) {
      const corners = [
        [side * COLUMN_X - COLUMN_HALF_WIDTH, z - COLUMN_HALF_WIDTH],
        [side * COLUMN_X + COLUMN_HALF_WIDTH, z - COLUMN_HALF_WIDTH],
        [side * COLUMN_X + COLUMN_HALF_WIDTH, z + COLUMN_HALF_WIDTH],
        [side * COLUMN_X - COLUMN_HALF_WIDTH, z + COLUMN_HALF_WIDTH],
      ];
      corners.forEach(([cx, cz], index) => {
        const [nextX, nextZ] = corners[(index + 1) % corners.length];
        segments.push(cx, FLOOR_Y, cz, cx, CEILING_Y, cz);
        for (const y of [FLOOR_Y, CEILING_Y]) {
          segments.push(cx, y, cz, nextX, y, nextZ);
        }
      });
    }
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
        <RoomMaterial opacity={0.12} />
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
