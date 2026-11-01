'use client';

import { WEBGL_PALETTE } from '@/components/webgl/palette';

/** Fills the entire drei View scissor with paper (no inset plane). */
export default function ViewSceneBackground() {
  return <color attach="background" args={[WEBGL_PALETTE.paper]} />;
}
