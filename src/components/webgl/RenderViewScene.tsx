'use client';

import { Suspense, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';
import { WEBGL_PALETTE } from '@/components/webgl/palette';
import { publicAssetUrl } from '@/lib/publicAssetUrl';

/** Kenney Computer Screen (CC0). `metal` is the display quad; `metalDark` is the chassis. */
const MODEL_PATH = '/models/computer-screen/computerScreen.obj';
const SCREEN_MATERIAL = 'metal';
const GRID_Y = -0.72;
const TARGET_WIDTH = 2.15;

function materialColor(name: string) {
  return name === SCREEN_MATERIAL ? WEBGL_PALETTE.blue : WEBGL_PALETTE.paper;
}

function ComputerScreen() {
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

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    root.position.sub(box.getCenter(new THREE.Vector3()));

    const nextScale = size.x > 0 ? TARGET_WIDTH / size.x : 1;
    const scaledHeight = size.y * nextScale;
    const nextPosition: [number, number, number] = [0, GRID_Y + scaledHeight / 2, 0];

    return { object: root, scale: nextScale, position: nextPosition };
  }, [source]);

  return (
    <group position={position} scale={scale}>
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

/** RENDER_VIEW.exe — Kenney computer screen on the viewport grid. */
export default function RenderViewScene() {
  return (
    <group>
      <ViewportGrid />
      <AxisGizmo />
      <Suspense fallback={null}>
        <ComputerScreen />
      </Suspense>
    </group>
  );
}
