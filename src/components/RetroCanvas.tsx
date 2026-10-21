'use client';

import { View, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import RenderViewScene from '@/components/webgl/RenderViewScene';
import ViewSceneBackground from '@/components/webgl/ViewSceneBackground';

export default function RetroCanvas() {
  return (
    <View
      className="aspect-video box-border w-full min-h-[12rem] block border-[10px] border-[#F4F3ED] bg-transparent touch-none cursor-grab active:cursor-grabbing pointer-events-auto"
    >
      <ViewSceneBackground />
      <PerspectiveCamera position={[0.1, 0.28, 2.8]} fov={36.5} near={0.1} far={50} />
      <OrbitControls
        target={[0, 0.08, 0]}
        enablePan={false}
        minDistance={2.0}
        maxDistance={5.0}
        minPolarAngle={0.35}
        maxPolarAngle={1.45}
        rotateSpeed={0.65}
        enableDamping={false}
      />
      <group scale={0.95}>
        <RenderViewScene />
      </group>
    </View>
  );
}
