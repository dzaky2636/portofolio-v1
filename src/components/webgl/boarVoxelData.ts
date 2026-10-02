/** Pixel rects from /public/boar.svg (crisp boar, no outer icon chrome). */
const BOAR_RECTS: { x: number; y: number; w: number; h: number; color: string }[] = [
  { x: 4, y: 4, w: 8, h: 8, color: '#5c4433' },
  { x: 12, y: 8, w: 8, h: 8, color: '#6b4f35' },
  { x: 52, y: 4, w: 8, h: 8, color: '#5c4433' },
  { x: 44, y: 8, w: 8, h: 8, color: '#6b4f35' },
  { x: 12, y: 16, w: 40, h: 8, color: '#5c4433' },
  { x: 8, y: 24, w: 48, h: 8, color: '#4a3728' },
  { x: 16, y: 32, w: 6, h: 6, color: '#ff3333' },
  { x: 42, y: 32, w: 6, h: 6, color: '#ff3333' },
  { x: 8, y: 32, w: 8, h: 8, color: '#5c4433' },
  { x: 22, y: 32, w: 20, h: 8, color: '#6b4f35' },
  { x: 48, y: 32, w: 8, h: 8, color: '#5c4433' },
  { x: 12, y: 40, w: 40, h: 8, color: '#4a3728' },
  { x: 16, y: 48, w: 32, h: 8, color: '#3d2e20' },
  { x: 20, y: 50, w: 6, h: 4, color: '#1a120a' },
  { x: 38, y: 50, w: 6, h: 4, color: '#1a120a' },
  { x: 16, y: 56, w: 6, h: 6, color: '#f5f0e0' },
  { x: 42, y: 56, w: 6, h: 6, color: '#f5f0e0' },
];

const STEP = 2;
const DEPTH_LAYERS = 2;

export interface BoarVoxel {
  x: number;
  y: number;
  z: number;
  color: string;
}

function buildVoxels(): BoarVoxel[] {
  const seen = new Set<string>();
  const voxels: BoarVoxel[] = [];

  for (const rect of BOAR_RECTS) {
    for (let py = rect.y; py < rect.y + rect.h; py += STEP) {
      for (let px = rect.x; px < rect.x + rect.w; px += STEP) {
        for (let layer = 0; layer < DEPTH_LAYERS; layer++) {
          const key = `${px},${py},${layer}`;
          if (seen.has(key)) continue;
          seen.add(key);
          voxels.push({
            x: px,
            y: py,
            z: layer,
            color: rect.color,
          });
        }
      }
    }
  }

  return voxels;
}

export const BOAR_VOXELS = buildVoxels();

/** Map SVG pixel coords to centered world units (Y up). */
export function voxelToWorld(v: BoarVoxel, scale = 0.085): [number, number, number] {
  const cx = 32;
  const cy = 32;
  return [(v.x - cx) * scale, (cy - v.y) * scale, -v.z * scale * 0.9];
}
