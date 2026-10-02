import * as THREE from 'three';
import { MAIN_SECTION_IDS, type MainSectionId } from '@/lib/sectionIds';

export const OS_WINDOW_TITLES: Record<MainSectionId, string> = {
  profile: 'PROFILE.SYS',
  inventory: 'INVENTORY.DAT',
  realms: 'REALMS.EXE',
  logs: 'LOG_VIEWER.EXE',
  contact: 'CONTACT.BAT',
};

export interface OsWindowLayoutEntry {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
}

export const OS_WINDOW_LAYOUT: Record<MainSectionId, OsWindowLayoutEntry> = {
  profile: {
    position: [-5.5, 2.5, -10],
    rotation: [0.08, 0.22, -0.04],
    size: [3.2, 2.2],
  },
  inventory: {
    position: [6, 0.5, -15],
    rotation: [-0.05, -0.18, 0.06],
    size: [3.4, 2.4],
  },
  realms: {
    position: [-4, -1, -20],
    rotation: [0.12, 0.35, 0],
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

export function getWindowWorldPosition(sectionId: MainSectionId): THREE.Vector3 {
  const { position } = OS_WINDOW_LAYOUT[sectionId];
  return new THREE.Vector3(position[0], position[1], position[2]);
}

export interface DecorativeWindowSpec {
  id: string;
  title: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  accentTitle: boolean;
}

const DECORATIVE_TITLES = [
  'README.TXT',
  'SYSWARN.LOG',
  'NULL_PTR.DLL',
  'CACHE.DAT',
  'BOOT.INI',
  'DRIVER.SYS',
  'MEMDUMP.BIN',
  'CLIPBRD.EXE',
  'NOTEPAD.SYS',
  'TASKMGR.COM',
  'UNINST.EXE',
  'SETUP.MSI',
  'ERROR_404',
  'PENDING.UP',
  'QUEUE.DAT',
  'AUTH.TOK',
  'SCRNSAVE.SCR',
  'DESKTOP.INI',
  'FONTS.DAT',
  'PRINT.SPL',
];

function mulberry32(seed: number) {
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

/** Procedural filler windows — dense field visible across the viewport. */
export function generateDecorativeWindows(compact: boolean): DecorativeWindowSpec[] {
  const rand = mulberry32(0x0c0c0c);
  const target = compact ? 42 : 88;
  const specs: DecorativeWindowSpec[] = [];
  const minChapterGap = compact ? 2.8 : 3.2;

  const xSpan = compact ? 11 : 14;
  const ySpan = compact ? 8 : 10;
  const zNear = -6;
  const zFar = compact ? -32 : -38;

  let attempts = 0;
  const maxAttempts = target * 25;

  while (specs.length < target && attempts < maxAttempts) {
    attempts += 1;
    const layer = Math.floor(rand() * 5);
    const z =
      zNear -
      (layer / 4) * (zFar - zNear) -
      rand() * ((zFar - zNear) / 5);
    const x = (rand() - 0.5) * 2 * xSpan;
    const y = (rand() - 0.5) * 2 * ySpan;

    if (distToChapter(x, y, z) < minChapterGap) continue;

    const w = 1.1 + rand() * (compact ? 1.6 : 2.2);
    const h = 0.75 + rand() * (compact ? 1.2 : 1.8);
    const title = DECORATIVE_TITLES[Math.floor(rand() * DECORATIVE_TITLES.length)];

    specs.push({
      id: `decor-${specs.length}`,
      title,
      position: [x, y, z],
      rotation: [
        (rand() - 0.5) * 0.35,
        (rand() - 0.5) * 0.55,
        (rand() - 0.5) * 0.2,
      ],
      size: [w, h],
      accentTitle: rand() > 0.88,
    });
  }

  return specs;
}
