'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useDeferred3D } from '@/hooks/useDeferred3D';
import { playRetroClick } from '@/lib/retroClick';

const ProfileVoxelView = dynamic(
  () => import('@/components/webgl/scene3d').then((m) => m.ProfileVoxelView),
  { ssr: false }
);

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
  const show3D = useDeferred3D();

  const toggle = useCallback(() => {
    playRetroClick();
    setShowBoar((prev) => !prev);
  }, []);

  return (
    <div className="relative aspect-square w-full">
      {/* Only mounted while visible: behind the photo it would still draw every voxel. */}
      {show3D && showBoar && <ProfileVoxelView />}

      <button
        type="button"
        onClick={toggle}
        aria-pressed={showBoar}
        aria-label={showBoar ? toggleToPhotoAria : toggleToBoarAria}
        data-boar-react="cousin"
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
