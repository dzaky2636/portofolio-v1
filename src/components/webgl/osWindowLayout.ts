import { WEBGL_PALETTE } from '@/components/webgl/palette';
import type { WindowContent } from '@/components/webgl/windowContent';
import { MAIN_SECTION_IDS, type MainSectionId } from '@/lib/sectionIds';

export const OS_WINDOW_TITLES: Record<MainSectionId, string> = {
  profile: 'PROFILE.SYS',
  inventory: 'INVENTORY.DAT',
  realms: 'REALMS.EXE',
  logs: 'LOG_VIEWER.EXE',
  contact: 'CONTACT.BAT',
};

export const OS_WINDOW_CONTENT: Record<MainSectionId, WindowContent> = {
  profile: 'text',
  inventory: 'table',
  realms: 'folders',
  logs: 'hex',
  contact: 'dialog',
};

export interface OsWindowLayoutEntry {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
}

export const OS_WINDOW_LAYOUT: Record<MainSectionId, OsWindowLayoutEntry> = {
  profile: {
    position: [1.8, 1.5, -10],
    rotation: [0.06, -0.12, -0.03],
    size: [3.2, 2.2],
  },
  inventory: {
    position: [6, 0.5, -15],
    rotation: [-0.05, -0.18, 0.06],
    size: [3.4, 2.4],
  },
  realms: {
    position: [3, 0.5, -20],
    rotation: [0.06, -0.22, 0.03],
    size: [3.8, 2.6],
  },
  logs: {
    position: [5.5, 1.5, -24],
    rotation: [-0.1, -0.28, -0.05],
    size: [3.5, 2.3],
  },
  contact: {
    position: [0, 3, -28],
    rotation: [0.04, 0.1, 0.02],
    size: [3.6, 2.5],
  },
};

export const CAMERA_FOV = 78;

/** Camera depth while each section fills the viewport, in MAIN_SECTION_IDS order. */
export const SECTION_CAMERA_Z = [-1, -9, -14, -18, -22] as const;

/** Where each section's window sits on screen, -1 to 1 from the center, clear of the page content. */
const SECTION_FRAMING: Record<MainSectionId, { x: number; y: number }> = {
  profile: { x: 0.13, y: 0.1 },
  inventory: { x: 0.52, y: 0.3 },
  realms: { x: 0.52, y: 0.3 },
  logs: { x: 0.52, y: 0.3 },
  contact: { x: 0, y: 0.2 },
};

/** Camera x/y that puts a section's window at its framed spot while looking straight ahead. */
export function getCameraStation(
  sectionIndex: number,
  aspect: number,
  compact: boolean
): [number, number] {
  const sectionId = MAIN_SECTION_IDS[sectionIndex];
  const [x, y, z] = OS_WINDOW_LAYOUT[sectionId].position;
  const halfHeight =
    (SECTION_CAMERA_Z[sectionIndex] - z) * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180));
  const framing = SECTION_FRAMING[sectionId];
  return [x - (compact ? 0 : framing.x) * halfHeight * aspect, y - framing.y * halfHeight];
}

/** Line and accent colors the field shifts to per section. */
export const SECTION_COLORS: Record<MainSectionId, { edge: string; title: string }> = {
  profile: { edge: WEBGL_PALETTE.ink, title: WEBGL_PALETTE.yellow },
  inventory: { edge: WEBGL_PALETTE.blue, title: WEBGL_PALETTE.yellow },
  realms: { edge: WEBGL_PALETTE.ink, title: WEBGL_PALETTE.blue },
  logs: { edge: WEBGL_PALETTE.blue, title: WEBGL_PALETTE.blue },
  contact: { edge: WEBGL_PALETTE.ink, title: WEBGL_PALETTE.yellow },
};

export type WindowBehavior = 'still' | 'flicker' | 'progress' | 'popup' | 'labelled';

export interface DecorativeWindowSpec {
  id: string;
  kind: 'satellite' | 'decorative';
  /** Satellites show only while this section is active. */
  section?: MainSectionId;
  title: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  accentTitle: boolean;
  behavior: WindowBehavior;
  phase: number;
  content: WindowContent;
}

interface SatelliteWindow {
  title: string;
  content: WindowContent;
  /** Relative to the section window. */
  offset: [number, number, number];
  size: [number, number];
  accentTitle?: boolean;
  behavior?: WindowBehavior;
}

/**
 * Hand-placed around each section window: a cascade stepping back toward the vanishing point at
 * screen center, plus a small popup on the near corner. Listed in priority order for compact.
 */
const SECTION_SATELLITES: Record<MainSectionId, SatelliteWindow[]> = {
  profile: [
    { title: 'BOOT.INI', content: 'text', offset: [-3.4, 2.6, -1.5], size: [2.6, 1.6] },
    { title: 'SCRNSAVE.SCR', content: 'image', offset: [1.2, 5, -4], size: [2.8, 1.8] },
    {
      title: 'ERROR_404',
      content: 'dialog',
      offset: [-1.2, -1.4, 0.6],
      size: [1.5, 0.95],
      accentTitle: true,
      behavior: 'popup',
    },
  ],
  inventory: [
    { title: 'TASKMGR.COM', content: 'chart', offset: [-3, 0.9, -3], size: [2.8, 1.9] },
    { title: 'NOTEPAD.SYS', content: 'text', offset: [-5.2, 1.6, -7], size: [2.4, 1.6] },
    {
      title: 'UNINST.EXE',
      content: 'dialog',
      offset: [-2.1, -0.9, 0.7],
      size: [1.5, 0.95],
      accentTitle: true,
      behavior: 'popup',
    },
  ],
  realms: [
    { title: 'MEMDUMP.BIN', content: 'hex', offset: [-3, 0.8, -3], size: [2.8, 1.9] },
    { title: 'PRINT.SPL', content: 'image', offset: [-5.4, 1.5, -6.5], size: [2.4, 1.6] },
    {
      title: 'SETUP.MSI',
      content: 'dialog',
      offset: [-2.1, -1, 0.7],
      size: [1.5, 0.95],
      accentTitle: true,
      behavior: 'popup',
    },
  ],
  logs: [
    { title: 'QUEUE.DAT', content: 'table', offset: [-3, 0.6, -3], size: [2.8, 1.9] },
    { title: 'PENDING.UP', content: 'chart', offset: [-5, 1.2, -6], size: [2.4, 1.6] },
    {
      title: 'SYSWARN.LOG',
      content: 'dialog',
      offset: [-2.2, -0.9, 0.7],
      size: [1.5, 0.95],
      accentTitle: true,
      behavior: 'popup',
    },
  ],
  contact: [],
};

const DECORATIVE_TITLES: { title: string; content: WindowContent }[] = [
  { title: 'README.TXT', content: 'text' },
  { title: 'SYSWARN.LOG', content: 'dialog' },
  { title: 'NULL_PTR.DLL', content: 'hex' },
  { title: 'CACHE.DAT', content: 'hex' },
  { title: 'BOOT.INI', content: 'text' },
  { title: 'DRIVER.SYS', content: 'table' },
  { title: 'MEMDUMP.BIN', content: 'hex' },
  { title: 'CLIPBRD.EXE', content: 'image' },
  { title: 'NOTEPAD.SYS', content: 'text' },
  { title: 'TASKMGR.COM', content: 'chart' },
  { title: 'UNINST.EXE', content: 'dialog' },
  { title: 'SETUP.MSI', content: 'folders' },
  { title: 'ERROR_404', content: 'dialog' },
  { title: 'PENDING.UP', content: 'chart' },
  { title: 'QUEUE.DAT', content: 'table' },
  { title: 'AUTH.TOK', content: 'hex' },
  { title: 'SCRNSAVE.SCR', content: 'image' },
  { title: 'DESKTOP.INI', content: 'folders' },
  { title: 'FONTS.DAT', content: 'table' },
  { title: 'PRINT.SPL', content: 'image' },
];

export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distToChapter(x: number, y: number, z: number): number {
  let min = Infinity;
  for (const id of MAIN_SECTION_IDS) {
    const [cx, cy, cz] = OS_WINDOW_LAYOUT[id].position;
    const d = Math.hypot(x - cx, y - cy, z - cz);
    if (d < min) min = d;
  }
  return min;
}

const CORRIDOR_X = 3.4;
const CORRIDOR_X_COMPACT = 1.2;
const CORRIDOR_Y = 2.4;
const SIGHTLINE_RADIUS = 3;
const MIN_WINDOW_SPACING = 2.8;
const QUIET_ZONE_DEPTH = 18;
const WIDE_ASPECT = 1.6;

/** True when a point lands on the text side of the screen at any section's camera station. */
function inQuietZone(x: number, y: number, z: number): boolean {
  return MAIN_SECTION_IDS.some((_, index) => {
    const depth = SECTION_CAMERA_Z[index] - z;
    if (depth <= 0 || depth > QUIET_ZONE_DEPTH) return false;
    const [cameraX, cameraY] = getCameraStation(index, WIDE_ASPECT, false);
    const halfHeight = depth * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180));
    const screenX = (x - cameraX) / (halfHeight * WIDE_ASPECT);
    const screenY = (y - cameraY) / halfHeight;
    return screenX < 0 && screenY > -0.7 && screenY < 0.45;
  });
}

/** True when a point sits between a section's camera station and its window. */
function blocksSightline(x: number, y: number, z: number, compact: boolean): boolean {
  return MAIN_SECTION_IDS.some((id, index) => {
    const [windowX, windowY, windowZ] = OS_WINDOW_LAYOUT[id].position;
    const cameraZ = SECTION_CAMERA_Z[index];
    const along = (z - windowZ) / (cameraZ - windowZ);
    if (along < 0 || along > 1) return false;
    const [cameraX, cameraY] = getCameraStation(index, compact ? 0.5 : WIDE_ASPECT, compact);
    return (
      Math.hypot(x - (windowX + (cameraX - windowX) * along), y - (windowY + (cameraY - windowY) * along)) <
      SIGHTLINE_RADIUS
    );
  });
}

function pickBehavior(roll: number): WindowBehavior {
  if (roll < 0.45) return 'still';
  if (roll < 0.62) return 'flicker';
  if (roll < 0.76) return 'progress';
  if (roll < 0.88) return 'popup';
  return 'labelled';
}

function buildSatellites(compact: boolean, rand: () => number): DecorativeWindowSpec[] {
  return MAIN_SECTION_IDS.flatMap((sectionId) =>
    SECTION_SATELLITES[sectionId].slice(0, compact ? 1 : undefined).map((satellite, index) => {
      const { position, rotation } = OS_WINDOW_LAYOUT[sectionId];
      return {
        id: `satellite-${sectionId}-${index}`,
        kind: 'satellite' as const,
        section: sectionId,
        title: satellite.title,
        position: [
          position[0] + satellite.offset[0],
          position[1] + satellite.offset[1],
          position[2] + satellite.offset[2],
        ] as [number, number, number],
        rotation,
        size: satellite.size,
        accentTitle: satellite.accentTitle ?? false,
        behavior: satellite.behavior ?? 'still',
        phase: rand() * 100,
        content: satellite.content,
      };
    })
  );
}

/** Hand-placed satellites plus a sparse, evenly spaced field of filler the camera flies through. */
export function generateDecorativeWindows(compact: boolean): DecorativeWindowSpec[] {
  const rand = mulberry32(0x0c0c0c);
  const target = compact ? 12 : 24;
  const satellites = buildSatellites(compact, rand);
  const specs: DecorativeWindowSpec[] = [];
  const minChapterGap = compact ? 2.8 : 3.2;

  const xSpan = compact ? 7 : 13;
  const ySpan = compact ? 5 : 5.5;
  const zNear = -6;
  const zFar = compact ? -32 : -38;

  let attempts = 0;
  const maxAttempts = target * 25;

  while (specs.length < target && attempts < maxAttempts) {
    attempts += 1;
    const layer = Math.floor(rand() * 5);
    const z =
      zNear +
      (layer / 4) * (zFar - zNear) +
      rand() * ((zFar - zNear) / 5);
    const x = (rand() - 0.5) * 2 * xSpan;
    const y = (rand() - 0.5) * 2 * ySpan;

    if (distToChapter(x, y, z) < minChapterGap) continue;
    if (blocksSightline(x, y, z, compact)) continue;
    if (!compact && inQuietZone(x, y, z)) continue;
    const crowded = [...satellites, ...specs].some(
      ({ position }) =>
        Math.hypot(x - position[0], y - position[1], z - position[2]) < MIN_WINDOW_SPACING
    );
    if (crowded) continue;
    // Keeps the camera's flight path clear so no window fills the screen behind text.
    const corridorX = compact ? CORRIDOR_X_COMPACT : CORRIDOR_X;
    if (Math.abs(x) < corridorX && Math.abs(y - 1) < CORRIDOR_Y) continue;

    const w = 1.1 + rand() * (compact ? 1.6 : 2.2);
    const h = 0.75 + rand() * (compact ? 1.2 : 1.8);
    const { title, content } = DECORATIVE_TITLES[Math.floor(rand() * DECORATIVE_TITLES.length)];

    specs.push({
      id: `decor-${specs.length}`,
      kind: 'decorative',
      title,
      position: [x, y, z],
      rotation: [
        (rand() - 0.5) * 0.35,
        (rand() - 0.5) * 0.55,
        (rand() - 0.5) * 0.2,
      ],
      size: [w, h],
      accentTitle: rand() > 0.8,
      behavior: pickBehavior(rand()),
      phase: rand() * 100,
      content,
    });
  }

  return [...satellites, ...specs];
}
