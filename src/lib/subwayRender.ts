import {
  CAR_LENGTH,
  MAGNET_SECONDS,
  ROLL_SECONDS,
  TRAIN_HEIGHT,
  type SubwayItem,
  type SubwayObstacle,
  type SubwayState,
} from '@/lib/subwayGame';

export const SUBWAY_WIDTH = 320;
export const SUBWAY_HEIGHT = 240;

const HORIZON = 78;
const FOCAL = 200;
const CAMERA_HEIGHT = 6;
const CAMERA_BACK = 10;
const CAMERA_FOLLOW_X = 0.7;
const CAMERA_FOLLOW_Y = 0.45;
const NEAR_Z = -9;
const FAR_Z = 150;
const LANE_WIDTH = 3.2;
const TRAIN_HALF_WIDTH = 1.35;
const BARRIER_HALF_WIDTH = 1.4;
const SLEEPER_SPACING = 3;
const SLEEPER_DRAW_Z = 90;
const BUILDING_LENGTH = 18;
const BUILDING_INSET = 1.5 * LANE_WIDTH + 2;
const BUILDING_DEPTH = 10;
const COIN_SIZE = 0.45;
const COIN_SPIN = 0.008;
const SPRITE_PIXEL = 0.15;
const RUN_STRIDE = 0.45;

const COLORS = {
  sky: '#2945FF',
  sun: '#FFD700',
  ground: '#F4F3ED',
  ballast: '#3A3A3A',
  sleeper: '#201E1C',
  rail: '#B9B6AB',
  building: '#0C0C0C',
  buildingSide: '#1E1E1E',
  window: '#FFD700',
  train: '#F4F3ED',
  trainSide: '#C9C6BA',
  trainRoof: '#8E8C82',
  trainStripe: '#2945FF',
  trainGlass: '#0C0C0C',
  ramp: '#FFD700',
  rampSide: '#8E7A06',
  barrier: '#FFD700',
  barrierStripe: '#0C0C0C',
  post: '#F4F3ED',
  coin: '#FFD700',
  coinEdge: '#B39700',
  magnet: '#FF3333',
  magnetTip: '#F4F3ED',
  shadow: '#0C0C0C',
  chaser: '#2945FF',
  chaserCap: '#0C0C0C',
  chaserSkin: '#F4F3ED',
};

/** Rear view of the boar, in the /public/boar.svg palette. */
const BOAR_COLORS: Record<string, string> = {
  K: '#1a120a',
  B: '#4a3728',
  M: '#5c4433',
  L: '#6b4f35',
  D: '#3d2e20',
  R: '#ff3333',
};

const BOAR_REAR = [
  '..KK....KK..',
  '..MM.KK.MM..',
  '..MMMKKMMM..',
  '.RRRRRRRRRR.',
  'MMLLMMMMLLMM',
  'MLLLMMMMLLLM',
  'MMLLMKDMLLMM',
  'MMMMMDKMMMMM',
  '.BBBBBBBBBB.',
  '.BBBBBBBBBB.',
];
const BOAR_STRIDES = [
  ['.DD.....KK..', '.DD.........'],
  ['..KK.....DD.', '.........DD.'],
];
const BOAR_TUCKED = ['.DD......DD.', '.DD......DD.'];

type Point = [x: number, y: number];

interface View {
  ctx: CanvasRenderingContext2D;
  cameraX: number;
  cameraY: number;
}

function project(view: View, x: number, y: number, z: number): Point {
  const scale = FOCAL / (z + CAMERA_BACK);
  // Snapping to whole pixels gives the same jitter as the PS1 scene behind the site.
  return [
    Math.round(SUBWAY_WIDTH / 2 + (x - view.cameraX) * scale),
    Math.round(HORIZON + (view.cameraY - y) * scale),
  ];
}

function polygon(ctx: CanvasRenderingContext2D, color: string, points: Point[]) {
  ctx.fillStyle = color;
  ctx.beginPath();
  points.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.fill();
}

/** A rectangle on the ground or on a roof, running along the track. */
function flat(
  view: View,
  color: string,
  left: number,
  right: number,
  y: number,
  near: number,
  far: number
) {
  polygon(view.ctx, color, [
    project(view, left, y, near),
    project(view, right, y, near),
    project(view, right, y, far),
    project(view, left, y, far),
  ]);
}

/** A wall running along the track. */
function wall(
  view: View,
  color: string,
  x: number,
  bottom: number,
  top: number,
  near: number,
  far: number
) {
  polygon(view.ctx, color, [
    project(view, x, bottom, near),
    project(view, x, top, near),
    project(view, x, top, far),
    project(view, x, bottom, far),
  ]);
}

/** A wall facing the camera. */
function face(
  view: View,
  color: string,
  left: number,
  right: number,
  bottom: number,
  top: number,
  z: number
) {
  polygon(view.ctx, color, [
    project(view, left, bottom, z),
    project(view, left, top, z),
    project(view, right, top, z),
    project(view, right, bottom, z),
  ]);
}

/** Stable pseudo-random value, so a building looks the same on every frame. */
function hash(index: number) {
  const value = Math.sin(index * 127.1) * 43758.5453;
  return value - Math.floor(value);
}

function drawBackdrop(view: View, state: SubwayState) {
  const { ctx } = view;
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(0, 0, SUBWAY_WIDTH, SUBWAY_HEIGHT);
  ctx.fillStyle = COLORS.sun;
  ctx.fillRect(208 - Math.round(view.cameraX), 18, 34, 34);
  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(0, HORIZON, SUBWAY_WIDTH, SUBWAY_HEIGHT - HORIZON);

  const trackEdge = 1.5 * LANE_WIDTH;
  flat(view, COLORS.ballast, -trackEdge, trackEdge, 0, NEAR_Z, FAR_Z);

  const offset = state.distance % SLEEPER_SPACING;
  for (let z = SLEEPER_DRAW_Z - offset; z > NEAR_Z; z -= SLEEPER_SPACING) {
    for (const lane of [-1, 0, 1]) {
      const center = lane * LANE_WIDTH;
      flat(view, COLORS.sleeper, center - 1.3, center + 1.3, 0, Math.max(z, NEAR_Z), z + 1);
    }
  }
  for (const lane of [-1, 0, 1]) {
    for (const rail of [-0.85, 0.85]) {
      const x = lane * LANE_WIDTH + rail;
      flat(view, COLORS.rail, x - 0.09, x + 0.09, 0.02, NEAR_Z, FAR_Z);
    }
  }
}

function drawBuilding(view: View, index: number, side: -1 | 1, distance: number) {
  const near = index * BUILDING_LENGTH - distance;
  const far = near + BUILDING_LENGTH - 3;
  if (far < NEAR_Z) return;

  const seed = hash(index * 2 + (side > 0 ? 1 : 0));
  const height = 6 + Math.floor(seed * 5) * 2;
  const inner = side * BUILDING_INSET;
  const outer = side * (BUILDING_INSET + BUILDING_DEPTH);
  const clippedNear = Math.max(near, NEAR_Z);

  if (near >= NEAR_Z) face(view, COLORS.building, inner, outer, 0, height, near);
  wall(view, COLORS.buildingSide, inner, 0, height, clippedNear, far);

  for (let y = 2; y < height - 1; y += 3) {
    for (let z = near + 2; z < far - 1; z += 4) {
      if (z < NEAR_Z || hash(index * 31 + y * 7 + z - near) < 0.45) continue;
      wall(view, COLORS.window, inner, y, y + 1.2, z, z + 1.6);
    }
  }
}

function drawBuildings(view: View, distance: number) {
  const first = Math.floor((distance + NEAR_Z) / BUILDING_LENGTH);
  const last = Math.ceil((distance + FAR_Z) / BUILDING_LENGTH);
  for (let index = last; index >= first; index -= 1) {
    drawBuilding(view, index, -1, distance);
    drawBuilding(view, index, 1, distance);
  }
}

function drawRampCar(view: View, x: number, near: number) {
  const left = x - TRAIN_HALF_WIDTH;
  const right = x + TRAIN_HALF_WIDTH;
  const far = near + CAR_LENGTH;
  if (far < NEAR_Z) return;

  const heightAt = (z: number) => (TRAIN_HEIGHT * (z - near)) / CAR_LENGTH;
  const start = Math.max(near, NEAR_Z);
  const sideWall = view.cameraX < left ? left : view.cameraX > right ? right : null;

  if (sideWall !== null) {
    polygon(view.ctx, COLORS.rampSide, [
      project(view, sideWall, 0, start),
      project(view, sideWall, heightAt(start), start),
      project(view, sideWall, TRAIN_HEIGHT, far),
      project(view, sideWall, 0, far),
    ]);
  }
  polygon(view.ctx, COLORS.ramp, [
    project(view, left, heightAt(start), start),
    project(view, right, heightAt(start), start),
    project(view, right, TRAIN_HEIGHT, far),
    project(view, left, TRAIN_HEIGHT, far),
  ]);
  for (let z = near + 2; z < far; z += 4) {
    if (z < NEAR_Z) continue;
    polygon(view.ctx, COLORS.barrierStripe, [
      project(view, left, heightAt(z), z),
      project(view, right, heightAt(z), z),
      project(view, right, heightAt(z + 1), z + 1),
      project(view, left, heightAt(z + 1), z + 1),
    ]);
  }
}

function drawCar(view: View, x: number, near: number, isFront: boolean) {
  const left = x - TRAIN_HALF_WIDTH;
  const right = x + TRAIN_HALF_WIDTH;
  const far = near + CAR_LENGTH - 0.5;
  if (far < NEAR_Z) return;

  const start = Math.max(near, NEAR_Z);
  const sideWall = view.cameraX < left ? left : view.cameraX > right ? right : null;

  if (sideWall !== null) {
    wall(view, COLORS.trainSide, sideWall, 0.3, TRAIN_HEIGHT, start, far);
    wall(view, COLORS.trainStripe, sideWall, 0.8, 1.3, start, far);
    for (let z = near + 1.5; z < far - 2; z += 4) {
      if (z >= NEAR_Z) wall(view, COLORS.trainGlass, sideWall, 1.8, 2.8, z, z + 2.4);
    }
  }
  flat(view, COLORS.trainRoof, left, right, TRAIN_HEIGHT, start, far);

  if (near < NEAR_Z) return;
  face(view, COLORS.train, left, right, 0.3, TRAIN_HEIGHT, near);
  face(view, COLORS.trainStripe, left, right, 0.8, 1.3, near);
  if (isFront) {
    face(view, COLORS.trainGlass, left + 0.3, x - 0.15, 1.8, 2.9, near);
    face(view, COLORS.trainGlass, x + 0.15, right - 0.3, 1.8, 2.9, near);
    face(view, COLORS.barrier, left + 0.3, left + 0.8, 0.45, 0.7, near);
    face(view, COLORS.barrier, right - 0.8, right - 0.3, 0.45, 0.7, near);
  }
}

function drawBarrier(view: View, obstacle: SubwayObstacle, z: number) {
  const x = obstacle.lane * LANE_WIDTH;
  const left = x - BARRIER_HALF_WIDTH;
  const right = x + BARRIER_HALF_WIDTH;
  const isHigh = obstacle.kind === 'high';
  const bottom = isHigh ? 1.9 : 0.35;
  const top = isHigh ? 3 : 1.1;

  face(view, COLORS.post, left, left + 0.2, 0, top, z);
  face(view, COLORS.post, right - 0.2, right, 0, top, z);
  face(view, COLORS.barrier, left, right, bottom, top, z);

  const stripeWidth = (right - left) / 7;
  for (let index = 1; index < 7; index += 2) {
    const stripe = left + index * stripeWidth;
    face(view, COLORS.barrierStripe, stripe, stripe + stripeWidth, bottom, top, z);
  }
}

function drawItem(view: View, item: SubwayItem, z: number, time: number) {
  const x = item.x * LANE_WIDTH;
  const shadowed = item.y < TRAIN_HEIGHT;
  if (shadowed) flat(view, COLORS.ballast, x - 0.3, x + 0.3, 0.03, z - 0.2, z + 0.2);

  if (item.kind === 'magnet') {
    face(view, COLORS.magnet, x - 0.6, x - 0.25, item.y - 0.5, item.y + 0.5, z);
    face(view, COLORS.magnet, x + 0.25, x + 0.6, item.y - 0.5, item.y + 0.5, z);
    face(view, COLORS.magnet, x - 0.6, x + 0.6, item.y - 0.5, item.y - 0.15, z);
    face(view, COLORS.magnetTip, x - 0.6, x - 0.25, item.y + 0.3, item.y + 0.5, z);
    face(view, COLORS.magnetTip, x + 0.25, x + 0.6, item.y + 0.3, item.y + 0.5, z);
    return;
  }

  const spin = Math.max(Math.abs(Math.cos(time * COIN_SPIN + item.z)), 0.2) * COIN_SIZE;
  face(view, COLORS.coinEdge, x - spin, x + spin, item.y - COIN_SIZE, item.y + COIN_SIZE, z);
  face(
    view,
    COLORS.coin,
    x - spin * 0.65,
    x + spin * 0.65,
    item.y - COIN_SIZE * 0.65,
    item.y + COIN_SIZE * 0.65,
    z
  );
}

function drawBoar(view: View, state: SubwayState) {
  const x = state.x * LANE_WIDTH;
  const shadowHalf = 0.8;
  flat(view, COLORS.shadow, x - shadowHalf, x + shadowHalf, state.ground + 0.03, -0.6, 0.6);

  const isRolling = state.rollTimer > 0;
  const isAirborne = state.y > state.ground;
  const stride = BOAR_STRIDES[Math.floor(state.distance * RUN_STRIDE) % BOAR_STRIDES.length];
  const legs = isAirborne || isRolling ? BOAR_TUCKED : stride;
  const rows = [...BOAR_REAR, ...legs];

  // The roll squashes the sprite and bobs it, so it reads as a tumble from behind.
  const squash = isRolling ? 0.5 : 1;
  const tumble = isRolling ? Math.sin((state.rollTimer / ROLL_SECONDS) * Math.PI * 4) * 0.12 : 0;
  const pixelHeight = SPRITE_PIXEL * squash;
  const width = rows[0].length * SPRITE_PIXEL;

  rows.forEach((row, rowIndex) => {
    const top = state.y + tumble + (rows.length - rowIndex) * pixelHeight;
    [...row].forEach((char, column) => {
      const color = BOAR_COLORS[char];
      if (!color) return;
      const left = x - width / 2 + column * SPRITE_PIXEL;
      face(view, color, left, left + SPRITE_PIXEL, top - pixelHeight, top, 0);
    });
  });
}

function drawChaser(view: View, state: SubwayState, time: number) {
  const x = state.x * LANE_WIDTH - 1.9;
  const z = -1;
  const isLeftStride = Math.floor(time / 120) % 2 === 0;
  const base = state.ground;
  face(view, COLORS.chaserCap, x - 0.4, x - 0.08, base, base + (isLeftStride ? 0.9 : 0.6), z);
  face(view, COLORS.chaserCap, x + 0.08, x + 0.4, base, base + (isLeftStride ? 0.6 : 0.9), z);
  face(view, COLORS.chaser, x - 0.5, x + 0.5, base + 0.8, base + 2.1, z);
  face(view, COLORS.window, x - 0.3, x - 0.08, base + 1.6, base + 1.85, z);
  face(view, COLORS.chaserSkin, x - 0.3, x + 0.3, base + 2.1, base + 2.5, z);
  face(view, COLORS.chaserCap, x - 0.4, x + 0.4, base + 2.45, base + 2.75, z);
}

function drawMagnetBar(ctx: CanvasRenderingContext2D, magnetTimer: number) {
  ctx.fillStyle = COLORS.shadow;
  ctx.fillRect(6, 6, 64, 8);
  ctx.fillStyle = COLORS.magnet;
  ctx.fillRect(8, 8, Math.ceil((magnetTimer / MAGNET_SECONDS) * 60), 4);
}

export function drawSubway(ctx: CanvasRenderingContext2D, state: SubwayState, time: number) {
  const view: View = {
    ctx,
    cameraX: state.x * LANE_WIDTH * CAMERA_FOLLOW_X,
    cameraY: CAMERA_HEIGHT + state.y * CAMERA_FOLLOW_Y,
  };

  drawBackdrop(view, state);
  drawBuildings(view, state.distance);

  // Painter's sort on far ends: anything on a roof lands after the car under it.
  const scene: { depth: number; draw: () => void }[] = [
    { depth: 0, draw: () => drawBoar(view, state) },
  ];

  for (const obstacle of state.obstacles) {
    const near = obstacle.z - state.distance;
    if (near > FAR_Z) continue;

    if (obstacle.kind !== 'train') {
      if (near > NEAR_Z) {
        scene.push({ depth: near, draw: () => drawBarrier(view, obstacle, near) });
      }
      continue;
    }

    const x = obstacle.lane * LANE_WIDTH;
    for (let offset = 0; offset < obstacle.length; offset += CAR_LENGTH) {
      const carNear = near + offset;
      const isRamp = obstacle.ramp && offset === 0;
      scene.push({
        depth: carNear + CAR_LENGTH,
        draw: () =>
          isRamp ? drawRampCar(view, x, carNear) : drawCar(view, x, carNear, offset === 0),
      });
    }
  }

  for (const item of state.items) {
    const z = item.z - state.distance;
    if (z > NEAR_Z && z < FAR_Z) {
      scene.push({ depth: z, draw: () => drawItem(view, item, z, time) });
    }
  }

  if (state.stumbleTimer > 0) {
    scene.push({ depth: -1, draw: () => drawChaser(view, state, time) });
  }

  scene.sort((a, b) => b.depth - a.depth);
  scene.forEach((entry) => entry.draw());

  if (state.magnetTimer > 0) drawMagnetBar(ctx, state.magnetTimer);
}
