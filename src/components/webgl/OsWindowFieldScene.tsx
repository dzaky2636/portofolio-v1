'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useSyncExternalStore } from 'react';
import OsWindowFrame from '@/components/webgl/OsWindowFrame';
import {
  OS_WINDOW_LAYOUT,
  OS_WINDOW_TITLES,
  generateDecorativeWindows,
  getWindowWorldPosition,
} from '@/components/webgl/osWindowLayout';
import {
  getActiveSection,
  subscribeActiveSection,
} from '@/lib/activeSectionStore';
import { MAIN_SECTION_IDS, type MainSectionId } from '@/lib/sectionIds';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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
  const scrollRef = useRef(0);
  const targetRef = useRef({ mx: 0, my: 0, scroll: 0 });
  const lookAtRef = useRef(new THREE.Vector3(0, 1.5, -12));

  useFrame((_, delta) => {
    const cam = backgroundCamRef.current;
    if (!cam) return;

    const lerp = 1 - Math.exp(-delta * 3);
    targetRef.current.mx += (mouseRef.current.x - targetRef.current.mx) * lerp;
    targetRef.current.my += (mouseRef.current.y - targetRef.current.my) * lerp;
    targetRef.current.scroll += (scrollRef.current - targetRef.current.scroll) * lerp;

    const s = targetRef.current.scroll;
    const scrollT = Math.min(1, s / 5000);

    cam.position.x = targetRef.current.mx * 0.6;
    cam.position.y = targetRef.current.my * 0.35 + 1;
    cam.position.z = 8 + scrollT * 20;

    const sectionId = MAIN_SECTION_IDS.includes(activeSection as MainSectionId)
      ? (activeSection as MainSectionId)
      : 'profile';
    const focus = getWindowWorldPosition(sectionId);
    const desiredLook = new THREE.Vector3(focus.x * 0.35, focus.y * 0.5 + 1, focus.z + 6);
    lookAtRef.current.lerp(desiredLook, lerp);
    cam.lookAt(lookAtRef.current);
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('scroll', handleScroll);
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

  return (
    <>
      {decorative.map((win) => (
        <OsWindowFrame
          key={win.id}
          kind="decorative"
          title={win.title}
          active={false}
          accentTitle={win.accentTitle}
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
      <PerspectiveCamera ref={backgroundCamRef} position={[0, 1, 8]} fov={78} />
      <ParallaxCamera backgroundCamRef={backgroundCamRef} activeSection={activeSection} />
      <WindowField compact={compact} />
      <BackgroundRenderPass backgroundCamRef={backgroundCamRef} />
    </>
  );
}
