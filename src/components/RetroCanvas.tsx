'use client';

import { View, PerspectiveCamera } from '@react-three/drei';
import RetroObject from '@/components/RetroObject';

export default function RetroCanvas() {
  return (
    <View className="aspect-video bg-[#F4F3ED] w-full">
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
      <RetroObject />
    </View>
  );
}
