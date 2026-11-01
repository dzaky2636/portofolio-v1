import * as THREE from 'three';
import { mulberry32 } from '@/components/webgl/osWindowLayout';
import { WEBGL_PALETTE } from '@/components/webgl/palette';

export type WindowContent = 'text' | 'hex' | 'chart' | 'table' | 'image' | 'dialog' | 'folders';

const TILE_WIDTH = 400;
const TILE_HEIGHT = 280;
const PIXELS_PER_UNIT = 130;
const MENU_HEIGHT = 18;
const DITHER_CELL = 3;

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

type Draw = (ctx: CanvasRenderingContext2D, rand: () => number) => void;

function drawMenuBar(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = WEBGL_PALETTE.ink;
  ctx.font = 'bold 11px monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText('File  Edit  View  Help', 8, MENU_HEIGHT / 2);
  ctx.fillRect(0, MENU_HEIGHT, TILE_WIDTH, 1);
}

const drawText: Draw = (ctx, rand) => {
  ctx.fillStyle = WEBGL_PALETTE.ink;
  for (let y = MENU_HEIGHT + 14; y < TILE_HEIGHT; y += rand() < 0.2 ? 24 : 12) {
    const end = 12 + (TILE_WIDTH - 44) * (0.55 + rand() * 0.45);
    let x = 12;
    while (x < end) {
      const word = 8 + rand() * 34;
      ctx.fillRect(x, y, word, 4);
      x += word + 6;
    }
  }
};

const drawHex: Draw = (ctx, rand) => {
  ctx.font = '11px monospace';
  ctx.textBaseline = 'top';
  for (let row = 0; row * 14 + MENU_HEIGHT + 8 < TILE_HEIGHT; row += 1) {
    const y = row * 14 + MENU_HEIGHT + 8;
    ctx.fillStyle = WEBGL_PALETTE.blue;
    ctx.fillText(`0x${(row * 16).toString(16).padStart(4, '0').toUpperCase()}`, 8, y);
    ctx.fillStyle = WEBGL_PALETTE.ink;
    const bytes = Array.from({ length: 8 }, () =>
      Math.floor(rand() * 256).toString(16).padStart(2, '0').toUpperCase()
    );
    ctx.fillText(bytes.join(' '), 62, y);
  }
};

const drawChart: Draw = (ctx, rand) => {
  const left = 16;
  const bottom = TILE_HEIGHT - 24;
  const top = MENU_HEIGHT + 16;

  ctx.fillStyle = WEBGL_PALETTE.grid;
  for (let y = top; y < bottom; y += 28) ctx.fillRect(left, y, TILE_WIDTH - 44, 1);

  const barCount = 16;
  const barWidth = (TILE_WIDTH - 44) / barCount;
  for (let bar = 0; bar < barCount; bar += 1) {
    const height = Math.ceil(rand() * 8) * 22;
    ctx.fillStyle = bar % 5 === 4 ? WEBGL_PALETTE.blue : WEBGL_PALETTE.ink;
    ctx.fillRect(left + bar * barWidth, bottom - height, barWidth - 4, height);
  }

  ctx.fillStyle = WEBGL_PALETTE.ink;
  ctx.fillRect(left, top, 2, bottom - top);
  ctx.fillRect(left, bottom, TILE_WIDTH - 44, 2);
};

const drawTable: Draw = (ctx, rand) => {
  const rowHeight = 20;
  const columns = [12, 118, 214, 300];
  const highlighted = 2 + Math.floor(rand() * 4);

  ctx.fillStyle = WEBGL_PALETTE.ink;
  ctx.fillRect(0, MENU_HEIGHT, TILE_WIDTH, rowHeight);

  for (let row = 1; row * rowHeight + MENU_HEIGHT < TILE_HEIGHT; row += 1) {
    const y = row * rowHeight + MENU_HEIGHT;
    if (row === highlighted) {
      ctx.fillStyle = WEBGL_PALETTE.yellow;
      ctx.fillRect(0, y, TILE_WIDTH, rowHeight);
    }
    ctx.fillStyle = WEBGL_PALETTE.grid;
    ctx.fillRect(0, y + rowHeight - 1, TILE_WIDTH, 1);
    ctx.fillStyle = WEBGL_PALETTE.ink;
    for (const x of columns) ctx.fillRect(x, y + 8, 22 + rand() * 54, 4);
  }

  ctx.fillStyle = WEBGL_PALETTE.grid;
  for (const x of columns.slice(1)) ctx.fillRect(x - 8, MENU_HEIGHT, 1, TILE_HEIGHT);
};

const drawImage: Draw = (ctx) => {
  const horizon = 196;
  const sun = { x: 250, y: 106, radius: 68 };

  ctx.fillStyle = WEBGL_PALETTE.ink;
  for (let y = MENU_HEIGHT + 1; y < TILE_HEIGHT; y += DITHER_CELL) {
    for (let x = 0; x < TILE_WIDTH; x += DITHER_CELL) {
      const distance = Math.hypot(x - sun.x, y - sun.y);
      const shade =
        distance < sun.radius
          ? 0.2 + ((x - sun.x + (y - sun.y)) / sun.radius + 1.4) * 0.3
          : y > horizon
            ? 0.3 + ((y - horizon) / (TILE_HEIGHT - horizon)) * 0.55
            : 0.06;
      const cellX = Math.floor(x / DITHER_CELL) % 4;
      const cellY = Math.floor(y / DITHER_CELL) % 4;
      if (shade > (BAYER_4X4[cellY][cellX] + 0.5) / 16) ctx.fillRect(x, y, DITHER_CELL, DITHER_CELL);
    }
  }
};

const drawDialog: Draw = (ctx) => {
  ctx.fillStyle = WEBGL_PALETTE.yellow;
  ctx.strokeStyle = WEBGL_PALETTE.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, MENU_HEIGHT + 14);
  ctx.lineTo(68, MENU_HEIGHT + 62);
  ctx.lineTo(12, MENU_HEIGHT + 62);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = WEBGL_PALETTE.ink;
  ctx.font = 'bold 26px monospace';
  ctx.textBaseline = 'top';
  ctx.fillText('!', 33, MENU_HEIGHT + 30);

  ctx.font = 'bold 13px monospace';
  ctx.fillText('A FATAL EXCEPTION', 84, MENU_HEIGHT + 18);
  ctx.fillText('HAS OCCURRED AT', 84, MENU_HEIGHT + 36);
  ctx.fillText('0x0C0C0C.', 84, MENU_HEIGHT + 54);

  for (const [x, label] of [
    [84, 'OK'],
    [176, 'RETRY'],
  ] as const) {
    ctx.fillStyle = WEBGL_PALETTE.ink;
    ctx.fillRect(x + 4, MENU_HEIGHT + 90, 78, 30);
    ctx.fillStyle = WEBGL_PALETTE.paper;
    ctx.fillRect(x, MENU_HEIGHT + 86, 78, 30);
    ctx.strokeRect(x, MENU_HEIGHT + 86, 78, 30);
    ctx.fillStyle = WEBGL_PALETTE.ink;
    ctx.fillText(label, x + 39 - label.length * 4, MENU_HEIGHT + 94);
  }
};

const drawFolders: Draw = (ctx, rand) => {
  ctx.lineWidth = 2;
  ctx.strokeStyle = WEBGL_PALETTE.ink;
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 5; column += 1) {
      const x = 16 + column * 74;
      const y = MENU_HEIGHT + 16 + row * 80;
      ctx.fillStyle = rand() < 0.2 ? WEBGL_PALETTE.yellow : WEBGL_PALETTE.paper;
      ctx.fillRect(x, y, 22, 8);
      ctx.strokeRect(x, y, 22, 8);
      ctx.fillRect(x, y + 8, 50, 34);
      ctx.strokeRect(x, y + 8, 50, 34);
      ctx.fillStyle = WEBGL_PALETTE.ink;
      ctx.fillRect(x + 2, y + 50, 26 + rand() * 20, 4);
    }
  }
};

const DRAWERS: Record<WindowContent, Draw> = {
  text: drawText,
  hex: drawHex,
  chart: drawChart,
  table: drawTable,
  image: drawImage,
  dialog: drawDialog,
  folders: drawFolders,
};

const textureCache = new Map<WindowContent, THREE.CanvasTexture>();

/** One texture per content kind, shared by every window for the life of the page. */
export function getWindowContentTexture(content: WindowContent): THREE.CanvasTexture {
  const cached = textureCache.get(content);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = TILE_WIDTH;
  canvas.height = TILE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    DRAWERS[content](ctx, mulberry32(content.length * 0x1f3d));
    drawMenuBar(ctx);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  textureCache.set(content, texture);
  return texture;
}

/** Share of the tile a window shows, so small windows crop content instead of squashing it. */
export function getContentUvScale(bodyW: number, bodyH: number): [number, number] {
  const tileW = TILE_WIDTH / PIXELS_PER_UNIT;
  const tileH = TILE_HEIGHT / PIXELS_PER_UNIT;
  const fit = Math.max(1, bodyW / tileW, bodyH / tileH);
  return [bodyW / (tileW * fit), bodyH / (tileH * fit)];
}
