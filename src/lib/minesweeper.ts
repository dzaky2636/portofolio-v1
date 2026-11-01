export type MinesweeperLevel = 'easy' | 'medium' | 'hard';
export type MinesweeperStatus = 'ready' | 'playing' | 'won' | 'lost';
export type MinesweeperMark = 'hidden' | 'open' | 'flag';

export interface MinesweeperCell {
  mine: boolean;
  adjacent: number;
  mark: MinesweeperMark;
}

export interface MinesweeperPoint {
  x: number;
  y: number;
}

export interface MinesweeperState {
  level: MinesweeperLevel;
  cols: number;
  rows: number;
  mines: number;
  cells: MinesweeperCell[][];
  status: MinesweeperStatus;
  opened: number;
  flags: number;
  exploded: MinesweeperPoint | null;
}

export const MINESWEEPER_LEVELS: Record<
  MinesweeperLevel,
  { cols: number; rows: number; mines: number }
> = {
  easy: { cols: 9, rows: 9, mines: 10 },
  medium: { cols: 16, rows: 16, mines: 40 },
  hard: { cols: 24, rows: 16, mines: 70 },
};

export const MINESWEEPER_LEVEL_ORDER = Object.keys(MINESWEEPER_LEVELS) as MinesweeperLevel[];

function neighbors({ x, y }: MinesweeperPoint, cols: number, rows: number): MinesweeperPoint[] {
  const points: MinesweeperPoint[] = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      const next = { x: x + dx, y: y + dy };
      const inside = next.x >= 0 && next.y >= 0 && next.x < cols && next.y < rows;
      if ((dx !== 0 || dy !== 0) && inside) points.push(next);
    }
  }
  return points;
}

function copyCells(cells: MinesweeperCell[][]) {
  return cells.map((row) => row.map((cell) => ({ ...cell })));
}

export function createMinesweeper(level: MinesweeperLevel): MinesweeperState {
  const { cols, rows, mines } = MINESWEEPER_LEVELS[level];
  return {
    level,
    cols,
    rows,
    mines,
    cells: Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ mine: false, adjacent: 0, mark: 'hidden' as const }))
    ),
    status: 'ready',
    opened: 0,
    flags: 0,
    exploded: null,
  };
}

/** Laid on the first dig and kept off that cell and its neighbors, so it always opens a gap. */
function placeMines(
  state: MinesweeperState,
  first: MinesweeperPoint,
  random: () => number
): MinesweeperCell[][] {
  const { cols, rows, mines } = state;
  const cells = copyCells(state.cells);
  const safe = [first, ...neighbors(first, cols, rows)];
  const spots: MinesweeperPoint[] = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!safe.some((point) => point.x === x && point.y === y)) spots.push({ x, y });
    }
  }

  for (let placed = 0; placed < mines; placed += 1) {
    const pick = placed + Math.floor(random() * (spots.length - placed));
    [spots[placed], spots[pick]] = [spots[pick], spots[placed]];
    const { x, y } = spots[placed];
    cells[y][x].mine = true;
    for (const near of neighbors({ x, y }, cols, rows)) cells[near.y][near.x].adjacent += 1;
  }

  return cells;
}

function finishLost(state: MinesweeperState, exploded: MinesweeperPoint): MinesweeperState {
  const cells = copyCells(state.cells);
  for (const row of cells) {
    for (const cell of row) {
      if (cell.mine && cell.mark === 'hidden') cell.mark = 'open';
    }
  }
  return { ...state, cells, status: 'lost', exploded };
}

function finishWon(state: MinesweeperState): MinesweeperState {
  const cells = copyCells(state.cells);
  for (const row of cells) {
    for (const cell of row) {
      if (cell.mine) cell.mark = 'flag';
    }
  }
  return { ...state, cells, status: 'won', flags: state.mines };
}

export function reveal(
  state: MinesweeperState,
  point: MinesweeperPoint,
  random: () => number = Math.random
): MinesweeperState {
  if (state.status === 'won' || state.status === 'lost') return state;
  if (state.cells[point.y][point.x].mark !== 'hidden') return state;

  const started: MinesweeperState =
    state.status === 'ready'
      ? { ...state, cells: placeMines(state, point, random), status: 'playing' }
      : state;

  if (started.cells[point.y][point.x].mine) return finishLost(started, point);

  const cells = copyCells(started.cells);
  const queue = [point];
  let opened = started.opened;

  cells[point.y][point.x].mark = 'open';
  opened += 1;

  while (queue.length > 0) {
    const current = queue.pop() as MinesweeperPoint;
    if (cells[current.y][current.x].adjacent > 0) continue;

    for (const near of neighbors(current, started.cols, started.rows)) {
      const cell = cells[near.y][near.x];
      if (cell.mark !== 'hidden') continue;
      cell.mark = 'open';
      opened += 1;
      queue.push(near);
    }
  }

  const next = { ...started, cells, opened };
  return opened === next.cols * next.rows - next.mines ? finishWon(next) : next;
}

export function toggleFlag(state: MinesweeperState, { x, y }: MinesweeperPoint): MinesweeperState {
  if (state.status === 'won' || state.status === 'lost') return state;

  const { mark } = state.cells[y][x];
  if (mark === 'open') return state;

  const cells = copyCells(state.cells);
  cells[y][x].mark = mark === 'flag' ? 'hidden' : 'flag';
  return { ...state, cells, flags: state.flags + (mark === 'flag' ? -1 : 1) };
}

/** Digging an open number with enough flags around it clears the rest of its neighbors. */
export function chord(state: MinesweeperState, point: MinesweeperPoint): MinesweeperState {
  const cell = state.cells[point.y][point.x];
  if (state.status !== 'playing' || cell.mark !== 'open' || cell.adjacent === 0) return state;

  const around = neighbors(point, state.cols, state.rows);
  const flagged = around.filter(({ x, y }) => state.cells[y][x].mark === 'flag').length;
  if (flagged !== cell.adjacent) return state;

  return around.reduce((current, near) => reveal(current, near), state);
}
