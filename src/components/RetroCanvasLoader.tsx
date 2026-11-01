'use client';

import dynamic from 'next/dynamic';
import { useDeferred3D } from '@/hooks/useDeferred3D';

const PLACEHOLDER_CLASS =
  'aspect-video box-border w-full min-h-[12rem] block border-[10px] border-[#F4F3ED]';

const RetroCanvas = dynamic(() => import('@/components/webgl/scene3d').then((m) => m.RetroCanvas), {
  ssr: false,
  loading: () => <div className={PLACEHOLDER_CLASS} />,
});

export default function RetroCanvasLoader() {
  return useDeferred3D() ? <RetroCanvas /> : <div className={PLACEHOLDER_CLASS} />;
}
