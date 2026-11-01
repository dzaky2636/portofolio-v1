export type NonogramCell = 'empty' | 'filled' | 'marked';

export type NonogramPuzzleId =
  | 'random'
  | 'heart'
  | 'house'
  | 'arrow'
  | 'cursor'
  | 'gem'
  | 'invader'
  | 'gamepad'
  | 'crown'
  | 'fish'
  | 'ship'
  | 'lock'
  | 'lightning'
  | 'tree'
  | 'star'
  | 'umbrella'
  | 'ghost'
  | 'skull'
  | 'cat'
  | 'mushroom'
  | 'potion'
  | 'bomb'
  | 'flag'
  | 'music'
  | 'floppy'
  | 'coffee'
  | 'terminal'
  | 'boar';

export interface NonogramPuzzle {
  id: NonogramPuzzleId;
  rows: string[];
}

/** Solvable by line logic alone, so no guessing; re-check with a solver after editing. */
export const NONOGRAM_PUZZLES: NonogramPuzzle[] = [
  { id: 'heart', rows: ['.#.#.', '#####', '#####', '.###.', '..#..'] },
  { id: 'house', rows: ['..#..', '.###.', '#####', '.#.#.', '.###.'] },
  { id: 'arrow', rows: ['..#..', '.###.', '#.#.#', '..#..', '..#..'] },
  {
    id: 'cursor',
    rows: [
      '#.......',
      '##......',
      '###.....',
      '####....',
      '#####...',
      '######..',
      '##.##...',
      '#...##..',
    ],
  },
  {
    id: 'gem',
    rows: [
      '..######..',
      '.########.',
      '##########',
      '.########.',
      '..######..',
      '...####...',
      '....##....',
    ],
  },
  {
    id: 'invader',
    rows: [
      '..#....#..',
      '...#..#...',
      '..######..',
      '.##.##.##.',
      '##########',
      '#.######.#',
      '#.#....#.#',
      '..##..##..',
    ],
  },
  {
    id: 'gamepad',
    rows: [
      '.########.',
      '##########',
      '##.####.##',
      '#...##.#.#',
      '##.####.##',
      '##########',
      '###....###',
      '##......##',
    ],
  },
  {
    id: 'crown',
    rows: [
      '#...##...#',
      '#...##...#',
      '##.####.##',
      '##.####.##',
      '##########',
      '##########',
      '#.#.##.#.#',
      '##########',
      '##########',
    ],
  },
  {
    id: 'fish',
    rows: [
      '....###...',
      '..######..',
      '#.#.#####.',
      '#########.',
      '##########',
      '#########.',
      '#.######..',
      '..######..',
      '....###...',
    ],
  },
  {
    id: 'ship',
    rows: [
      '....#.....',
      '....##....',
      '....###...',
      '....####..',
      '....#####.',
      '....#.....',
      '#########.',
      '.#######..',
      '..#####...',
    ],
  },
  {
    id: 'lock',
    rows: [
      '...####...',
      '..#....#..',
      '..#....#..',
      '.########.',
      '.###..###.',
      '.###..###.',
      '.####.###.',
      '.########.',
      '.########.',
    ],
  },
  {
    id: 'lightning',
    rows: [
      '.....###..',
      '....###...',
      '...###....',
      '..###.....',
      '.#######..',
      '.....###..',
      '....###...',
      '...###....',
      '..###.....',
      '.##.......',
    ],
  },
  {
    id: 'tree',
    rows: [
      '....##....',
      '...####...',
      '..######..',
      '...####...',
      '..######..',
      '.########.',
      '..######..',
      '.########.',
      '##########',
      '....##....',
    ],
  },
  {
    id: 'star',
    rows: [
      '....##....',
      '....##....',
      '...####...',
      '##########',
      '.########.',
      '..######..',
      '..######..',
      '.###..###.',
      '.##....##.',
      '##......##',
    ],
  },
  {
    id: 'umbrella',
    rows: [
      '....##....',
      '..######..',
      '.########.',
      '##########',
      '#.#.##.#.#',
      '....##....',
      '....##....',
      '....##....',
      '.#..##....',
      '..###.....',
    ],
  },
  {
    id: 'ghost',
    rows: [
      '...####...',
      '..######..',
      '.########.',
      '.#..##..#.',
      '.#..##..#.',
      '.########.',
      '.########.',
      '.########.',
      '.##.##.##.',
      '.#..##..#.',
    ],
  },
  {
    id: 'skull',
    rows: [
      '..######..',
      '.########.',
      '##########',
      '#..####..#',
      '#..####..#',
      '.########.',
      '...####...',
      '..#.##.#..',
      '..#.##.#..',
      '...####...',
    ],
  },
  {
    id: 'cat',
    rows: [
      '#........#',
      '##......##',
      '###.##.###',
      '##########',
      '#.##..##.#',
      '#.##..##.#',
      '##########',
      '###.##.###',
      '.########.',
      '..######..',
    ],
  },
  {
    id: 'mushroom',
    rows: [
      '...####...',
      '..#.##.#..',
      '.##.##.##.',
      '##########',
      '#.##..##.#',
      '##########',
      '...####...',
      '...#..#...',
      '...#..#...',
      '...####...',
    ],
  },
  {
    id: 'potion',
    rows: [
      '...####...',
      '....##....',
      '....##....',
      '...####...',
      '..######..',
      '.#......#.',
      '##########',
      '##########',
      '.########.',
      '..######..',
    ],
  },
  {
    id: 'bomb',
    rows: [
      '.......##.',
      '......#...',
      '...####...',
      '..######..',
      '.########.',
      '.########.',
      '.########.',
      '.########.',
      '..######..',
      '...####...',
    ],
  },
  {
    id: 'flag',
    rows: [
      '#.........',
      '########..',
      '#.#######.',
      '########..',
      '#.######..',
      '#.........',
      '#.........',
      '#.........',
      '#.........',
      '###.......',
    ],
  },
  {
    id: 'music',
    rows: [
      '...#######',
      '...#######',
      '...#.....#',
      '...#.....#',
      '...#.....#',
      '...#.....#',
      '.###...###',
      '####..####',
      '####..####',
      '.##....##.',
    ],
  },
  {
    id: 'floppy',
    rows: [
      '#########.',
      '#.#....#.#',
      '##.....#.#',
      '#......#.#',
      '##########',
      '##########',
      '##......##',
      '##.##...##',
      '##.##...##',
      '##########',
    ],
  },
  {
    id: 'coffee',
    rows: [
      '..#...#...',
      '...#...#..',
      '..#...#...',
      '..........',
      '########..',
      '########.#',
      '########.#',
      '#########.',
      '########..',
      '.######...',
    ],
  },
  {
    id: 'terminal',
    rows: [
      '##########',
      '#.########',
      '##.#######',
      '###.######',
      '##.#######',
      '#.####..##',
      '##########',
      '##########',
      '...####...',
      '..######..',
    ],
  },
  {
    id: 'boar',
    rows: [
      '..#....#..',
      '.##.##.##.',
      '.########.',
      '##.####.##',
      '##########',
      '.########.',
      '.##.##.##.',
      '.########.',
      '#.######.#',
      '#..####..#',
    ],
  },
];

const PROGRESS_KEY = 'dzaky-corner-nonogram-solved';
const RANDOM_FILL_MIN = 0.55;
const RANDOM_FILL_MAX = 0.7;
const RANDOM_MAX_ATTEMPTS = 2000;

export const RANDOM_SIZES = [5, 8, 10] as const;
export type RandomSize = (typeof RANDOM_SIZES)[number];

export function lineClue(line: boolean[]): number[] {
  const runs: number[] = [];
  let run = 0;
  for (const filled of line) {
    if (filled) {
      run += 1;
    } else if (run > 0) {
      runs.push(run);
      run = 0;
    }
  }
  if (run > 0) runs.push(run);
  return runs;
}

function columns<T>(grid: T[][]): T[][] {
  return grid[0].map((_, x) => grid.map((row) => row[x]));
}

export function puzzleClues(puzzle: NonogramPuzzle) {
  const grid = puzzle.rows.map((row) => [...row].map((char) => char === '#'));
  return { rows: grid.map(lineClue), cols: columns(grid).map(lineClue) };
}

export function createBoard(puzzle: NonogramPuzzle): NonogramCell[][] {
  return puzzle.rows.map((row) => [...row].map(() => 'empty'));
}

export function boardClues(board: NonogramCell[][]) {
  const grid = board.map((row) => row.map((cell) => cell === 'filled'));
  return { rows: grid.map(lineClue), cols: columns(grid).map(lineClue) };
}

export function sameClue(a: number[], b: number[]) {
  return a.length === b.length && a.every((run, index) => run === b[index]);
}

export function isSolved(board: NonogramCell[][], puzzle: NonogramPuzzle) {
  const target = puzzleClues(puzzle);
  const current = boardClues(board);
  return (
    target.rows.every((clue, index) => sameClue(clue, current.rows[index])) &&
    target.cols.every((clue, index) => sameClue(clue, current.cols[index]))
  );
}

/** Every line of `size` cells that matches `clue`, as filled flags. */
function linePatterns(size: number, clue: number[]): boolean[][] {
  if (clue.length === 0) return [Array<boolean>(size).fill(false)];

  const [run, ...rest] = clue;
  const needed = rest.reduce((sum, value) => sum + value + 1, 0);
  const patterns: boolean[][] = [];

  for (let start = 0; start + run + needed <= size; start += 1) {
    const head = Array.from({ length: start + run }, (_, index) => index >= start);
    if (rest.length === 0) {
      patterns.push([...head, ...Array<boolean>(size - head.length).fill(false)]);
      continue;
    }
    const tailSize = size - head.length - 1;
    for (const tail of linePatterns(tailSize, rest)) patterns.push([...head, false, ...tail]);
  }

  return patterns;
}

/** True when line-by-line deduction finishes the board, so a player never has to guess. */
export function solvableByLogic(rowClues: number[][], colClues: number[][]) {
  const height = rowClues.length;
  const width = colClues.length;
  const grid: (boolean | null)[][] = rowClues.map(() => Array<boolean | null>(width).fill(null));
  const rowOptions = rowClues.map((clue) => linePatterns(width, clue));
  const colOptions = colClues.map((clue) => linePatterns(height, clue));
  let changed = true;

  const settle = (
    options: boolean[][],
    length: number,
    read: (index: number) => boolean | null,
    write: (index: number, value: boolean) => void
  ) => {
    const left = options.filter((pattern) =>
      pattern.every((filled, index) => read(index) === null || read(index) === filled)
    );
    for (let index = 0; index < length && left.length > 0; index += 1) {
      if (read(index) !== null) continue;
      const first = left[0][index];
      if (left.every((pattern) => pattern[index] === first)) {
        write(index, first);
        changed = true;
      }
    }
    return left;
  };

  while (changed) {
    changed = false;
    for (let y = 0; y < height; y += 1) {
      rowOptions[y] = settle(
        rowOptions[y],
        width,
        (x) => grid[y][x],
        (x, value) => {
          grid[y][x] = value;
        }
      );
    }
    for (let x = 0; x < width; x += 1) {
      colOptions[x] = settle(
        colOptions[x],
        height,
        (y) => grid[y][x],
        (y, value) => {
          grid[y][x] = value;
        }
      );
    }
  }

  return grid.every((row) => row.every((cell) => cell !== null));
}

/** Random pixels, redrawn until the clues can be solved without guessing. */
export function createRandomPuzzle(
  size: RandomSize,
  random: () => number = Math.random
): NonogramPuzzle {
  for (let attempt = 0; attempt < RANDOM_MAX_ATTEMPTS; attempt += 1) {
    const fill = RANDOM_FILL_MIN + random() * (RANDOM_FILL_MAX - RANDOM_FILL_MIN);
    const rows = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => (random() < fill ? '#' : '.')).join('')
    );
    const puzzle: NonogramPuzzle = { id: 'random', rows };
    const clues = puzzleClues(puzzle);
    const blank = clues.rows.some((clue) => clue.length === 0);
    if (!blank && solvableByLogic(clues.rows, clues.cols)) return puzzle;
  }

  return NONOGRAM_PUZZLES[0];
}

export function readSolved(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]');
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function saveSolved(ids: string[]) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(ids));
  } catch {
    /* progress just won't survive a reload */
  }
}
