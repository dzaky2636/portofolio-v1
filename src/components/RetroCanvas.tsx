'use client';

import { View, PerspectiveCamera } from '@react-three/drei';
import RetroObject from '@/components/RetroObject';
import ViewSceneBackground from '@/components/webgl/ViewSceneBackground';

export default function RetroCanvas() {
  return (
    <View
      className="aspect-video box-border w-full min-h-[12rem] block border-[10px] border-[#F4F3ED] bg-transparent"
    >
      <ViewSceneBackground />
      <PerspectiveCamera position={[0, 0, 4.6]} fov={42} near={0.1} far={50} />
      <group scale={0.82}>
        <RetroObject />
      </group>
    </View>
  );
}
