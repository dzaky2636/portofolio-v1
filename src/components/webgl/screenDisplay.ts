import { BOAR_BODY, BOAR_LEGS_DOWN, BOAR_LEGS_UP, SPRITE_HEIGHT, SPRITE_WIDTH } from '@/lib/boarSprite';
import type { StatusReport } from '@/lib/siteStatus';
import { WEBGL_PALETTE } from '@/components/webgl/palette';

export const SCREEN_MODES = ['terminal', 'boar', 'crash'] as const;
export type ScreenMode = (typeof SCREEN_MODES)[number];

export const SCREEN_WIDTH = 512;
export const SCREEN_HEIGHT = 316;

const PADDING = 22;
const LINE_HEIGHT = 30;
const BOAR_PIXEL = 11;
const FOOTER = '[ CLICK ] NEXT_SCREEN';

export function terminalLines(report: StatusReport | null): string[] {
  const header = ['DZAKY_OS V1.0', '> PING --ALL'];
  if (!report) return [...header, 'WAITING FOR SIGNAL...'];

  const online = report.sites.filter((site) => site.state === 'online').length;
  const rows = report.sites.map((site) => {
    const latency = site.latencyMs === null ? '---' : `${site.latencyMs}MS`;
    return `${site.name.padEnd(10)}${site.state.toUpperCase().padEnd(10)}${latency}`;
  });

  return [...header, ...rows, `${online}/${report.sites.length} ONLINE`];
}

function drawFooter(ctx: CanvasRenderingContext2D, font: string, color: string) {
  ctx.fillStyle = color;
  ctx.font = `500 15px ${font}`;
  ctx.fillText(FOOTER, PADDING, SCREEN_HEIGHT - 16);
}

function drawScanlines(ctx: CanvasRenderingContext2D, time: number) {
  ctx.fillStyle = 'rgba(12, 12, 12, 0.14)';
  for (let y = 0; y < SCREEN_HEIGHT; y += 4) ctx.fillRect(0, y, SCREEN_WIDTH, 2);

  const bandY = ((time * 70) % (SCREEN_HEIGHT + 60)) - 60;
  ctx.fillStyle = 'rgba(244, 243, 237, 0.07)';
  ctx.fillRect(0, bandY, SCREEN_WIDTH, 60);
}

function drawTerminal(
  ctx: CanvasRenderingContext2D,
  font: string,
  lines: string[],
  typedChars: number,
  time: number
) {
  ctx.fillStyle = WEBGL_PALETTE.blue;
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.font = `500 22px ${font}`;
  ctx.fillStyle = '#FFFFFF';

  let remaining = typedChars;
  let cursorX = PADDING;
  let cursorY = PADDING + 22;

  lines.forEach((line, index) => {
    if (remaining <= 0) return;
    const text = line.slice(0, remaining);
    const y = PADDING + 22 + index * LINE_HEIGHT;
    ctx.fillText(text, PADDING, y);
    cursorX = PADDING + ctx.measureText(text).width + 4;
    cursorY = y;
    remaining -= line.length;
  });

  if (Math.floor(time * 2) % 2 === 0) ctx.fillRect(cursorX, cursorY - 18, 12, 22);
  drawFooter(ctx, font, WEBGL_PALETTE.yellow);
}

function drawBoar(ctx: CanvasRenderingContext2D, font: string, time: number) {
  ctx.fillStyle = WEBGL_PALETTE.yellow;
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  const originX = (SCREEN_WIDTH - SPRITE_WIDTH * BOAR_PIXEL) / 2;
  const originY = (SCREEN_HEIGHT - SPRITE_HEIGHT * BOAR_PIXEL) / 2 - 30;
  const legs = Math.floor(time * 5) % 2 === 0 ? BOAR_LEGS_DOWN : BOAR_LEGS_UP;

  for (const { x, y, color } of [...BOAR_BODY, ...legs]) {
    ctx.fillStyle = color;
    ctx.fillRect(originX + x * BOAR_PIXEL, originY + y * BOAR_PIXEL, BOAR_PIXEL, BOAR_PIXEL);
  }

  ctx.fillStyle = WEBGL_PALETTE.ink;
  ctx.font = `500 24px ${font}`;
  const label = 'OINK.EXE';
  ctx.fillText(label, (SCREEN_WIDTH - ctx.measureText(label).width) / 2, SCREEN_HEIGHT - 58);
  drawFooter(ctx, font, WEBGL_PALETTE.ink);
}

function drawCrash(ctx: CanvasRenderingContext2D, font: string) {
  ctx.fillStyle = WEBGL_PALETTE.ink;
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.fillStyle = WEBGL_PALETTE.yellow;
  ctx.font = `500 26px ${font}`;
  ctx.fillText('FATAL ERROR', PADDING, PADDING + 30);
  ctx.font = `500 21px ${font}`;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('COFFEE_NOT_FOUND', PADDING, PADDING + 76);
  ctx.fillText('STOP: 0x00C0FFEE', PADDING, PADDING + 106);
  ctx.fillText('PLEASE REFILL AND RETRY', PADDING, PADDING + 136);
  drawFooter(ctx, font, WEBGL_PALETTE.yellow);
}

export function drawScreen(
  ctx: CanvasRenderingContext2D,
  mode: ScreenMode,
  font: string,
  lines: string[],
  typedChars: number,
  time: number
) {
  if (mode === 'terminal') drawTerminal(ctx, font, lines, typedChars, time);
  else if (mode === 'boar') drawBoar(ctx, font, time);
  else drawCrash(ctx, font);

  drawScanlines(ctx, time);
}
