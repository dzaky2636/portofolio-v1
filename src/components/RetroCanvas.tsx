'use client';

import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';

const RetroObject = dynamic(() => import('@/components/RetroObject'), {
  ssr: false,
});

export default function RetroCanvas() {
  return (
    <div className="aspect-video bg-[#F4F3ED]">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <RetroObject />
      </Canvas>
    </div>
  );
}
