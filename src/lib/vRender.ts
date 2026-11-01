import { crossesFor, V_MAX_CROSSES, type VColor, type VState } from '@/lib/vGame';

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

export interface VDrawOptions {
  word: string;
  swappedLabel: string;
  channelLabel: string;
  /** Milliseconds since the channel last changed, for the burst of static. */
  sinceTuneMs: number;
  reducedMotion: boolean;
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

function drawWord(ctx: CanvasRenderingContext2D, state: VState, word: string) {
  ctx.font = `bold ${WORD_MAX_SIZE}px "JetBrains Mono", ui-monospace, monospace`;
  const size = Math.min(WORD_MAX_SIZE, (WORD_MAX_SIZE * WORD_MAX_WIDTH) / ctx.measureText(word).width);
  ctx.font = `bold ${size}px "JetBrains Mono", ui-monospace, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = INK[state.signal.ink];
  ctx.fillText(word, V_WIDTH / 2, V_HEIGHT / 2);
}

export function drawV(ctx: CanvasRenderingContext2D, state: VState, options: VDrawOptions) {
  const { word, swappedLabel, channelLabel, sinceTuneMs, reducedMotion } = options;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

  ctx.translate(V_WIDTH / 2, V_HEIGHT / 2);
  if (!reducedMotion) ctx.rotate((state.channel % 2 === 0 ? 1 : -1) * TILT_RADIANS);
  ctx.translate(-V_WIDTH / 2, -V_HEIGHT / 2);

  ctx.fillStyle = BACKGROUNDS[state.signal.background];
  ctx.fillRect(FRAME, FRAME, V_WIDTH - FRAME * 2, V_HEIGHT - FRAME * 2);

  if (!reducedMotion && state.status === 'playing' && sinceTuneMs < STATIC_MS) {
    drawStatic(ctx);
  } else {
    drawWord(ctx, state, word);
  }

  ctx.font = 'bold 20px "JetBrains Mono", ui-monospace, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#2FD36B';
  ctx.fillText(`${channelLabel} ${String(state.channel).padStart(3, '0')}`, FRAME * 2, FRAME * 2);

  drawCrosses(ctx, state.streak);
  if (state.status === 'playing') drawTimer(ctx, state);

  if (state.signal.swapped && state.status === 'playing') {
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
