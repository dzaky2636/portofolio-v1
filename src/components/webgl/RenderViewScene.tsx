'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';
import WalkingBoar from '@/components/webgl/WalkingBoar';
import { WEBGL_PALETTE } from '@/components/webgl/palette';
import {
  drawScreen,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  terminalLines,
  type ScreenMode,
} from '@/components/webgl/screenDisplay';
import { publicAssetUrl } from '@/lib/publicAssetUrl';
import type { StatusReport } from '@/lib/siteStatus';

/** Kenney Computer Screen (CC0). `metal` is the display quad; `metalDark` is the chassis. */
const MODEL_PATH = '/models/computer-screen/computerScreen.obj';
const SCREEN_MATERIAL = 'metal';
const GRID_Y = -0.72;
const TARGET_WIDTH = 1.75;
const MODEL_YAW = Math.PI + Math.PI / 4;
const SWAY_ANGLE = 0.22;
const SWAY_SPEED = 0.4;

/** Display quad corners in OBJ space; the screen faces -Z with a slight upward tilt. */
const SCREEN_BOTTOM_LEFT = new THREE.Vector3(-0.0067757, 0.0555857, 0.0358115);
const SCREEN_BOTTOM_RIGHT = new THREE.Vector3(-0.3859123, 0.0555857, 0.0358115);
const SCREEN_TOP_LEFT = new THREE.Vector3(-0.0067757, 0.2869724, 0.0683308);
const SCREEN_LIFT = 0.0015;

const TYPE_CHARS_PER_SECOND = 28;
const TERMINAL_HOLD_SECONDS = 7;
const SCREEN_FPS = 15;
const STATUS_REFRESH_MS = 60_000;

function materialColor(name: string) {
  return name === SCREEN_MATERIAL ? WEBGL_PALETTE.blue : WEBGL_PALETTE.paper;
}

function createScreenPlane(texture: THREE.Texture) {
  const right = SCREEN_BOTTOM_RIGHT.clone().sub(SCREEN_BOTTOM_LEFT);
  const up = SCREEN_TOP_LEFT.clone().sub(SCREEN_BOTTOM_LEFT);
  const width = right.length();
  const height = up.length();
  const normal = right.clone().cross(up).normalize();

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
  );
  plane.applyMatrix4(new THREE.Matrix4().makeBasis(right.normalize(), up.normalize(), normal));
  plane.position
    .copy(SCREEN_BOTTOM_RIGHT)
    .add(SCREEN_TOP_LEFT)
    .multiplyScalar(0.5)
    .addScaledVector(normal, SCREEN_LIFT);

  return plane;
}

function useScreenTexture(mode: ScreenMode) {
  const reportRef = useRef<StatusReport | null>(null);
  const modeRef = useRef(mode);
  const typedRef = useRef(0);
  const lastDrawRef = useRef(0);
  const fontRef = useRef('monospace');

  const { ctx, texture } = useMemo(() => {
    const nextCanvas = document.createElement('canvas');
    nextCanvas.width = SCREEN_WIDTH;
    nextCanvas.height = SCREEN_HEIGHT;
    const nextTexture = new THREE.CanvasTexture(nextCanvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.minFilter = THREE.LinearFilter;
    nextTexture.magFilter = THREE.NearestFilter;
    return { ctx: nextCanvas.getContext('2d'), texture: nextTexture };
  }, []);
  const textureRef = useRef(texture);

  useEffect(() => {
    modeRef.current = mode;
    typedRef.current = 0;
    lastDrawRef.current = 0;
  }, [mode]);

  useEffect(() => {
    const family = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-jetbrains-mono')
      .trim();
    if (family) fontRef.current = `${family}, monospace`;

    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch('/api/status', { signal: controller.signal });
        if (response.ok) reportRef.current = (await response.json()) as StatusReport;
      } catch {
        /* keeps the waiting line on screen */
      }
    };

    void load();
    const interval = window.setInterval(() => void load(), STATUS_REFRESH_MS);

    return () => {
      controller.abort();
      window.clearInterval(interval);
      texture.dispose();
    };
  }, [texture]);

  useFrame((state, delta) => {
    if (!ctx) return;

    const lines = terminalLines(reportRef.current);
    const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
    const holdChars = TERMINAL_HOLD_SECONDS * TYPE_CHARS_PER_SECOND;

    typedRef.current += delta * TYPE_CHARS_PER_SECOND;
    if (typedRef.current > totalChars + holdChars) typedRef.current = 0;

    const time = state.clock.elapsedTime;
    if (time - lastDrawRef.current < 1 / SCREEN_FPS) return;
    lastDrawRef.current = time;

    drawScreen(ctx, modeRef.current, fontRef.current, lines, typedRef.current, time);
    textureRef.current.needsUpdate = true;
  });

  return texture;
}

function ComputerScreen({ mode }: { mode: ScreenMode }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useScreenTexture(mode);
  const modelUrl = useMemo(() => publicAssetUrl(MODEL_PATH), []);
  const source = useLoader(OBJLoader, modelUrl);

  const { object, scale, position } = useMemo(() => {
    const root = source.clone(true);

    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material];
      const nextMaterials = sourceMaterials.map((material) => {
        const name = material.name;
        return new THREE.MeshBasicMaterial({
          color: materialColor(name),
          name,
        });
      });

      child.material = nextMaterials.length === 1 ? nextMaterials[0] : nextMaterials;

      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(child.geometry),
        new THREE.LineBasicMaterial({ color: WEBGL_PALETTE.ink })
      );
      child.add(outline);
    });

    root.add(createScreenPlane(texture));

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    root.position.sub(box.getCenter(new THREE.Vector3()));

    const nextScale = size.x > 0 ? TARGET_WIDTH / size.x : 1;
    const scaledHeight = size.y * nextScale;
    const nextPosition: [number, number, number] = [0, GRID_Y + scaledHeight / 2, 0];

    return { object: root, scale: nextScale, position: nextPosition };
  }, [source, texture]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =
      -MODEL_YAW + Math.sin(state.clock.elapsedTime * SWAY_SPEED) * SWAY_ANGLE;
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, -MODEL_YAW, 0]} scale={scale}>
      <primitive object={object} />
    </group>
  );
}

function ViewportGrid() {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const span = 2.6;
    const step = 0.4;
    for (let v = -span; v <= span; v += step) {
      points.push(new THREE.Vector3(-span, 0, v), new THREE.Vector3(span, 0, v));
      points.push(new THREE.Vector3(v, 0, -span), new THREE.Vector3(v, 0, span));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <lineSegments geometry={geometry} position={[0, GRID_Y, 0]}>
      <lineBasicMaterial color={WEBGL_PALETTE.grid} transparent opacity={0.7} />
    </lineSegments>
  );
}

function AxisLine({
  from,
  to,
  color,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
}) {
  const geometry = useMemo(
    () =>
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...from),
        new THREE.Vector3(...to),
      ]),
    [from, to]
  );

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} />
    </lineSegments>
  );
}

function AxisGizmo() {
  const len = 0.38;
  const base: [number, number, number] = [0, GRID_Y, 0];

  return (
    <group position={[-1.45, 0, -1.05]}>
      <AxisLine from={base} to={[len, GRID_Y, 0]} color={WEBGL_PALETTE.blue} />
      <AxisLine from={base} to={[0, GRID_Y + len, 0]} color={WEBGL_PALETTE.yellow} />
      <AxisLine from={base} to={[0, GRID_Y, len]} color={WEBGL_PALETTE.ink} />
    </group>
  );
}

/** RENDER_VIEW.exe — live monitor on the viewport grid, with the boar walking laps. */
export default function RenderViewScene({ mode }: { mode: ScreenMode }) {
  return (
    <group>
      <ViewportGrid />
      <AxisGizmo />
      <WalkingBoar groundY={GRID_Y} />
      <Suspense fallback={null}>
        <ComputerScreen mode={mode} />
      </Suspense>
    </group>
  );
}
