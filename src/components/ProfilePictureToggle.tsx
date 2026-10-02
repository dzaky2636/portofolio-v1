'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { View, PerspectiveCamera } from '@react-three/drei';
import VoxelBoar from '@/components/webgl/VoxelBoar';
import ViewSceneBackground from '@/components/webgl/ViewSceneBackground';
import { playRetroClick } from '@/lib/retroClick';

interface ProfilePictureToggleProps {
  alt: string;
  toggleToBoarAria: string;
  toggleToPhotoAria: string;
}

export default function ProfilePictureToggle({
  alt,
  toggleToBoarAria,
  toggleToPhotoAria,
}: ProfilePictureToggleProps) {
  const [showBoar, setShowBoar] = useState(false);

  const toggle = useCallback(() => {
    playRetroClick();
    setShowBoar((prev) => !prev);
  }, []);

  return (
    <div className="relative aspect-square w-full">
      <View
        className="absolute inset-0 box-border block h-full w-full min-h-0 border-[10px] border-[#F4F3ED] bg-transparent"
      >
        <ViewSceneBackground />
        <PerspectiveCamera position={[0, 0, 3.1]} fov={44} near={0.1} far={50} />
        <group scale={0.9}>
          <VoxelBoar />
        </group>
      </View>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={showBoar}
        aria-label={showBoar ? toggleToPhotoAria : toggleToBoarAria}
        className={`absolute inset-0 z-10 border-0 p-0 cursor-pointer pointer-events-auto retro-focus bg-transparent ${
          showBoar ? '' : 'group'
        }`}
      >
        {!showBoar && (
          <Image
            src="/images/profile-pic.jpg"
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 448px"
            className="object-cover grayscale contrast-125 transition-none group-hover:grayscale-0 group-hover:contrast-100 pointer-events-none"
          />
        )}
      </button>
    </div>
  );
}
