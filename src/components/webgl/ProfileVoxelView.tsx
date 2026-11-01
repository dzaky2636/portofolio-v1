'use client';

import { View, PerspectiveCamera } from '@react-three/drei';
import VoxelBoar from '@/components/webgl/VoxelBoar';
import ViewSceneBackground from '@/components/webgl/ViewSceneBackground';

export default function ProfileVoxelView() {
  return (
    <View className="absolute inset-0 box-border block h-full w-full min-h-0 border-[10px] border-[#F4F3ED] bg-transparent">
      <ViewSceneBackground />
      <PerspectiveCamera position={[0, 0, 3.1]} fov={44} near={0.1} far={50} />
      <group scale={0.9}>
        <VoxelBoar />
      </group>
    </View>
  );
}
