'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WEBGL_PALETTE } from '@/components/webgl/palette';

const TITLE_BAR_HEIGHT = 0.22;
const DEPTH = 0.06;
const BORDER = 0.04;

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
}: OsWindowFrameProps) {
  const isDecorative = kind === 'decorative';
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);
  const bodyOpacityRef = useRef(0.07);
  const edgeOpacityRef = useRef(0.32);

  const [width, height] = size;
  const scaleMul = compact ? 0.85 : 1;
  const bodyW = width * scaleMul;
  const bodyH = height * scaleMul;

  const { shellGeo, titleGeo, bodyGeo, edgesGeo, titleTexture } = useMemo(() => {
    const shell = new THREE.BoxGeometry(bodyW + BORDER * 2, bodyH + TITLE_BAR_HEIGHT + BORDER * 2, DEPTH);
    const titlePlane = new THREE.PlaneGeometry(bodyW, TITLE_BAR_HEIGHT);
    const bodyPlane = new THREE.PlaneGeometry(bodyW, bodyH);
    const edges = new THREE.EdgesGeometry(shell, 1);
    const tex = isDecorative ? null : createTitleTexture(title, active);
    return {
      shellGeo: shell,
      titleGeo: titlePlane,
      bodyGeo: bodyPlane,
      edgesGeo: edges,
      titleTexture: tex,
    };
  }, [bodyW, bodyH, title, active, isDecorative]);

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
      titleMat.dispose();
    };
  }, [titleTexture, shellGeo, titleGeo, bodyGeo, edgesGeo, titleMat]);

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
  const targetEdgeOpacity = active ? 0.58 : isDecorative ? 0.3 : 0.38;

  useFrame((_, delta) => {
    const lerp = 1 - Math.exp(-delta * 8);
    scaleRef.current += (targetScale - scaleRef.current) * lerp;
    bodyOpacityRef.current += (targetBodyOpacity - bodyOpacityRef.current) * lerp;
    edgeOpacityRef.current += (targetEdgeOpacity - edgeOpacityRef.current) * lerp;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleRef.current);
    }
    bodyMatRef.current.opacity = bodyOpacityRef.current;
    edgeMatRef.current.opacity = edgeOpacityRef.current;
  });

  const zFront = DEPTH / 2 + 0.001;
  const titleY = bodyH / 2;
  const bodyY = -TITLE_BAR_HEIGHT / 2;

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh geometry={titleGeo} position={[0, titleY, zFront]} material={titleMat} />
      <mesh geometry={bodyGeo} position={[0, bodyY, zFront]} material={bodyMatRef.current} />
      <lineSegments geometry={edgesGeo} material={edgeMatRef.current} />
    </group>
  );
}
