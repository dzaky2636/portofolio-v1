/** Side-view boar in the /public/boar.svg palette; one character per pixel. */
const PALETTE: Record<string, string> = {
  K: '#1a120a',
  B: '#4a3728',
  M: '#5c4433',
  L: '#6b4f35',
  D: '#3d2e20',
  E: '#ff3333',
  T: '#f5f0e0',
};

const BODY = [
  '........K.K.K.......',
  '......KMMMMMMK..M...',
  '....MMMMMMMMMMMMMM..',
  '...MMBMMMMMMMMMMEMM.',
  '..MMBBMMMMMMMMMMMMLL',
  'K.MBBBMMMMMMMMMMLLDD',
  '.KMBBBBMMMMMMMMLLLDK',
  '..MBBBBBMMMMMMMLLTDD',
  '..MBBBBBBBBBBBBB.T..',
  '...BBBBBBBBBBBB.....',
];

const LEGS_DOWN = ['...BB.BB....BB.BB...', '...DD..DD..DD..DD...'];
const LEGS_UP = ['....BB.BB..BB.BB....', '....DD.DD...DD.DD...'];

export const SPRITE_WIDTH = 20;
export const SPRITE_HEIGHT = BODY.length + LEGS_DOWN.length;

export interface SpritePixel {
  x: number;
  y: number;
  color: string;
}

function toPixels(rows: string[], offsetY: number): SpritePixel[] {
  return rows.flatMap((row, y) =>
    [...row].flatMap((char, x) =>
      PALETTE[char] ? [{ x, y: y + offsetY, color: PALETTE[char] }] : []
    )
  );
}

export const BOAR_BODY = toPixels(BODY, 0);
export const BOAR_LEGS_DOWN = toPixels(LEGS_DOWN, BODY.length);
export const BOAR_LEGS_UP = toPixels(LEGS_UP, BODY.length);
