'use client';

import dynamic from 'next/dynamic';
import { useDeferred3D } from '@/hooks/useDeferred3D';

const WebGLRoot = dynamic(() => import('@/components/webgl/scene3d').then((m) => m.WebGLRoot), {
  ssr: false,
});

export default function WebGLLoader() {
  return useDeferred3D() ? <WebGLRoot /> : null;
}
