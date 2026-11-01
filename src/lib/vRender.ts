import {
  crossesFor,
  V_COLORS,
  V_MAX_CROSSES,
  type VColor,
  type VEffect,
  type VState,
} from '@/lib/vGame';

export const V_WIDTH = 640;
export const V_HEIGHT = 480;

const INK: Record<VColor, string> = {
  red: '#FF3333',
  green: '#2FD36B',
  blue: '#5B7BFF',
  yellow: '#FFD700',
  white: '#F4F3ED',
  purple: '#C05CFF',
};

// Dark on purpose: a brighter set would strobe as channels change, and hide the ink colors.
const BACKGROUNDS = ['#0C0C0C', '#1E0B33', '#07261A', '#2B0B0B', '#0A1A3D'];
const CROSS_COLORS = ['#C05CFF', '#2FD36B', '#35D6E8'];

const FRAME = 22;
const SCANLINE_GAP = 4;
const TILT_RADIANS = 0.03;
const STATIC_MS = 90;
const STATIC_CELL = 6;
const TIMER_STEPS = 24;
const WORD_MAX_SIZE = 96;
const WORD_MAX_WIDTH = V_WIDTH - FRAME * 6;
const FONT_FAMILY = '"JetBrains Mono", ui-monospace, monospace';

const SHRINK_SCALE = 0.42;
const DRIFT_X = 170;
const DRIFT_Y = 110;
const SPIN_RADIANS_PER_MS = 0.0025;
const SWAY_RADIANS = 0.15;
const WOBBLE_PIXELS = 24;
const GHOST_OFFSET = 15;
const GHOST_ALPHA = 0.5;
const DECOY_COUNT = 5;
const DECOY_SIZE = 30;
const DECOY_ALPHA = 0.6;
const BAR_COUNT = 3;
const BAR_HEIGHT = 34;
const SLICE_HEIGHT = 24;
const SLICE_SHIFT = 42;
const SNOW_DOTS = 700;
const SNOW_DOT_SIZE = 7;
const SHUTTER_SHARE = 0.42;
/** Fast enough that the word is only hidden for a fraction of the shortest channel clock. */
const SHUTTER_PIXELS_PER_MS = 0.3;

export interface VDrawOptions {
  word: string;
  colorName: (color: VColor) => string;
  swappedLabel: string;
  channelLabel: string;
  /** Milliseconds since the channel last changed, for static and moving effects. */
  sinceTuneMs: number;
  reducedMotion: boolean;
}

interface EffectContext {
  state: VState;
  time: number;
  seed: number;
  has: (effect: VEffect) => boolean;
}

let wordLayer: HTMLCanvasElement | null = null;

function getWordLayer() {
  if (!wordLayer) {
    wordLayer = document.createElement('canvas');
    wordLayer.width = V_WIDTH;
    wordLayer.height = V_HEIGHT;
  }
  return wordLayer;
}

/** Small repeatable generator, so effects hold still within a frame and differ per signal. */
function seededRandom(seed: number) {
  let value = Math.floor(seed * 2147483646) + 1;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

function setFont(ctx: CanvasRenderingContext2D, size: number) {
  ctx.font = `bold ${size}px ${FONT_FAMILY}`;
}

function drawStatic(ctx: CanvasRenderingContext2D) {
  for (let y = FRAME; y < V_HEIGHT - FRAME; y += STATIC_CELL) {
    for (let x = FRAME; x < V_WIDTH - FRAME; x += STATIC_CELL) {
      const shade = Math.floor(Math.random() * 90);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(x, y, STATIC_CELL, STATIC_CELL);
    }
  }
}

function drawTimer(ctx: CanvasRenderingContext2D, state: VState) {
  const lit = Math.ceil((state.timeLeftMs / state.limitMs) * TIMER_STEPS);
  const width = (V_WIDTH - FRAME * 4) / TIMER_STEPS;
  ctx.fillStyle = lit <= TIMER_STEPS / 4 ? '#FF3333' : '#F4F3ED';
  for (let step = 0; step < lit; step += 1) {
    ctx.fillRect(FRAME * 2 + step * width, V_HEIGHT - FRAME * 2 - 10, width - 3, 10);
  }
}

function drawCrosses(ctx: CanvasRenderingContext2D, streak: number) {
  const crosses = crossesFor(streak);
  for (let index = 0; index < V_MAX_CROSSES; index += 1) {
    const x = V_WIDTH - FRAME * 2 - (V_MAX_CROSSES - index) * 26;
    const y = FRAME * 2;
    ctx.fillStyle = index < crosses ? CROSS_COLORS[index] : 'rgba(244,243,237,0.2)';
    ctx.fillRect(x + 7, y, 6, 20);
    ctx.fillRect(x, y + 7, 20, 6);
  }
}

function drawDecoys(
  ctx: CanvasRenderingContext2D,
  { seed }: EffectContext,
  colorName: VDrawOptions['colorName']
) {
  const random = seededRandom(seed);
  ctx.globalAlpha = DECOY_ALPHA;
  setFont(ctx, DECOY_SIZE);
  for (let index = 0; index < DECOY_COUNT; index += 1) {
    const color = V_COLORS[Math.floor(random() * V_COLORS.length)];
    const name = V_COLORS[Math.floor(random() * V_COLORS.length)];
    ctx.fillStyle = INK[color];
    ctx.fillText(
      colorName(name),
      FRAME * 5 + random() * (V_WIDTH - FRAME * 10),
      FRAME * 5 + random() * (V_HEIGHT - FRAME * 10)
    );
  }
  ctx.globalAlpha = 1;
}

function drawLetters(
  ctx: CanvasRenderingContext2D,
  word: string,
  { has, time, seed }: EffectContext
) {
  if (!has('wobble')) {
    ctx.fillText(word, 0, 0);
    return;
  }

  const letters = [...word];
  const width = ctx.measureText(word).width;
  let x = -width / 2;
  letters.forEach((letter, index) => {
    const letterWidth = ctx.measureText(letter).width;
    const wave = time * 0.008 + index * 1.1 + seed * 9;
    ctx.fillText(letter, x + letterWidth / 2, Math.sin(wave) * WOBBLE_PIXELS);
    x += letterWidth;
  });
}

function drawTrueWord(layer: CanvasRenderingContext2D, word: string, context: EffectContext) {
  const { state, time, seed, has } = context;
  const { ink } = state.signal;

  setFont(layer, WORD_MAX_SIZE);
  const fitted = Math.min(
    WORD_MAX_SIZE,
    (WORD_MAX_SIZE * WORD_MAX_WIDTH) / layer.measureText(word).width
  );
  setFont(layer, has('shrink') ? fitted * SHRINK_SCALE : fitted);

  layer.save();
  layer.translate(V_WIDTH / 2, V_HEIGHT / 2);
  if (has('shrink')) {
    layer.translate(
      Math.sin(time * 0.0016 + seed * 6) * DRIFT_X,
      Math.cos(time * 0.0021 + seed * 6) * DRIFT_Y
    );
  }
  if (has('spin')) layer.rotate(time * SPIN_RADIANS_PER_MS + seed * Math.PI * 2);

  if (has('ghost')) {
    const others = V_COLORS.filter((color) => color !== ink);
    const offset = Math.sin(time * 0.006 + seed * 7) * GHOST_OFFSET + GHOST_OFFSET;
    layer.globalAlpha = GHOST_ALPHA;
    layer.fillStyle = INK[others[Math.floor(seed * others.length)]];
    layer.translate(offset, offset / 2);
    drawLetters(layer, word, context);
    layer.translate(-offset, -offset / 2);
    layer.globalAlpha = 1;
  }

  layer.fillStyle = INK[ink];
  drawLetters(layer, word, context);
  layer.restore();
}

function blitWordLayer(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  { has, time, seed }: EffectContext
) {
  if (!has('glitch')) {
    ctx.drawImage(source, 0, 0);
    return;
  }

  // Stepped on purpose: the slices jump into place instead of sliding.
  const beat = Math.floor(time / 110);
  for (let y = 0; y < V_HEIGHT; y += SLICE_HEIGHT) {
    const shift = Math.round(Math.sin(y * 0.7 + beat * 2.3 + seed * 11) * SLICE_SHIFT);
    ctx.drawImage(source, 0, y, V_WIDTH, SLICE_HEIGHT, shift, y, V_WIDTH, SLICE_HEIGHT);
  }
}

function drawObstructions(ctx: CanvasRenderingContext2D, { state, time, seed, has }: EffectContext) {
  const background = BACKGROUNDS[state.signal.background];

  if (has('snow')) {
    const random = seededRandom((seed + Math.floor(time / 90) * 0.0137) % 1);
    for (let dot = 0; dot < SNOW_DOTS; dot += 1) {
      const shade = Math.floor(random() * 80);
      ctx.fillStyle = dot % 2 === 0 ? background : `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(random() * V_WIDTH, random() * V_HEIGHT, SNOW_DOT_SIZE, SNOW_DOT_SIZE);
    }
  }

  if (has('bars')) {
    ctx.fillStyle = background;
    const gap = V_HEIGHT / BAR_COUNT;
    for (let index = 0; index < BAR_COUNT; index += 1) {
      const y = (time * 0.09 + index * gap + seed * V_HEIGHT) % V_HEIGHT;
      ctx.fillRect(0, y, V_WIDTH, BAR_HEIGHT);
    }
  }

  if (has('shutter')) {
    const band = V_HEIGHT * SHUTTER_SHARE;
    const y = ((time * SHUTTER_PIXELS_PER_MS + seed * V_HEIGHT) % (V_HEIGHT + band)) - band;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, y, V_WIDTH, band);
  }
}

function drawPicture(
  ctx: CanvasRenderingContext2D,
  word: string,
  context: EffectContext,
  colorName: VDrawOptions['colorName']
) {
  const source = getWordLayer();
  const layer = source.getContext('2d');
  if (!layer) return;

  layer.clearRect(0, 0, V_WIDTH, V_HEIGHT);
  layer.textAlign = 'center';
  layer.textBaseline = 'middle';
  if (context.has('decoys')) drawDecoys(layer, context, colorName);
  drawTrueWord(layer, word, context);

  ctx.save();
  ctx.beginPath();
  ctx.rect(FRAME, FRAME, V_WIDTH - FRAME * 2, V_HEIGHT - FRAME * 2);
  ctx.clip();
  blitWordLayer(ctx, source, context);
  drawObstructions(ctx, context);
  ctx.restore();
}

export function drawV(ctx: CanvasRenderingContext2D, state: VState, options: VDrawOptions) {
  const { word, colorName, swappedLabel, channelLabel, sinceTuneMs, reducedMotion } = options;
  const { effects, seed, swapped, background } = state.signal;
  const playing = state.status === 'playing';
  const context: EffectContext = {
    state,
    // A frozen clock keeps every obstruction but stops it moving.
    time: reducedMotion ? 0 : sinceTuneMs,
    seed,
    // A shutter that can't move could cover the word for the whole channel.
    has: (effect) => effects.includes(effect) && !(reducedMotion && effect === 'shutter'),
  };

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

  ctx.translate(V_WIDTH / 2, V_HEIGHT / 2);
  if (!reducedMotion) {
    ctx.rotate((state.channel % 2 === 0 ? 1 : -1) * TILT_RADIANS);
    if (context.has('sway')) ctx.rotate(Math.sin(sinceTuneMs * 0.003 + seed * 6) * SWAY_RADIANS);
  }
  ctx.translate(-V_WIDTH / 2, -V_HEIGHT / 2);

  ctx.fillStyle = BACKGROUNDS[background];
  ctx.fillRect(FRAME, FRAME, V_WIDTH - FRAME * 2, V_HEIGHT - FRAME * 2);

  if (!reducedMotion && playing && sinceTuneMs < STATIC_MS) drawStatic(ctx);
  else drawPicture(ctx, word, context, colorName);

  setFont(ctx, 20);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#2FD36B';
  ctx.fillText(`${channelLabel} ${String(state.channel).padStart(3, '0')}`, FRAME * 2, FRAME * 2);

  drawCrosses(ctx, state.streak);
  if (playing) drawTimer(ctx, state);

  if (swapped && playing) {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(FRAME, V_HEIGHT / 2 + 80, V_WIDTH - FRAME * 2, 34);
    ctx.fillStyle = '#0C0C0C';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(swappedLabel, V_WIDTH / 2, V_HEIGHT / 2 + 98);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  for (let y = 0; y < V_HEIGHT; y += SCANLINE_GAP) ctx.fillRect(0, y, V_WIDTH, 1);
}
