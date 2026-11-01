'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fieldState } from '@/components/webgl/fieldState';
import type { WindowBehavior } from '@/components/webgl/osWindowLayout';
import { WEBGL_PALETTE } from '@/components/webgl/palette';

const TITLE_BAR_HEIGHT = 0.22;
const DEPTH = 0.06;
const BORDER = 0.04;
const FADE_NEAR_START = 1.5;
const FADE_NEAR_END = 6;
const FADE_FAR_START = 40;
const FADE_FAR_END = 24;
const PROGRESS_STEPS = 10;
const POPUP_PERIOD_SECONDS = 9;
const POPUP_OPEN_SHARE = 0.72;

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function createTitleTexture(title: string, active: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = active ? WEBGL_PALETTE.blue : WEBGL_PALETTE.paper;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = active ? '#FFFFFF' : WEBGL_PALETTE.ink;
    ctx.font = 'bold 22px monospace';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 16, canvas.height / 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export type OsWindowFrameKind = 'chapter' | 'decorative';

interface OsWindowFrameProps {
  title: string;
  active: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  compact?: boolean;
  kind?: OsWindowFrameKind;
  /** Decorative title bar tint (no canvas texture). */
  accentTitle?: boolean;
  behavior?: WindowBehavior;
  phase?: number;
}

export default function OsWindowFrame({
  title,
  active,
  position,
  rotation,
  size,
  compact = false,
  kind = 'chapter',
  accentTitle = false,
  behavior = 'still',
  phase = 0,
}: OsWindowFrameProps) {
  const isDecorative = kind === 'decorative';
  const hasTitleText = !isDecorative || behavior === 'labelled';
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);
  const bodyOpacityRef = useRef(0.07);
  const edgeOpacityRef = useRef(0.32);

  const [width, height] = size;
  const scaleMul = compact ? 0.85 : 1;
  const bodyW = width * scaleMul;
  const bodyH = height * scaleMul;

  const { shellGeo, titleGeo, bodyGeo, edgesGeo, titleTexture, progressGeo } = useMemo(() => {
    const shell = new THREE.BoxGeometry(bodyW + BORDER * 2, bodyH + TITLE_BAR_HEIGHT + BORDER * 2, DEPTH);
    const titlePlane = new THREE.PlaneGeometry(bodyW, TITLE_BAR_HEIGHT);
    const bodyPlane = new THREE.PlaneGeometry(bodyW, bodyH);
    const edges = new THREE.EdgesGeometry(shell, 1);
    const tex = hasTitleText ? createTitleTexture(title, active) : null;
    // Anchored at its left edge so scaling on X fills like a progress bar.
    const progress = new THREE.PlaneGeometry(bodyW * 0.8, 0.12);
    progress.translate((bodyW * 0.8) / 2, 0, 0);
    return {
      shellGeo: shell,
      titleGeo: titlePlane,
      bodyGeo: bodyPlane,
      edgesGeo: edges,
      titleTexture: tex,
      progressGeo: progress,
    };
  }, [bodyW, bodyH, title, active, hasTitleText]);

  const titleBarColor = active
    ? WEBGL_PALETTE.blue
    : accentTitle
      ? WEBGL_PALETTE.yellow
      : WEBGL_PALETTE.paper;

  const titleMat = useMemo(() => {
    if (titleTexture) {
      return new THREE.MeshBasicMaterial({
        map: titleTexture,
        transparent: true,
        side: THREE.DoubleSide,
      });
    }
    return new THREE.MeshBasicMaterial({
      color: titleBarColor,
      transparent: true,
      opacity: isDecorative ? 0.78 : 1,
      side: THREE.DoubleSide,
    });
  }, [titleTexture, titleBarColor, isDecorative]);

  useEffect(() => {
    return () => {
      titleTexture?.dispose();
      shellGeo.dispose();
      titleGeo.dispose();
      bodyGeo.dispose();
      edgesGeo.dispose();
      progressGeo.dispose();
      titleMat.dispose();
    };
  }, [titleTexture, shellGeo, titleGeo, bodyGeo, edgesGeo, progressGeo, titleMat]);

  const bodyMatRef = useRef(
    new THREE.MeshBasicMaterial({
      color: '#FFFFFF',
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide,
    })
  );

  const edgeMatRef = useRef(
    new THREE.LineBasicMaterial({
      color: WEBGL_PALETTE.ink,
      transparent: true,
      opacity: 0.32,
    })
  );

  const titleRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  const progressRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);

  const targetScale = active ? 1.06 : 1;
  const targetBodyOpacity = active
    ? compact
      ? 0.14
      : 0.18
    : isDecorative
      ? compact
        ? 0.06
        : 0.08
      : compact
        ? 0.07
        : 0.09;
  const decorativeEdgeOpacity = compact ? 0.18 : 0.3;
  const decorativeTitleOpacity = compact ? 0.45 : 0.78;
  const targetEdgeOpacity = active ? 0.58 : isDecorative ? decorativeEdgeOpacity : 0.38;

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const lerp = 1 - Math.exp(-delta * 8);
    scaleRef.current += (targetScale - scaleRef.current) * lerp;
    bodyOpacityRef.current += (targetBodyOpacity - bodyOpacityRef.current) * lerp;
    edgeOpacityRef.current += (targetEdgeOpacity - edgeOpacityRef.current) * lerp;

    const time = state.clock.elapsedTime + phase;
    const distance = fieldState.cameraZ - position[2];
    const fade =
      smoothstep(FADE_NEAR_START, FADE_NEAR_END, distance) *
      smoothstep(FADE_FAR_START, FADE_FAR_END, distance);

    const popupCycle = ((time % POPUP_PERIOD_SECONDS) + POPUP_PERIOD_SECONDS) % POPUP_PERIOD_SECONDS;
    const popupOpen = behavior !== 'popup' || popupCycle < POPUP_PERIOD_SECONDS * POPUP_OPEN_SHARE;
    const popupScale = behavior === 'popup' && popupCycle < 0.12 ? 0.4 : 1;

    group.visible = fade > 0.01 && popupOpen;
    if (!group.visible) return;

    group.scale.set(scaleRef.current, scaleRef.current * popupScale, scaleRef.current);

    const blink =
      behavior === 'flicker' && Math.sin(time * 1.3) * Math.sin(time * 2.7) > 0.86 ? 2.6 : 1;

    bodyMatRef.current.opacity = bodyOpacityRef.current * fade * blink;
    edgeMatRef.current.opacity = Math.min(edgeOpacityRef.current * blink, 1) * fade;
    const titleMaterial = titleRef.current?.material;
    if (titleMaterial) titleMaterial.opacity = (isDecorative ? decorativeTitleOpacity : 1) * fade;

    if (!active) edgeMatRef.current.color.lerp(fieldState.edge, lerp);
    if (accentTitle && !titleTexture) titleMaterial?.color.lerp(fieldState.title, lerp);

    if (progressRef.current) {
      const fill = Math.ceil(((time * 0.12) % 1) * PROGRESS_STEPS) / PROGRESS_STEPS;
      progressRef.current.scale.x = Math.max(fill, 0.01);
      progressRef.current.material.opacity = 0.5 * fade;
    }
  });

  const zFront = DEPTH / 2 + 0.001;
  const titleY = bodyH / 2;
  const bodyY = -TITLE_BAR_HEIGHT / 2;

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh ref={titleRef} geometry={titleGeo} position={[0, titleY, zFront]} material={titleMat} />
      <mesh geometry={bodyGeo} position={[0, bodyY, zFront]} material={bodyMatRef.current} />
      <lineSegments geometry={edgesGeo} material={edgeMatRef.current} />
      {behavior === 'progress' && (
        <mesh
          ref={progressRef}
          geometry={progressGeo}
          position={[-bodyW * 0.4, bodyY, zFront + 0.001]}
        >
          <meshBasicMaterial
            color={WEBGL_PALETTE.blue}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
