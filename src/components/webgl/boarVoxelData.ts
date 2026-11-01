/** Pixel rects from /public/boar.svg at 4 units per pixel, without the blue background. */
const BOAR_RECTS: { x: number; y: number; w: number; h: number; color: string }[] = [
  { x: 28, y: 0, w: 8, h: 4, color: '#0C0C0C' },
  { x: 8, y: 4, w: 8, h: 4, color: '#0C0C0C' },
  { x: 24, y: 4, w: 4, h: 4, color: '#0C0C0C' },
  { x: 28, y: 4, w: 8, h: 4, color: '#4A3728' },
  { x: 36, y: 4, w: 4, h: 4, color: '#0C0C0C' },
  { x: 48, y: 4, w: 8, h: 4, color: '#0C0C0C' },
  { x: 4, y: 8, w: 4, h: 4, color: '#0C0C0C' },
  { x: 8, y: 8, w: 8, h: 4, color: '#4A3728' },
  { x: 16, y: 8, w: 8, h: 4, color: '#0C0C0C' },
  { x: 24, y: 8, w: 4, h: 4, color: '#4A3728' },
  { x: 28, y: 8, w: 8, h: 4, color: '#6B4F35' },
  { x: 36, y: 8, w: 4, h: 4, color: '#4A3728' },
  { x: 40, y: 8, w: 8, h: 4, color: '#0C0C0C' },
  { x: 48, y: 8, w: 8, h: 4, color: '#4A3728' },
  { x: 56, y: 8, w: 4, h: 4, color: '#0C0C0C' },
  { x: 4, y: 12, w: 4, h: 4, color: '#0C0C0C' },
  { x: 8, y: 12, w: 4, h: 4, color: '#4A3728' },
  { x: 12, y: 12, w: 4, h: 4, color: '#6B4F35' },
  { x: 16, y: 12, w: 8, h: 4, color: '#4A3728' },
  { x: 24, y: 12, w: 16, h: 4, color: '#6B4F35' },
  { x: 40, y: 12, w: 8, h: 4, color: '#4A3728' },
  { x: 48, y: 12, w: 4, h: 4, color: '#6B4F35' },
  { x: 52, y: 12, w: 4, h: 4, color: '#4A3728' },
  { x: 56, y: 12, w: 4, h: 4, color: '#0C0C0C' },
  { x: 8, y: 16, w: 4, h: 4, color: '#0C0C0C' },
  { x: 12, y: 16, w: 4, h: 4, color: '#4A3728' },
  { x: 16, y: 16, w: 32, h: 4, color: '#6B4F35' },
  { x: 48, y: 16, w: 4, h: 4, color: '#4A3728' },
  { x: 52, y: 16, w: 4, h: 4, color: '#0C0C0C' },
  { x: 8, y: 20, w: 4, h: 4, color: '#0C0C0C' },
  { x: 12, y: 20, w: 40, h: 4, color: '#6B4F35' },
  { x: 52, y: 20, w: 4, h: 4, color: '#0C0C0C' },
  { x: 4, y: 24, w: 4, h: 4, color: '#0C0C0C' },
  { x: 8, y: 24, w: 4, h: 4, color: '#4A3728' },
  { x: 12, y: 24, w: 4, h: 4, color: '#6B4F35' },
  { x: 16, y: 24, w: 8, h: 4, color: '#FF3333' },
  { x: 24, y: 24, w: 16, h: 4, color: '#6B4F35' },
  { x: 40, y: 24, w: 8, h: 4, color: '#FF3333' },
  { x: 48, y: 24, w: 4, h: 4, color: '#6B4F35' },
  { x: 52, y: 24, w: 4, h: 4, color: '#4A3728' },
  { x: 56, y: 24, w: 4, h: 4, color: '#0C0C0C' },
  { x: 4, y: 28, w: 4, h: 4, color: '#0C0C0C' },
  { x: 8, y: 28, w: 4, h: 4, color: '#4A3728' },
  { x: 12, y: 28, w: 4, h: 4, color: '#6B4F35' },
  { x: 16, y: 28, w: 4, h: 4, color: '#FF3333' },
  { x: 20, y: 28, w: 4, h: 4, color: '#0C0C0C' },
  { x: 24, y: 28, w: 16, h: 4, color: '#6B4F35' },
  { x: 40, y: 28, w: 4, h: 4, color: '#0C0C0C' },
  { x: 44, y: 28, w: 4, h: 4, color: '#FF3333' },
  { x: 48, y: 28, w: 4, h: 4, color: '#6B4F35' },
  { x: 52, y: 28, w: 4, h: 4, color: '#4A3728' },
  { x: 56, y: 28, w: 4, h: 4, color: '#0C0C0C' },
  { x: 4, y: 32, w: 4, h: 4, color: '#0C0C0C' },
  { x: 8, y: 32, w: 8, h: 4, color: '#4A3728' },
  { x: 16, y: 32, w: 32, h: 4, color: '#6B4F35' },
  { x: 48, y: 32, w: 8, h: 4, color: '#4A3728' },
  { x: 56, y: 32, w: 4, h: 4, color: '#0C0C0C' },
  { x: 8, y: 36, w: 4, h: 4, color: '#0C0C0C' },
  { x: 12, y: 36, w: 4, h: 4, color: '#4A3728' },
  { x: 16, y: 36, w: 4, h: 4, color: '#6B4F35' },
  { x: 20, y: 36, w: 24, h: 4, color: '#8A6A48' },
  { x: 44, y: 36, w: 4, h: 4, color: '#6B4F35' },
  { x: 48, y: 36, w: 4, h: 4, color: '#4A3728' },
  { x: 52, y: 36, w: 4, h: 4, color: '#0C0C0C' },
  { x: 4, y: 40, w: 4, h: 4, color: '#F5F0E0' },
  { x: 8, y: 40, w: 4, h: 4, color: '#0C0C0C' },
  { x: 12, y: 40, w: 4, h: 4, color: '#4A3728' },
  { x: 16, y: 40, w: 4, h: 4, color: '#8A6A48' },
  { x: 20, y: 40, w: 24, h: 4, color: '#C49A6C' },
  { x: 44, y: 40, w: 4, h: 4, color: '#8A6A48' },
  { x: 48, y: 40, w: 4, h: 4, color: '#4A3728' },
  { x: 52, y: 40, w: 4, h: 4, color: '#0C0C0C' },
  { x: 56, y: 40, w: 4, h: 4, color: '#F5F0E0' },
  { x: 4, y: 44, w: 4, h: 4, color: '#F5F0E0' },
  { x: 8, y: 44, w: 4, h: 4, color: '#0C0C0C' },
  { x: 12, y: 44, w: 4, h: 4, color: '#4A3728' },
  { x: 16, y: 44, w: 4, h: 4, color: '#C49A6C' },
  { x: 20, y: 44, w: 4, h: 4, color: '#1A120A' },
  { x: 24, y: 44, w: 16, h: 4, color: '#C49A6C' },
  { x: 40, y: 44, w: 4, h: 4, color: '#1A120A' },
  { x: 44, y: 44, w: 4, h: 4, color: '#C49A6C' },
  { x: 48, y: 44, w: 4, h: 4, color: '#4A3728' },
  { x: 52, y: 44, w: 4, h: 4, color: '#0C0C0C' },
  { x: 56, y: 44, w: 4, h: 4, color: '#F5F0E0' },
  { x: 4, y: 48, w: 8, h: 4, color: '#F5F0E0' },
  { x: 12, y: 48, w: 4, h: 4, color: '#0C0C0C' },
  { x: 16, y: 48, w: 32, h: 4, color: '#C49A6C' },
  { x: 48, y: 48, w: 4, h: 4, color: '#0C0C0C' },
  { x: 52, y: 48, w: 8, h: 4, color: '#F5F0E0' },
  { x: 8, y: 52, w: 4, h: 4, color: '#F5F0E0' },
  { x: 12, y: 52, w: 8, h: 4, color: '#0C0C0C' },
  { x: 20, y: 52, w: 24, h: 4, color: '#C49A6C' },
  { x: 44, y: 52, w: 8, h: 4, color: '#0C0C0C' },
  { x: 52, y: 52, w: 4, h: 4, color: '#F5F0E0' },
  { x: 20, y: 56, w: 24, h: 4, color: '#0C0C0C' },
];

const STEP = 4;
const DEPTH_LAYERS = 1;

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
