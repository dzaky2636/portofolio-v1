'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useSyncExternalStore } from 'react';
import FieldRoom from '@/components/webgl/FieldRoom';
import OsWindowFrame from '@/components/webgl/OsWindowFrame';
import { fieldState } from '@/components/webgl/fieldState';
import {
  CAMERA_FOV,
  OS_WINDOW_CONTENT,
  OS_WINDOW_LAYOUT,
  OS_WINDOW_TITLES,
  SECTION_CAMERA_Z,
  SECTION_COLORS,
  generateDecorativeWindows,
  getCameraStation,
} from '@/components/webgl/osWindowLayout';
import {
  getActiveSection,
  subscribeActiveSection,
} from '@/lib/activeSectionStore';
import { MAIN_SECTION_IDS, type MainSectionId } from '@/lib/sectionIds';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Travel between sections spans this much scroll, in viewports, around each section's top.
const TRAVEL_LEAD_VIEWPORTS = 0.8;
const TRAVEL_TRAIL_VIEWPORTS = 0.1;

const CHAPTER_ANCHORS = MAIN_SECTION_IDS.map((id): [number, number, number] => {
  const { position, size } = OS_WINDOW_LAYOUT[id];
  return [position[0], position[1] - size[1] * 0.45, position[2]];
});

function smootherstep(value: number) {
  const t = Math.min(Math.max(value, 0), 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Reading layout is the slow part, so tops are measured once and only redone when it changes. */
function readSectionTops() {
  return MAIN_SECTION_IDS.slice(1).flatMap((id) => {
    const el = document.getElementById(id);
    return el ? [el.getBoundingClientRect().top + window.scrollY] : [];
  });
}

/**
 * Position along the sections: 0 at the first, 1 at the second. The camera travels over a fixed
 * scroll span at each boundary and holds still between them, so a section's height never changes
 * how fast it moves.
 */
function sectionProgress(tops: number[]) {
  const viewport = window.innerHeight;
  const anchor = window.scrollY + viewport * 0.3;
  return tops.reduce((progress, top) => {
    const start = top - viewport * TRAVEL_LEAD_VIEWPORTS;
    const span = viewport * (TRAVEL_LEAD_VIEWPORTS + TRAVEL_TRAIL_VIEWPORTS);
    return progress + smootherstep((anchor - start) / span);
  }, 0);
}

function mix(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function BackgroundRenderPass({
  backgroundCamRef,
}: {
  backgroundCamRef: RefObject<THREE.PerspectiveCamera | null>;
}) {
  useFrame(({ gl, scene, size }) => {
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
  compact,
}: {
  backgroundCamRef: RefObject<THREE.PerspectiveCamera | null>;
  activeSection: string;
  compact: boolean;
}) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const progressRef = useRef(0);
  const targetRef = useRef({ mx: 0, my: 0, progress: 0 });
  const edgeColorRef = useRef(new THREE.Color());
  const titleColorRef = useRef(new THREE.Color());

  useFrame((state, delta) => {
    const cam = backgroundCamRef.current;
    if (!cam) return;

    const lerp = 1 - Math.exp(-delta * 3);
    targetRef.current.mx += (mouseRef.current.x - targetRef.current.mx) * lerp;
    targetRef.current.my += (mouseRef.current.y - targetRef.current.my) * lerp;
    targetRef.current.progress += (progressRef.current - targetRef.current.progress) * lerp;

    const time = state.clock.elapsedTime;
    const progress = targetRef.current.progress;

    const lastSection = MAIN_SECTION_IDS.length - 1;
    const fromIndex = Math.min(Math.floor(progress), lastSection);
    const toIndex = Math.min(fromIndex + 1, lastSection);
    const travel = progress - fromIndex;
    const [fromX, fromY] = getCameraStation(fromIndex, cam.aspect, compact);
    const [toX, toY] = getCameraStation(toIndex, cam.aspect, compact);

    cam.position.x = mix(fromX, toX, travel) + targetRef.current.mx * 0.3;
    cam.position.y = mix(fromY, toY, travel) + targetRef.current.my * 0.2 + Math.sin(time * 0.3) * 0.08;
    cam.position.z = mix(SECTION_CAMERA_Z[fromIndex], SECTION_CAMERA_Z[toIndex], travel);
    // Looks straight ahead so it can never fly past a target and spin; banks only mid-travel.
    cam.rotation.set(0, 0, Math.sin(progress * Math.PI * 2) * 0.02);
    fieldState.cameraZ = cam.position.z;
    fieldState.progress = progress;

    const sectionId = MAIN_SECTION_IDS.includes(activeSection as MainSectionId)
      ? (activeSection as MainSectionId)
      : 'profile';
    const colors = SECTION_COLORS[sectionId];
    fieldState.edge.lerp(edgeColorRef.current.set(colors.edge), lerp);
    fieldState.title.lerp(titleColorRef.current.set(colors.title), lerp);
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    let tops: number[] = [];
    const handleScroll = () => {
      progressRef.current = sectionProgress(tops);
    };
    const measure = () => {
      tops = readSectionTops();
      handleScroll();
    };
    const layoutObserver = new ResizeObserver(measure);
    layoutObserver.observe(document.body);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', measure);
      layoutObserver.disconnect();
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
      <FieldRoom anchors={CHAPTER_ANCHORS} compact={compact} />
      {decorative.map((win) => (
        <OsWindowFrame
          key={`${win.id}-${compact}`}
          kind={win.kind}
          present={!win.section || win.section === activeSection}
          sectionIndex={win.section ? MAIN_SECTION_IDS.indexOf(win.section) : undefined}
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
      {MAIN_SECTION_IDS.map((sectionId, sectionIndex) => {
        const layout = OS_WINDOW_LAYOUT[sectionId];
        return (
          <OsWindowFrame
            key={`${sectionId}-${compact}`}
            kind="chapter"
            title={OS_WINDOW_TITLES[sectionId]}
            content={OS_WINDOW_CONTENT[sectionId]}
            sectionIndex={sectionIndex}
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
      <PerspectiveCamera ref={backgroundCamRef} position={[0, 1, SECTION_CAMERA_Z[0]]} fov={CAMERA_FOV} />
      <ParallaxCamera backgroundCamRef={backgroundCamRef} activeSection={activeSection} compact={compact} />
      <WindowField compact={compact} />
      <BackgroundRenderPass backgroundCamRef={backgroundCamRef} />
    </>
  );
}
