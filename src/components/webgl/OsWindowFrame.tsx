'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fieldState } from '@/components/webgl/fieldState';
import type { WindowBehavior } from '@/components/webgl/osWindowLayout';
import { WEBGL_PALETTE } from '@/components/webgl/palette';
import {
  getContentUvScale,
  getWindowContentTexture,
  type WindowContent,
} from '@/components/webgl/windowContent';

const TITLE_BAR_HEIGHT = 0.22;
const DEPTH = 0.06;
const BORDER = 0.04;
const CONTROL_SIZE = 0.13;
const CONTROL_GAP = 0.04;
const SCROLLBAR_WIDTH = 0.14;
const SHADOW_OFFSET = 0.12;
const SHADOW_SHARE = 0.6;
const ACTIVE_SCALE = 1.25;
const FADE_NEAR_START = 1.5;
const FADE_NEAR_END = 6;
const FADE_FAR_START = 30;
const FADE_FAR_END = 14;
const PROGRESS_STEPS = 10;
const POPUP_PERIOD_SECONDS = 9;
const POPUP_OPEN_SHARE = 0.72;

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function createTitleTexture(title: string, active: boolean, accent: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = active ? WEBGL_PALETTE.blue : accent ? WEBGL_PALETTE.yellow : WEBGL_PALETTE.paper;
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

/** Title bar buttons, title rule and scrollbar as line pairs, drawn with the frame's edges. */
function buildChromeSegments(bodyW: number, bodyH: number): number[] {
  const z = DEPTH / 2 + 0.003;
  const segments: number[] = [];
  const line = (x0: number, y0: number, x1: number, y1: number) => {
    segments.push(x0, y0, z, x1, y1, z);
  };
  const box = (x0: number, y0: number, x1: number, y1: number) => {
    line(x0, y0, x1, y0);
    line(x1, y0, x1, y1);
    line(x1, y1, x0, y1);
    line(x0, y1, x0, y0);
  };

  const right = bodyW / 2;
  const left = -right;
  const titleBottom = bodyH / 2 - TITLE_BAR_HEIGHT / 2;
  const bodyBottom = -bodyH / 2 - TITLE_BAR_HEIGHT / 2;

  line(left, titleBottom, right, titleBottom);

  const controlY = bodyH / 2 - CONTROL_SIZE / 2;
  for (let index = 0; index < 3; index += 1) {
    const x1 = right - CONTROL_GAP - index * (CONTROL_SIZE + CONTROL_GAP);
    const x0 = x1 - CONTROL_SIZE;
    box(x0, controlY, x1, controlY + CONTROL_SIZE);
    if (index === 0) {
      line(x0, controlY, x1, controlY + CONTROL_SIZE);
      line(x0, controlY + CONTROL_SIZE, x1, controlY);
    }
  }

  const trackLeft = right - SCROLLBAR_WIDTH;
  const thumbTop = titleBottom - bodyH * 0.12;
  line(trackLeft, titleBottom, trackLeft, bodyBottom);
  box(trackLeft, thumbTop - bodyH * 0.3, right, thumbTop);

  return segments;
}

export type OsWindowFrameKind = 'chapter' | 'satellite' | 'decorative';

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
  content?: WindowContent;
  /** False fades the window out, for satellites whose section is not active. */
  present?: boolean;
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
  content = 'text',
  present = true,
}: OsWindowFrameProps) {
  const isDecorative = kind === 'decorative';
  const hasTitleText = !isDecorative || behavior === 'labelled';
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);
  const presenceRef = useRef(present ? 1 : 0);
  const bodyOpacityRef = useRef(0.07);
  const edgeOpacityRef = useRef(0.32);

  const [width, height] = size;
  const scaleMul = compact ? 0.85 : 1;
  const bodyW = width * scaleMul;
  const bodyH = height * scaleMul;

  const { shellGeo, titleGeo, bodyGeo, edgesGeo, titleTexture, progressGeo, shadowGeo } = useMemo(() => {
    const shell = new THREE.BoxGeometry(bodyW + BORDER * 2, bodyH + TITLE_BAR_HEIGHT + BORDER * 2, DEPTH);
    const titlePlane = new THREE.PlaneGeometry(bodyW, TITLE_BAR_HEIGHT);
    const bodyPlane = new THREE.PlaneGeometry(bodyW, bodyH);
    const [uScale, vScale] = getContentUvScale(bodyW, bodyH);
    const uv = bodyPlane.attributes.uv;
    for (let index = 0; index < uv.count; index += 1) {
      // Anchored to the top-left corner, where the menu bar sits.
      uv.setXY(index, uv.getX(index) * uScale, 1 - (1 - uv.getY(index)) * vScale);
    }
    const shellEdges = new THREE.EdgesGeometry(shell, 1);
    const edges = new THREE.BufferGeometry();
    edges.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [...shellEdges.attributes.position.array, ...buildChromeSegments(bodyW, bodyH)],
        3
      )
    );
    shellEdges.dispose();
    const shadow = new THREE.PlaneGeometry(bodyW + BORDER * 2, bodyH + TITLE_BAR_HEIGHT + BORDER * 2);
    const tex = hasTitleText ? createTitleTexture(title, active, accentTitle) : null;
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
      shadowGeo: shadow,
    };
  }, [bodyW, bodyH, title, active, accentTitle, hasTitleText]);

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
      shadowGeo.dispose();
      titleMat.dispose();
    };
  }, [titleTexture, shellGeo, titleGeo, bodyGeo, edgesGeo, progressGeo, shadowGeo, titleMat]);

  const bodyMatRef = useRef(
    new THREE.MeshBasicMaterial({
      // Filler and compact stay plain line art: low-opacity content smudges and fights page text.
      map: isDecorative || compact ? null : getWindowContentTexture(content),
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
  const shadowRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);

  const targetScale = active ? ACTIVE_SCALE : 1;
  const targetBodyOpacity = active
    ? compact
      ? 0.24
      : 1
    : isDecorative
      ? compact
        ? 0.2
        : 0.4
      : kind === 'satellite'
        ? compact
          ? 0.16
          : 0.9
        : compact
          ? 0.14
          : 0.35;
  const decorativeEdgeOpacity = compact ? 0.14 : 0.32;
  const decorativeTitleOpacity = compact ? 0.3 : 0.6;
  const activeEdgeOpacity = compact ? 0.5 : 0.9;
  const restingEdgeOpacity = compact ? 0.3 : kind === 'satellite' ? 0.75 : 0.4;
  const targetEdgeOpacity = active
    ? activeEdgeOpacity
    : isDecorative
      ? decorativeEdgeOpacity
      : restingEdgeOpacity;

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const lerp = 1 - Math.exp(-delta * 8);
    scaleRef.current += (targetScale - scaleRef.current) * lerp;
    bodyOpacityRef.current += (targetBodyOpacity - bodyOpacityRef.current) * lerp;
    edgeOpacityRef.current += (targetEdgeOpacity - edgeOpacityRef.current) * lerp;
    presenceRef.current += ((present ? 1 : 0) - presenceRef.current) * lerp;

    const time = state.clock.elapsedTime + phase;
    const distance = fieldState.cameraZ - position[2];
    const fade =
      presenceRef.current *
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

    bodyMatRef.current.opacity = Math.min(bodyOpacityRef.current * blink, 1) * fade;
    if (shadowRef.current) shadowRef.current.material.opacity = bodyOpacityRef.current * SHADOW_SHARE * fade;
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
      {!isDecorative && (
        <mesh ref={shadowRef} geometry={shadowGeo} position={[SHADOW_OFFSET, -SHADOW_OFFSET, -DEPTH]}>
          <meshBasicMaterial
            color={WEBGL_PALETTE.ink}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
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
