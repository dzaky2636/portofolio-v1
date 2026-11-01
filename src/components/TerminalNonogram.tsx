'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import {
  NONOGRAM_PUZZLES,
  boardClues,
  createBoard,
  createRandomPuzzle,
  isSolved,
  puzzleClues,
  readSolved,
  saveSolved,
  sameClue,
  type NonogramCell,
  type NonogramPuzzle,
} from '@/lib/nonogram';
import {
  playGameWin,
  playNonogramClear,
  playNonogramFill,
  playNonogramLine,
  playNonogramMark,
} from '@/lib/gameSounds';
import { RANDOM_SIZES, type RandomSize } from '@/lib/nonogramSizes';
import type { TerminalNonogramLabels } from '@/lib/terminalCommands';

const CLUE_DONE = 'text-[#F4F3ED]/30';
const CLUE_OPEN = 'text-[#FFD700]';

function firstUnsolvedIndex(solved: string[]) {
  const index = NONOGRAM_PUZZLES.findIndex((puzzle) => !solved.includes(puzzle.id));
  return index === -1 ? 0 : index;
}

function cellClass(cell: NonogramCell) {
  if (cell === 'filled') return 'bg-[#F4F3ED]';
  return cell === 'marked' ? 'bg-[#0C0C0C] text-[#F4F3ED]/50' : 'bg-[#0C0C0C]';
}

function playCellSound(cell: NonogramCell) {
  if (cell === 'filled') playNonogramFill();
  else if (cell === 'marked') playNonogramMark();
  else playNonogramClear();
}

export default function TerminalNonogram({
  labels,
  startRandomSize,
  onExit,
}: {
  labels: TerminalNonogramLabels;
  startRandomSize: RandomSize | null;
  onExit: (message: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const paintRef = useRef<NonogramCell | null>(null);
  const lineProgressRef = useRef<{ puzzle: NonogramPuzzle; done: number } | null>(null);
  const [savedIds, setSavedIds] = useState(readSolved);
  const [puzzleIndex, setPuzzleIndex] = useState(() => firstUnsolvedIndex(savedIds));
  const [randomPuzzle, setRandomPuzzle] = useState<NonogramPuzzle | null>(() =>
    startRandomSize ? createRandomPuzzle(startRandomSize) : null
  );
  const [randomSize, setRandomSize] = useState<RandomSize>(startRandomSize ?? 10);
  const [randomWins, setRandomWins] = useState(0);
  const [board, setBoard] = useState(() =>
    createBoard(randomPuzzle ?? NONOGRAM_PUZZLES[puzzleIndex])
  );
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const puzzle = randomPuzzle ?? NONOGRAM_PUZZLES[puzzleIndex];
  const isRandom = randomPuzzle !== null;
  const width = puzzle.rows[0].length;
  const height = puzzle.rows.length;
  const target = puzzleClues(puzzle);
  const current = boardClues(board);
  const solved = isSolved(board, puzzle);
  const solvedCount = new Set(solved ? [...savedIds, puzzle.id] : savedIds).size;
  const randomCount = randomWins + (isRandom && solved ? 1 : 0);
  const doneLines =
    target.rows.filter((clue, y) => sameClue(clue, current.rows[y])).length +
    target.cols.filter((clue, x) => sameClue(clue, current.cols[x])).length;

  const loadPuzzle = useCallback((index: number) => {
    setSavedIds(readSolved());
    setRandomPuzzle(null);
    setPuzzleIndex(index);
    setBoard(createBoard(NONOGRAM_PUZZLES[index]));
    setCursor({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  const startRandom = useCallback((size: RandomSize) => {
    const next = createRandomPuzzle(size);
    setRandomSize(size);
    setRandomPuzzle(next);
    setBoard(createBoard(next));
    setCursor({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (isRandom || !solved) return;
    const ids = readSolved();
    if (!ids.includes(puzzle.id)) saveSolved([...ids, puzzle.id]);
  }, [isRandom, puzzle.id, solved]);

  useEffect(() => {
    if (solved) playGameWin();
  }, [solved]);

  useEffect(() => {
    const previous = lineProgressRef.current;
    if (previous?.puzzle === puzzle && doneLines > previous.done && !solved) playNonogramLine();
    lineProgressRef.current = { puzzle, done: doneLines };
  }, [doneLines, puzzle, solved]);

  const setCell = useCallback((x: number, y: number, value: NonogramCell) => {
    setBoard((rows) =>
      rows.map((row, rowIndex) =>
        rowIndex === y ? row.map((cell, cellIndex) => (cellIndex === x ? value : cell)) : row
      )
    );
  }, []);

  const toggleAt = useCallback(
    (x: number, y: number, value: NonogramCell) => {
      setBoard((rows) =>
        rows.map((row, rowIndex) =>
          rowIndex === y
            ? row.map((cell, cellIndex) =>
                cellIndex === x ? (cell === value ? 'empty' : value) : cell
              )
            : row
        )
      );
    },
    []
  );

  const nextPuzzle = useCallback(() => {
    if (!isRandom) {
      loadPuzzle((puzzleIndex + 1) % NONOGRAM_PUZZLES.length);
      return;
    }
    if (solved) setRandomWins((wins) => wins + 1);
    startRandom(randomSize);
  }, [isRandom, loadPuzzle, puzzleIndex, randomSize, solved, startRandom]);

  const resetBoard = useCallback(() => {
    setBoard(createBoard(puzzle));
    setCursor({ x: 0, y: 0 });
  }, [puzzle]);

  const switchMode = useCallback(() => {
    if (!isRandom) {
      startRandom(randomSize);
      return;
    }
    if (solved) setRandomWins((wins) => wins + 1);
    loadPuzzle(firstUnsolvedIndex(readSolved()));
  }, [isRandom, loadPuzzle, randomSize, solved, startRandom]);

  const changeSize = useCallback(() => {
    if (!isRandom) return;
    if (solved) setRandomWins((wins) => wins + 1);
    startRandom(RANDOM_SIZES[(RANDOM_SIZES.indexOf(randomSize) + 1) % RANDOM_SIZES.length]);
  }, [isRandom, randomSize, solved, startRandom]);

  const exit = useCallback(() => {
    onExit(
      isRandom
        ? labels.randomResult.replace('{n}', String(randomCount))
        : labels.result
            .replace('{solved}', String(solvedCount))
            .replace('{total}', String(NONOGRAM_PUZZLES.length))
    );
  }, [isRandom, labels.randomResult, labels.result, onExit, randomCount, solvedCount]);

  useEffect(() => {
    const move = (dx: number, dy: number) => {
      setCursor(({ x, y }) => ({
        x: Math.min(Math.max(x + dx, 0), width - 1),
        y: Math.min(Math.max(y + dy, 0), height - 1),
      }));
    };

    const toggleCursorCell = (value: NonogramCell) => {
      if (solved) return;
      playCellSound(board[cursor.y][cursor.x] === value ? 'empty' : value);
      toggleAt(cursor.x, cursor.y, value);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      let handled = true;

      if (key === 'arrowup' || key === 'w') move(0, -1);
      else if (key === 'arrowdown' || key === 's') move(0, 1);
      else if (key === 'arrowleft' || key === 'a') move(-1, 0);
      else if (key === 'arrowright' || key === 'd') move(1, 0);
      else if (key === ' ' || key === 'enter') toggleCursorCell('filled');
      else if (key === 'x') toggleCursorCell('marked');
      else if (key === 'n') nextPuzzle();
      else if (key === 'r') resetBoard();
      else if (key === 'g') switchMode();
      else if (key === 'z') changeSize();
      else if (key === 'escape' || key === 'q' || key === '`' || key === '~') exit();
      else handled = false;

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [board, changeSize, cursor, exit, height, nextPuzzle, resetBoard, solved, switchMode, toggleAt, width]);

  useEffect(() => {
    const endPaint = () => {
      paintRef.current = null;
    };
    window.addEventListener('pointerup', endPaint);
    return () => window.removeEventListener('pointerup', endPaint);
  }, []);

  const handleCellDown = (event: PointerEvent<HTMLButtonElement>, x: number, y: number) => {
    event.preventDefault();
    setCursor({ x, y });
    if (solved) return;

    const cell = board[y][x];
    if (event.pointerType === 'touch') {
      const next = cell === 'empty' ? 'filled' : cell === 'filled' ? 'marked' : 'empty';
      playCellSound(next);
      setCell(x, y, next);
      return;
    }

    const stroke: NonogramCell = event.button === 2 ? 'marked' : 'filled';
    const value = cell === stroke ? 'empty' : stroke;
    paintRef.current = value;
    playCellSound(value);
    setCell(x, y, value);
  };

  const handleCellEnter = (x: number, y: number) => {
    if (!paintRef.current || solved) return;
    if (board[y][x] !== paintRef.current) playCellSound(paintRef.current);
    setCell(x, y, paintRef.current);
  };

  const gridStyle: CSSProperties = {
    gridTemplateColumns: `auto repeat(${width}, clamp(18px, calc((100vw - 96px) / ${width}), 30px))`,
  };

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto px-4 py-3 outline-none"
    >
      <div className="flex w-full max-w-[448px] justify-between gap-2 text-xs uppercase tracking-widest text-[#FFD700]">
        <span>
          {isRandom
            ? labels.randomHeader.replace(/\{size\}/g, String(height))
            : labels.puzzle
                .replace('{n}', String(puzzleIndex + 1))
                .replace('{total}', String(NONOGRAM_PUZZLES.length))}
        </span>
        <span>
          {isRandom
            ? labels.randomCount.replace('{n}', String(randomCount))
            : labels.solvedCount
                .replace('{n}', String(solvedCount))
                .replace('{total}', String(NONOGRAM_PUZZLES.length))}
        </span>
      </div>

      <div
        role="group"
        aria-label={labels.aria}
        className="grid touch-none select-none text-[10px] leading-3"
        style={gridStyle}
        onContextMenu={(event) => event.preventDefault()}
      >
        <div />
        {target.cols.map((clue, x) => (
          <div
            key={`col-${x}`}
            className={`flex flex-col items-center justify-end pb-1 ${
              sameClue(clue, current.cols[x]) ? CLUE_DONE : CLUE_OPEN
            }`}
          >
            {clue.map((run, index) => (
              <span key={index}>{run}</span>
            ))}
          </div>
        ))}

        {board.map((row, y) => (
          <div key={`row-${y}`} className="contents">
            <div
              className={`flex items-center justify-end gap-1 pr-1.5 ${
                sameClue(target.rows[y], current.rows[y]) ? CLUE_DONE : CLUE_OPEN
              }`}
            >
              {target.rows[y].map((run, index) => (
                <span key={index}>{run}</span>
              ))}
            </div>
            {row.map((cell, x) => (
              <button
                key={x}
                type="button"
                tabIndex={-1}
                aria-label={`${y + 1}, ${x + 1}: ${labels.cells[cell]}`}
                onPointerDown={(event) => handleCellDown(event, x, y)}
                onPointerEnter={() => handleCellEnter(x, y)}
                className={`flex aspect-square items-center justify-center border border-[#F4F3ED]/25 ${cellClass(cell)} ${
                  (x + 1) % 5 === 0 && x + 1 < width ? 'border-r-[#F4F3ED]' : ''
                } ${(y + 1) % 5 === 0 && y + 1 < height ? 'border-b-[#F4F3ED]' : ''} ${
                  cursor.x === x && cursor.y === y && !solved
                    ? 'relative z-10 outline outline-2 outline-[#FFD700]'
                    : ''
                }`}
              >
                {cell === 'marked' ? 'x' : ''}
              </button>
            ))}
          </div>
        ))}
      </div>

      <p className="w-full max-w-[448px] text-xs text-[#F4F3ED]">
        {!solved
          ? labels.controls
          : isRandom
            ? labels.randomSolved
            : labels.solved.replace('{name}', labels.names[puzzle.id])}
      </p>

      <div className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-widest text-[#F4F3ED]">
        <button
          type="button"
          onClick={nextPuzzle}
          className="border-2 border-[#F4F3ED] px-2 py-0.5 hover:bg-[#2945FF] retro-focus"
        >
          {labels.next}
        </button>
        <button
          type="button"
          onClick={resetBoard}
          className="border-2 border-[#F4F3ED] px-2 py-0.5 hover:bg-[#2945FF] retro-focus"
        >
          {labels.reset}
        </button>
        <button
          type="button"
          onClick={switchMode}
          className="border-2 border-[#F4F3ED] px-2 py-0.5 hover:bg-[#2945FF] retro-focus"
        >
          {isRandom ? labels.picturesButton : labels.randomButton}
        </button>
        {isRandom && (
          <button
            type="button"
            onClick={changeSize}
            className="border-2 border-[#F4F3ED] px-2 py-0.5 hover:bg-[#2945FF] retro-focus"
          >
            {labels.sizeButton}
          </button>
        )}
        <button
          type="button"
          onClick={exit}
          className="border-2 border-[#F4F3ED] px-2 py-0.5 hover:bg-[#2945FF] retro-focus"
        >
          {labels.quit}
        </button>
      </div>
    </div>
  );
}
