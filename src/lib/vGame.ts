export type VColor = 'red' | 'green' | 'blue' | 'yellow' | 'white' | 'purple';
export type VSide = 'left' | 'right';
export type VStatus = 'ready' | 'playing' | 'over';

export interface VSignal {
  word: VColor;
  ink: VColor;
  background: number;
  reversed: boolean;
  swapped: boolean;
}

export interface VState {
  status: VStatus;
  channel: number;
  signal: VSignal;
  lives: number;
  streak: number;
  holds: number;
  cp: number;
  limitMs: number;
  timeLeftMs: number;
}

export const V_COLORS: VColor[] = ['red', 'green', 'blue', 'yellow', 'white', 'purple'];
export const V_BACKGROUND_COUNT = 5;
export const V_START_LIVES = 3;
export const V_MAX_HOLDS = 3;
export const V_MAX_CROSSES = 3;
export const V_STREAK_PER_CROSS = 4;

const MATCH_CHANCE = 0.5;
const REVERSED_FROM_CHANNEL = 8;
const REVERSED_CHANCE = 0.3;
const BACKGROUND_FROM_CHANNEL = 15;
const BACKGROUND_CHANCE = 0.6;
const SWAPPED_FROM_CHANNEL = 25;
const SWAPPED_CHANCE = 0.25;
const START_LIMIT_MS = 3200;
const FASTEST_LIMIT_MS = 1200;
const LIMIT_DROP_PER_CHANNEL_MS = 50;
/** Answering with less than this share of the clock left is too slow to keep the combo. */
const SLOW_SHARE = 0.35;

function pick<T>(items: T[], random: () => number) {
  return items[Math.floor(random() * items.length)];
}

export function channelLimitMs(channel: number) {
  return Math.max(FASTEST_LIMIT_MS, START_LIMIT_MS - (channel - 1) * LIMIT_DROP_PER_CHANNEL_MS);
}

export function crossesFor(streak: number) {
  return Math.min(Math.floor(streak / V_STREAK_PER_CROSS), V_MAX_CROSSES);
}

function createSignal(channel: number, random: () => number): VSignal {
  const word = pick(V_COLORS, random);
  const ink =
    random() < MATCH_CHANCE ? word : pick(V_COLORS.filter((color) => color !== word), random);

  return {
    word,
    ink,
    background:
      channel >= BACKGROUND_FROM_CHANNEL && random() < BACKGROUND_CHANCE
        ? 1 + Math.floor(random() * (V_BACKGROUND_COUNT - 1))
        : 0,
    reversed: channel >= REVERSED_FROM_CHANNEL && random() < REVERSED_CHANCE,
    swapped: channel >= SWAPPED_FROM_CHANNEL && random() < SWAPPED_CHANCE,
  };
}

function tuneTo(state: VState, channel: number, random: () => number): VState {
  const limitMs = channelLimitMs(channel);
  return { ...state, channel, signal: createSignal(channel, random), limitMs, timeLeftMs: limitMs };
}

export function createVGame(random: () => number = Math.random): VState {
  return {
    status: 'ready',
    channel: 1,
    signal: createSignal(1, random),
    lives: V_START_LIVES,
    streak: 0,
    holds: 0,
    cp: 0,
    limitMs: channelLimitMs(1),
    timeLeftMs: channelLimitMs(1),
  };
}

export function startV(state: VState): VState {
  return state.status === 'ready' ? { ...state, status: 'playing' } : state;
}

function loseSignal(state: VState, random: () => number): VState {
  const lives = state.lives - 1;
  const hurt: VState = { ...state, lives, streak: 0 };
  return lives <= 0 ? { ...hurt, status: 'over' } : tuneTo(hurt, state.channel, random);
}

/** A hold is earned each time a full set of crosses is built. */
function earnedHolds(state: VState, streak: number) {
  const fullStreak = V_STREAK_PER_CROSS * V_MAX_CROSSES;
  const earned = streak > 0 && streak % fullStreak === 0 ? 1 : 0;
  return Math.min(state.holds + earned, V_MAX_HOLDS);
}

/** Left means match and right means no match, until the signal swaps them. */
export function press(state: VState, side: VSide, random: () => number = Math.random): VState {
  if (state.status !== 'playing') return state;

  const { word, ink, swapped } = state.signal;
  const saysMatch = (side === 'left') !== swapped;
  if (saysMatch !== (word === ink)) return loseSignal(state, random);

  const tooSlow = state.timeLeftMs < state.limitMs * SLOW_SHARE;
  const streak = (tooSlow ? 0 : state.streak) + 1;
  return tuneTo(
    { ...state, streak, holds: earnedHolds(state, streak), cp: state.cp + 1 + crossesFor(streak) },
    state.channel + 1,
    random
  );
}

/** Skips the channel without answering; it still counts toward the combo. */
export function hold(state: VState, random: () => number = Math.random): VState {
  if (state.status !== 'playing' || state.holds === 0) return state;

  const streak = state.streak + 1;
  return tuneTo(
    { ...state, streak, holds: earnedHolds({ ...state, holds: state.holds - 1 }, streak) },
    state.channel + 1,
    random
  );
}

export function stepV(state: VState, dtMs: number, random: () => number = Math.random): VState {
  if (state.status !== 'playing') return state;

  const timeLeftMs = state.timeLeftMs - dtMs;
  return timeLeftMs > 0 ? { ...state, timeLeftMs } : loseSignal(state, random);
}
