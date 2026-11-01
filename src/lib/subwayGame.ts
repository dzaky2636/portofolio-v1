export type SubwayStatus = 'ready' | 'playing' | 'over';
export type SubwayLane = -1 | 0 | 1;
export type SubwayObstacleKind = 'low' | 'high' | 'train';

export interface SubwayObstacle {
  id: number;
  kind: SubwayObstacleKind;
  lane: SubwayLane;
  /** Near end, in world units along the track. */
  z: number;
  length: number;
  /** A ramped train can be run up from the front and ridden along the roof. */
  ramp: boolean;
}

export interface SubwayItem {
  id: number;
  kind: 'coin' | 'magnet';
  /** In lanes, so a magnet can pull an item off its track. */
  x: number;
  y: number;
  z: number;
}

export interface SubwayState {
  status: SubwayStatus;
  /** The lane being moved to. */
  lane: SubwayLane;
  /** Where the runner is now, in lanes. */
  x: number;
  y: number;
  velocityY: number;
  /** Height of the surface under the runner. */
  ground: number;
  distance: number;
  speed: number;
  coins: number;
  rollTimer: number;
  /** A jump pressed just before landing still counts. */
  jumpTimer: number;
  /** While this runs the chaser is close, and a second stumble ends the run. */
  stumbleTimer: number;
  magnetTimer: number;
  obstacles: SubwayObstacle[];
  items: SubwayItem[];
  nextRowZ: number;
  /** The lane kept free of trains, which is what makes every row passable. */
  safeLane: SubwayLane;
  /** Where the last train in each lane ends, indexed by lane + 1. */
  laneClearZ: number[];
  nextId: number;
}

export const CAR_LENGTH = 15;
export const TRAIN_HEIGHT = 3.4;
export const MAGNET_SECONDS = 8;
export const ROLL_SECONDS = 0.6;

const LANES: SubwayLane[] = [-1, 0, 1];
const START_SPEED = 24;
const MAX_SPEED = 50;
const ACCELERATION = 0.25;
const LANE_CHANGE_SPEED = 8;
const GRAVITY = 40;
const JUMP_VELOCITY = 14;
const FAST_FALL_VELOCITY = -26;
const JUMP_BUFFER_SECONDS = 0.12;
const STUMBLE_SECONDS = 4;
/** How far the runner's feet may be under a surface and still step onto it. */
const STEP_UP = 0.7;
const LOW_BARRIER_CLEARANCE = 1.1;
const FIRST_ROW_Z = 70;
const MIN_ROW_SPACING = 30;
/** Rows stay further apart in time than one jump lasts, whatever the speed. */
const ROW_SECONDS = 0.85;
const SPAWN_AHEAD = 150;
const KEEP_BEHIND = 15;
/** Open track a lane needs before a row, so the runner has room to move into it. */
const SHIFT_ROOM = 18;
const MAX_PRESSURE_Z = 3000;
const BARRIER_CHANCE = 0.3;
const SAFE_BARRIER_CHANCE = 0.35;
const RAMP_CHANCE = 0.35;
const COIN_LINE_CHANCE = 0.6;
const MAGNET_CHANCE = 0.05;
const MAX_TRAIN_CARS = 3;
const COIN_SPACING = 3;
const COIN_HEIGHT = 1;
const MAGNET_RANGE = 24;
const MAGNET_PULL = 12;
const PICKUP_DEPTH = 1.2;
const PICKUP_WIDTH = 0.5;
const PICKUP_HEIGHT = 2.2;
const COIN_SCORE = 5;
const DISTANCE_PER_POINT = 2;

function clampLane(lane: number) {
  return Math.max(-1, Math.min(1, lane)) as SubwayLane;
}

function approach(value: number, target: number, step: number) {
  return value < target ? Math.min(value + step, target) : Math.max(value - step, target);
}

function trainAt(obstacles: SubwayObstacle[], lane: SubwayLane, distance: number) {
  return obstacles.find(
    (item) =>
      item.kind === 'train' &&
      item.lane === lane &&
      item.z <= distance &&
      distance <= item.z + item.length
  );
}

function trainTop(train: SubwayObstacle, distance: number) {
  if (!train.ramp) return TRAIN_HEIGHT;
  return TRAIN_HEIGHT * Math.min((distance - train.z) / CAR_LENGTH, 1);
}

function addItem(state: SubwayState, item: Omit<SubwayItem, 'id'>) {
  state.items.push({ ...item, id: state.nextId });
  state.nextId += 1;
}

function addObstacle(state: SubwayState, obstacle: Omit<SubwayObstacle, 'id'>) {
  state.obstacles.push({ ...obstacle, id: state.nextId });
  state.nextId += 1;
}

function addTrain(state: SubwayState, lane: SubwayLane, z: number, random: () => number) {
  const ramp = random() < RAMP_CHANCE;
  const cars = 1 + Math.floor(random() * MAX_TRAIN_CARS);
  const length = (cars + (ramp ? 1 : 0)) * CAR_LENGTH;
  addObstacle(state, { kind: 'train', lane, z, length, ramp });
  state.laneClearZ[lane + 1] = z + length;

  if (!ramp) return;
  for (let coinZ = z + CAR_LENGTH + 2; coinZ < z + length - 2; coinZ += COIN_SPACING) {
    addItem(state, { kind: 'coin', x: lane, y: TRAIN_HEIGHT + COIN_HEIGHT, z: coinZ });
  }
}

function addBarrier(state: SubwayState, lane: SubwayLane, z: number, random: () => number) {
  const kind = random() < 0.5 ? 'low' : 'high';
  addObstacle(state, { kind, lane, z, length: 0, ramp: false });
}

/** Mutates state, which fillRows has already copied. */
function addRow(state: SubwayState, random: () => number) {
  const z = state.nextRowZ;
  const pressure = Math.min(z / MAX_PRESSURE_Z, 1);
  const trainChance = 0.35 + 0.3 * pressure;

  const previousSafeLane = state.safeLane;
  const candidate = clampLane(state.safeLane + Math.floor(random() * 3) - 1);
  if (state.laneClearZ[candidate + 1] + SHIFT_ROOM <= z) state.safeLane = candidate;

  for (const lane of LANES) {
    if (lane === state.safeLane) {
      if (lane === previousSafeLane && random() < SAFE_BARRIER_CHANCE) {
        addBarrier(state, lane, z, random);
      }
      continue;
    }
    if (state.laneClearZ[lane + 1] > z) continue;

    const roll = random();
    if (roll < trainChance) addTrain(state, lane, z, random);
    else if (roll < trainChance + BARRIER_CHANCE) addBarrier(state, lane, z, random);
  }

  // Coins sit between rows, so they mark the way into the next safe stretch.
  const roll = random();
  if (roll < MAGNET_CHANCE) {
    addItem(state, { kind: 'magnet', x: state.safeLane, y: COIN_HEIGHT, z: z + MIN_ROW_SPACING / 2 });
  } else if (roll < MAGNET_CHANCE + COIN_LINE_CHANCE) {
    for (let index = 0; index < 6; index += 1) {
      const coinZ = z + 8 + index * COIN_SPACING;
      addItem(state, { kind: 'coin', x: state.safeLane, y: COIN_HEIGHT, z: coinZ });
    }
  }

  state.nextRowZ += Math.max(MIN_ROW_SPACING, state.speed * ROW_SECONDS);
}

function fillRows(state: SubwayState, random: () => number): SubwayState {
  if (state.nextRowZ > state.distance + SPAWN_AHEAD) return state;

  const next = {
    ...state,
    obstacles: [...state.obstacles],
    items: [...state.items],
    laneClearZ: [...state.laneClearZ],
  };
  while (next.nextRowZ <= next.distance + SPAWN_AHEAD) addRow(next, random);
  return next;
}

export function createSubwayGame(random: () => number = Math.random): SubwayState {
  return fillRows(
    {
      status: 'ready',
      lane: 0,
      x: 0,
      y: 0,
      velocityY: 0,
      ground: 0,
      distance: 0,
      speed: START_SPEED,
      coins: 0,
      rollTimer: 0,
      jumpTimer: 0,
      stumbleTimer: 0,
      magnetTimer: 0,
      obstacles: [],
      items: [],
      nextRowZ: FIRST_ROW_Z,
      safeLane: 0,
      laneClearZ: [0, 0, 0],
      nextId: 0,
    },
    random
  );
}

export function subwayScore(state: SubwayState) {
  return Math.floor(state.distance / DISTANCE_PER_POINT) + state.coins * COIN_SCORE;
}

export function moveLane(state: SubwayState, direction: -1 | 1): SubwayState {
  if (state.status === 'over') return state;

  const started: SubwayState = { ...state, status: 'playing' };
  const lane = clampLane(state.lane + direction);
  if (lane === state.lane) return started;

  const train = trainAt(state.obstacles, lane, state.distance);
  if (!train || state.y >= trainTop(train, state.distance) - STEP_UP) {
    return { ...started, lane };
  }

  // Clipping the side of a train bounces the runner back into its own lane.
  return state.stumbleTimer > 0
    ? { ...started, status: 'over' }
    : { ...started, stumbleTimer: STUMBLE_SECONDS };
}

export function jump(state: SubwayState): SubwayState {
  if (state.status === 'over') return state;

  const started: SubwayState = { ...state, status: 'playing' };
  return state.y <= state.ground
    ? { ...started, velocityY: JUMP_VELOCITY, rollTimer: 0 }
    : { ...started, jumpTimer: JUMP_BUFFER_SECONDS };
}

export function roll(state: SubwayState): SubwayState {
  if (state.status === 'over') return state;

  return {
    ...state,
    status: 'playing',
    rollTimer: ROLL_SECONDS,
    velocityY: state.y > state.ground ? FAST_FALL_VELOCITY : state.velocityY,
  };
}

function pullItem(item: SubwayItem, state: SubwayState, dt: number): SubwayItem {
  const pull = Math.min(dt * MAGNET_PULL, 1);
  return {
    ...item,
    x: item.x + (state.x - item.x) * pull,
    y: item.y + (state.y + COIN_HEIGHT - item.y) * pull,
    z: item.z + (state.distance - item.z) * pull,
  };
}

function isReached(item: SubwayItem, state: SubwayState) {
  return (
    Math.abs(item.z - state.distance) < PICKUP_DEPTH &&
    Math.abs(item.x - state.x) < PICKUP_WIDTH &&
    Math.abs(item.y - state.y) < PICKUP_HEIGHT
  );
}

function hitsBarrier(item: SubwayObstacle, state: SubwayState, from: number, y: number) {
  if (item.kind === 'train' || item.z <= from || item.z > state.distance) return false;
  return item.kind === 'low' ? y < LOW_BARRIER_CLEARANCE : state.rollTimer <= 0;
}

function collectItems(state: SubwayState, dt: number): SubwayState {
  let { coins, magnetTimer } = state;
  const items: SubwayItem[] = [];

  for (const item of state.items) {
    const pulled =
      item.kind === 'coin' && magnetTimer > 0 && item.z - state.distance < MAGNET_RANGE
        ? pullItem(item, state, dt)
        : item;

    if (isReached(pulled, state)) {
      if (pulled.kind === 'coin') coins += 1;
      else magnetTimer = MAGNET_SECONDS;
    } else if (pulled.z > state.distance - KEEP_BEHIND) {
      items.push(pulled);
    }
  }

  return { ...state, coins, magnetTimer, items };
}

export function stepSubway(
  state: SubwayState,
  dt: number,
  random: () => number = Math.random
): SubwayState {
  if (state.status !== 'playing') return state;

  const speed = Math.min(state.speed + ACCELERATION * dt, MAX_SPEED);
  const distance = state.distance + speed * dt;
  const x = approach(state.x, state.lane, LANE_CHANGE_SPEED * dt);
  const lane = Math.round(x) as SubwayLane;

  const train = trainAt(state.obstacles, lane, distance);
  const ground = train ? trainTop(train, distance) : 0;
  if (train && state.y < ground - STEP_UP) return { ...state, x, status: 'over' };

  const fallingVelocity = state.velocityY - GRAVITY * dt;
  const fallingY = state.y + fallingVelocity * dt;
  const landed = fallingY <= ground;
  const buffered = landed && state.jumpTimer > 0;
  const y = landed ? ground : fallingY;
  const velocityY = buffered ? JUMP_VELOCITY : landed ? 0 : fallingVelocity;

  const moved: SubwayState = {
    ...state,
    x,
    y,
    velocityY,
    ground,
    distance,
    speed,
    rollTimer: Math.max(state.rollTimer - dt, 0),
    jumpTimer: buffered ? 0 : Math.max(state.jumpTimer - dt, 0),
    stumbleTimer: Math.max(state.stumbleTimer - dt, 0),
    magnetTimer: Math.max(state.magnetTimer - dt, 0),
  };

  const hitBarrier = state.obstacles.some(
    (item) => item.lane === lane && hitsBarrier(item, moved, state.distance, y)
  );
  if (hitBarrier) return { ...moved, status: 'over' };

  const collected = collectItems(moved, dt);
  return fillRows(
    {
      ...collected,
      obstacles: state.obstacles.filter(
        (item) => item.z + item.length > distance - KEEP_BEHIND
      ),
    },
    random
  );
}
