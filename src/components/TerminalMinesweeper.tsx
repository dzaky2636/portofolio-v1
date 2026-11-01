'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import {
  playGameWin,
  playMinesweeperBoom,
  playMinesweeperFlag,
  playMinesweeperReveal,
  playMinesweeperUnflag,
} from '@/lib/gameSounds';
import {
  MINESWEEPER_LEVEL_ORDER,
  chord,
  createMinesweeper,
  reveal,
  toggleFlag,
  type MinesweeperCell,
  type MinesweeperLevel,
  type MinesweeperPoint,
  type MinesweeperState,
} from '@/lib/minesweeper';
import type { TerminalMinesweeperLabels } from '@/lib/terminalCommands';

const BEST_TIMES_KEY = 'dzaky-corner-minesweeper-best';
const MAX_CELL_PX = 30;

const NUMBER_CLASS: Record<number, string> = {
  1: 'text-[#2945FF]',
  3: 'text-[#D11A1A]',
};

type BestTimes = Partial<Record<MinesweeperLevel, number>>;

function readBestTimes(): BestTimes {
  try {
    return JSON.parse(localStorage.getItem(BEST_TIMES_KEY) ?? '{}') as BestTimes;
  } catch {
    return {};
  }
}

function saveBestTimes(times: BestTimes) {
  try {
    localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(times));
  } catch {
    /* best times just won't survive a reload */
  }
}

function cellClass(cell: MinesweeperCell, status: MinesweeperState['status'], exploded: boolean) {
  if (exploded) return 'bg-[#FF3333] text-[#0C0C0C]';
  if (cell.mark === 'open') {
    return `bg-[#F4F3ED] border-[#0C0C0C]/15 ${
      cell.mine ? 'text-[#0C0C0C]' : (NUMBER_CLASS[cell.adjacent] ?? 'text-[#0C0C0C]')
    }`;
  }
  if (cell.mark === 'flag') {
    return status === 'lost' && !cell.mine
      ? 'bg-[#1C1C1C] text-[#FF6B6B]'
      : 'bg-[#1C1C1C] text-[#FFD700]';
  }
  return status === 'playing' || status === 'ready'
    ? 'bg-[#1C1C1C] hover:bg-[#2945FF]'
    : 'bg-[#1C1C1C]';
}

function cellText(cell: MinesweeperCell, status: MinesweeperState['status']) {
  if (cell.mark === 'flag') return status === 'lost' && !cell.mine ? 'x' : 'F';
  if (cell.mark !== 'open') return '';
  if (cell.mine) return '*';
  return cell.adjacent > 0 ? String(cell.adjacent) : '';
}

export default function TerminalMinesweeper({
  labels,
  startLevel,
  onExit,
}: {
  labels: TerminalMinesweeperLabels;
  startLevel: MinesweeperLevel;
  onExit: (message: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const startedAtRef = useRef(0);
  const clearedRef = useRef(0);
  const [game, setGame] = useState(() => createMinesweeper(startLevel));
  const gameRef = useRef(game);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [seconds, setSeconds] = useState(0);
  const [bestTimes, setBestTimes] = useState(readBestTimes);
  const [tapFlags, setTapFlags] = useState(false);

  const { cols, rows, status } = game;
  const finished = status === 'won' || status === 'lost';

  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  const start = useCallback((level: MinesweeperLevel) => {
    const next = createMinesweeper(level);
    gameRef.current = next;
    setGame(next);
    setSeconds(0);
    setCursor({ x: 0, y: 0 });
  }, []);

  const recordWin = useCallback((level: MinesweeperLevel) => {
    const time = Math.max(1, Math.floor((performance.now() - startedAtRef.current) / 1000));
    clearedRef.current += 1;
    setSeconds(time);
    setBestTimes((current) => {
      const best = current[level];
      if (best !== undefined && best <= time) return current;
      const next = { ...current, [level]: time };
      saveBestTimes(next);
      return next;
    });
  }, []);

  const apply = useCallback(
    (update: (state: MinesweeperState) => MinesweeperState) => {
      const before = gameRef.current;
      const next = update(before);
      if (next === before) return;

      gameRef.current = next;
      setGame(next);
      if (before.status === 'ready' && next.status !== 'ready') {
        startedAtRef.current = performance.now();
      }

      if (next.status === 'lost') playMinesweeperBoom();
      else if (next.status === 'won') {
        playGameWin();
        recordWin(next.level);
      } else if (next.opened > before.opened) playMinesweeperReveal(next.opened - before.opened);
      else if (next.flags > before.flags) playMinesweeperFlag();
      else if (next.flags < before.flags) playMinesweeperUnflag();
    },
    [recordWin]
  );

  const dig = useCallback(
    (point: MinesweeperPoint) => {
      apply((state) =>
        state.cells[point.y][point.x].mark === 'open' ? chord(state, point) : reveal(state, point)
      );
    },
    [apply]
  );

  const flag = useCallback(
    (point: MinesweeperPoint) => apply((state) => toggleFlag(state, point)),
    [apply]
  );

  const restart = useCallback(() => start(game.level), [game.level, start]);

  const changeLevel = useCallback(() => {
    const index = MINESWEEPER_LEVEL_ORDER.indexOf(game.level);
    start(MINESWEEPER_LEVEL_ORDER[(index + 1) % MINESWEEPER_LEVEL_ORDER.length]);
  }, [game.level, start]);

  const toggleTapFlags = useCallback(() => setTapFlags((current) => !current), []);

  const exit = useCallback(() => {
    onExit(labels.result.replace('{n}', String(clearedRef.current)));
  }, [labels.result, onExit]);

  useEffect(() => {
    if (status !== 'playing') return;

    const timer = window.setInterval(() => {
      setSeconds(Math.floor((performance.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    const move = (dx: number, dy: number) => {
      setCursor(({ x, y }) => ({
        x: Math.min(Math.max(x + dx, 0), cols - 1),
        y: Math.min(Math.max(y + dy, 0), rows - 1),
      }));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      let handled = true;

      if (key === 'arrowup' || key === 'w') move(0, -1);
      else if (key === 'arrowdown' || key === 's') move(0, 1);
      else if (key === 'arrowleft' || key === 'a') move(-1, 0);
      else if (key === 'arrowright' || key === 'd') move(1, 0);
      else if (key === ' ' || key === 'enter') dig(cursor);
      else if (key === 'f') flag(cursor);
      else if (key === 'r') restart();
      else if (key === 'z') changeLevel();
      else if (key === 't') toggleTapFlags();
      else if (key === 'escape' || key === 'q' || key === '`' || key === '~') exit();
      else handled = false;

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [changeLevel, cols, cursor, dig, exit, flag, restart, rows, toggleTapFlags]);

  const handleCellClick = (point: MinesweeperPoint) => {
    setCursor(point);
    const isOpen = game.cells[point.y][point.x].mark === 'open';
    if (tapFlags && !isOpen) flag(point);
    else dig(point);
  };

  const handleCellMenu = (event: MouseEvent<HTMLButtonElement>, point: MinesweeperPoint) => {
    event.preventDefault();
    setCursor(point);
    flag(point);
  };

  const describeCell = (cell: MinesweeperCell) => {
    if (cell.mark === 'open') {
      return cell.mine ? labels.cells.mine : labels.cells.open.replace('{n}', String(cell.adjacent));
    }
    return cell.mark === 'flag' ? labels.cells.flag : labels.cells.hidden;
  };

  const boardStyle: CSSProperties = {
    width: `min(100cqw, ${(cols / rows) * 100}cqh, ${cols * MAX_CELL_PX}px)`,
    aspectRatio: `${cols} / ${rows}`,
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    fontSize: `min(${60 / cols}cqw, ${60 / rows}cqh, 17px)`,
  };

  const message =
    status === 'ready'
      ? labels.start
      : status === 'won'
        ? labels.won.replace('{time}', String(seconds))
        : status === 'lost'
          ? labels.lost
          : labels.controls;

  const buttonClass =
    'border-2 border-[#F4F3ED] px-2 py-0.5 hover:bg-[#2945FF] retro-focus';

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className="flex min-h-0 flex-1 flex-col items-center gap-2 px-4 py-3 outline-none"
    >
      <div className="flex w-full max-w-[448px] justify-between gap-2 text-xs uppercase tracking-widest text-[#FFD700]">
        <span>
          {labels.mines} {game.mines - game.flags}
        </span>
        <span>
          {labels.time} {seconds}
        </span>
        <span>
          {labels.best} {bestTimes[game.level] ?? '---'}
        </span>
      </div>

      <div className="flex min-h-0 w-full flex-1 items-center justify-center [container-type:size]">
        <div
          role="group"
          aria-label={labels.aria}
          className="grid touch-manipulation select-none border-2 border-[#F4F3ED] font-bold leading-none"
          style={boardStyle}
          onContextMenu={(event) => event.preventDefault()}
        >
          {game.cells.map((row, y) =>
            row.map((cell, x) => (
              <button
                key={`${x}-${y}`}
                type="button"
                tabIndex={-1}
                aria-label={`${y + 1}, ${x + 1}: ${describeCell(cell)}`}
                onClick={() => handleCellClick({ x, y })}
                onContextMenu={(event) => handleCellMenu(event, { x, y })}
                className={`flex min-h-0 min-w-0 items-center justify-center border border-[#F4F3ED]/30 ${cellClass(
                  cell,
                  status,
                  game.exploded?.x === x && game.exploded?.y === y
                )} ${
                  cursor.x === x && cursor.y === y && !finished
                    ? 'relative z-10 outline outline-2 outline-[#FFD700]'
                    : ''
                }`}
              >
                {cellText(cell, status)}
              </button>
            ))
          )}
        </div>
      </div>

      <p className="w-full max-w-[448px] text-xs text-[#F4F3ED]">{message}</p>

      <div className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-widest text-[#F4F3ED]">
        <button type="button" onClick={restart} className={buttonClass}>
          {labels.restart}
        </button>
        <button type="button" onClick={changeLevel} className={buttonClass}>
          {labels.levelButton.replace('{level}', labels.levels[game.level])}
        </button>
        <button type="button" aria-pressed={tapFlags} onClick={toggleTapFlags} className={buttonClass}>
          {tapFlags ? labels.tapFlag : labels.tapDig}
        </button>
        <button type="button" onClick={exit} className={buttonClass}>
          {labels.quit}
        </button>
      </div>
    </div>
  );
}
