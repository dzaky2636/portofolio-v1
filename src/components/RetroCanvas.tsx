'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { View, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import RenderViewScene from '@/components/webgl/RenderViewScene';
import ViewSceneBackground from '@/components/webgl/ViewSceneBackground';
import { SCREEN_MODES } from '@/components/webgl/screenDisplay';
import { playRetroClick } from '@/lib/retroClick';

const CLICK_TOLERANCE_PX = 6;

export default function RetroCanvas() {
  const [modeIndex, setModeIndex] = useState(0);
  const pressRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pressRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const moved = Math.hypot(
      event.clientX - pressRef.current.x,
      event.clientY - pressRef.current.y
    );
    if (moved > CLICK_TOLERANCE_PX) return;
    playRetroClick();
    setModeIndex((index) => (index + 1) % SCREEN_MODES.length);
  };

  return (
    <div onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <View
        className="aspect-video box-border w-full min-h-[12rem] block border-[10px] border-[#F4F3ED] bg-transparent touch-none cursor-grab active:cursor-grabbing pointer-events-auto"
      >
        <ViewSceneBackground />
        <PerspectiveCamera makeDefault position={[0.1, 0.34, 3.3]} fov={36.5} near={0.1} far={50} />
        <OrbitControls
          target={[0, -0.02, 0]}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={0.35}
          maxPolarAngle={1.45}
          rotateSpeed={0.65}
          enableDamping={false}
        />
        <group scale={0.95}>
          <RenderViewScene mode={SCREEN_MODES[modeIndex]} />
        </group>
      </View>
    </div>
  );
}
