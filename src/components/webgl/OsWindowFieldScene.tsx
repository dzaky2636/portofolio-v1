'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useSyncExternalStore } from 'react';
import FieldRoom from '@/components/webgl/FieldRoom';
import OsWindowFrame from '@/components/webgl/OsWindowFrame';
import { fieldState } from '@/components/webgl/fieldState';
import {
  OS_WINDOW_CONTENT,
  OS_WINDOW_LAYOUT,
  OS_WINDOW_TITLES,
  SECTION_CAMERA_Z,
  SECTION_COLORS,
  generateDecorativeWindows,
  getWindowWorldPosition,
} from '@/components/webgl/osWindowLayout';
import {
  getActiveSection,
  subscribeActiveSection,
} from '@/lib/activeSectionStore';
import { MAIN_SECTION_IDS, type MainSectionId } from '@/lib/sectionIds';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/** Position along the sections: 0 at the first, 1 at the second, 1.5 halfway to the third. */
function readSectionProgress() {
  const anchor = window.scrollY + window.innerHeight * 0.3;
  const tops = MAIN_SECTION_IDS.map((id) => {
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });

  for (let index = tops.length - 1; index > 0; index -= 1) {
    if (anchor >= tops[index]) {
      const next = tops[index + 1];
      if (next === undefined) return index;
      return index + (anchor - tops[index]) / (next - tops[index]);
    }
  }
  return tops[1] > 0 ? Math.max(0, anchor / tops[1]) : 0;
}

function cameraZAt(progress: number) {
  const index = Math.min(Math.floor(progress), SECTION_CAMERA_Z.length - 1);
  const from = SECTION_CAMERA_Z[index];
  const to = SECTION_CAMERA_Z[Math.min(index + 1, SECTION_CAMERA_Z.length - 1)];
  return from + (to - from) * (progress - index);
}

function BackgroundRenderPass({
  backgroundCamRef,
}: {
  backgroundCamRef: RefObject<THREE.PerspectiveCamera | null>;
}) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const size = useThree((s) => s.size);

  useFrame(() => {
    const cam = backgroundCamRef.current;
    if (!cam) return;

    cam.aspect = size.width / size.height;
    cam.updateProjectionMatrix();

    const prevAutoClear = gl.autoClear;
    gl.autoClear = true;
    gl.setScissorTest(false);
    gl.setViewport(0, 0, size.width, size.height);
    gl.clear(true, true);
    gl.render(scene, cam);
    gl.autoClear = prevAutoClear;
  }, 0);

  return null;
}

function ParallaxCamera({
  backgroundCamRef,
  activeSection,
}: {
  backgroundCamRef: RefObject<THREE.PerspectiveCamera | null>;
  activeSection: string;
}) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const progressRef = useRef(0);
  const targetRef = useRef({ mx: 0, my: 0, progress: 0 });
  const edgeColorRef = useRef(new THREE.Color());
  const titleColorRef = useRef(new THREE.Color());
  const lookAtRef = useRef(new THREE.Vector3(0, 1.5, -12));

  useFrame((state, delta) => {
    const cam = backgroundCamRef.current;
    if (!cam) return;

    const lerp = 1 - Math.exp(-delta * 3);
    targetRef.current.mx += (mouseRef.current.x - targetRef.current.mx) * lerp;
    targetRef.current.my += (mouseRef.current.y - targetRef.current.my) * lerp;
    targetRef.current.progress += (progressRef.current - targetRef.current.progress) * lerp;

    const time = state.clock.elapsedTime;
    const progress = targetRef.current.progress;

    cam.position.x = targetRef.current.mx * 0.6 + Math.sin(progress * 1.4) * 0.5;
    cam.position.y = targetRef.current.my * 0.35 + 1 + Math.sin(time * 0.3) * 0.08;
    cam.position.z = cameraZAt(progress);
    fieldState.cameraZ = cam.position.z;

    const sectionId = MAIN_SECTION_IDS.includes(activeSection as MainSectionId)
      ? (activeSection as MainSectionId)
      : 'profile';
    const colors = SECTION_COLORS[sectionId];
    fieldState.edge.lerp(edgeColorRef.current.set(colors.edge), lerp);
    fieldState.title.lerp(titleColorRef.current.set(colors.title), lerp);

    const focus = getWindowWorldPosition(sectionId);
    const desiredLook = new THREE.Vector3(focus.x * 0.35, focus.y * 0.5 + 1, focus.z + 6);
    lookAtRef.current.lerp(desiredLook, lerp);
    cam.lookAt(lookAtRef.current);
    cam.rotateZ(Math.sin(progress * 1.4) * 0.025);
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const handleScroll = () => {
      progressRef.current = readSectionProgress();
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return null;
}

function WindowField({ compact }: { compact: boolean }) {
  const activeSection = useSyncExternalStore(
    subscribeActiveSection,
    getActiveSection,
    () => 'profile'
  );

  const decorative = useMemo(() => generateDecorativeWindows(compact), [compact]);

  const anchors = useMemo(
    () =>
      [...decorative, ...MAIN_SECTION_IDS.map((id) => OS_WINDOW_LAYOUT[id])].map(
        ({ position: [x, y, z], size: [, height] }): [number, number, number] => [
          x,
          y - height * 0.45,
          z,
        ]
      ),
    [decorative]
  );

  return (
    <>
      <FieldRoom anchors={anchors} compact={compact} />
      {decorative.map((win) => (
        <OsWindowFrame
          key={win.id}
          kind="decorative"
          title={win.title}
          active={false}
          accentTitle={win.accentTitle}
          behavior={win.behavior}
          phase={win.phase}
          content={win.content}
          position={win.position}
          rotation={win.rotation}
          size={win.size}
          compact={compact}
        />
      ))}
      {MAIN_SECTION_IDS.map((sectionId) => {
        const layout = OS_WINDOW_LAYOUT[sectionId];
        return (
          <OsWindowFrame
            key={sectionId}
            kind="chapter"
            title={OS_WINDOW_TITLES[sectionId]}
            content={OS_WINDOW_CONTENT[sectionId]}
            active={activeSection === sectionId}
            position={layout.position}
            rotation={layout.rotation}
            size={layout.size}
            compact={compact}
          />
        );
      })}
    </>
  );
}

export default function OsWindowFieldScene() {
  const backgroundCamRef = useRef<THREE.PerspectiveCamera>(null);
  const compact = useMediaQuery('(max-width: 768px)');
  const activeSection = useSyncExternalStore(
    subscribeActiveSection,
    getActiveSection,
    () => 'profile'
  );

  return (
    <>
      <PerspectiveCamera ref={backgroundCamRef} position={[0, 1, SECTION_CAMERA_Z[0]]} fov={78} />
      <ParallaxCamera backgroundCamRef={backgroundCamRef} activeSection={activeSection} />
      <WindowField compact={compact} />
      <BackgroundRenderPass backgroundCamRef={backgroundCamRef} />
    </>
  );
}
