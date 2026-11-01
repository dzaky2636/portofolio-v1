'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { trackAction } from '@/lib/actionTracking';
import { feedPet, levelOf, moodOf, readPet, xpForNextLevel } from '@/lib/boarPet';
import type { MinesweeperLevel } from '@/lib/minesweeper';
import type { RandomSize } from '@/lib/nonogramSizes';
import type { StatusReport } from '@/lib/siteStatus';
import {
  completeInput,
  runCommand,
  type TerminalAction,
  type TerminalData,
  type TerminalLine,
} from '@/lib/terminalCommands';

const TerminalSnake = dynamic(() => import('@/components/TerminalSnake'), { ssr: false });
const TerminalSubway = dynamic(() => import('@/components/TerminalSubway'), { ssr: false });
const TerminalNonogram = dynamic(() => import('@/components/TerminalNonogram'), { ssr: false });
const TerminalMinesweeper = dynamic(() => import('@/components/TerminalMinesweeper'), {
  ssr: false,
});

const LINE_STYLE: Record<TerminalLine['kind'], string> = {
  output: 'text-[#F4F3ED]',
  accent: 'text-[#FFD700]',
  error: 'text-[#FF6B6B]',
};

interface PrintedLine extends TerminalLine {
  id: number;
}

function isTypingElsewhere(target: EventTarget | null, input: HTMLInputElement | null) {
  if (!(target instanceof HTMLElement) || target === input) return false;
  return (
    target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
  );
}

export default function TerminalOverlay({
  data,
  cvFile,
}: {
  data: TerminalData;
  cvFile: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<PrintedLine[]>(() =>
    data.labels.welcome.map((text, id) => ({ id, text, kind: 'accent' }))
  );
  const [value, setValue] = useState('');
  const [game, setGame] = useState<'snake' | 'subway' | 'nonogram' | 'minesweeper' | null>(
    null
  );
  const [nonogramRandomSize, setNonogramRandomSize] = useState<RandomSize | null>(null);
  const [minesweeperLevel, setMinesweeperLevel] = useState<MinesweeperLevel>('easy');
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(data.labels.welcome.length);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(0);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const print = useCallback((next: TerminalLine[]) => {
    const printed = next.map((line) => {
      nextIdRef.current += 1;
      return { ...line, id: nextIdRef.current };
    });
    setLines((current) => [...current, ...printed]);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    returnFocusRef.current?.focus();
  }, []);

  const open = useCallback(() => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (isOpen && !game) inputRef.current?.focus();
  }, [game, isOpen]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines, isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen((current) => {
          if (current) returnFocusRef.current?.focus();
          return false;
        });
        return;
      }
      if (event.key !== '`' && event.key !== '~') return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingElsewhere(event.target, inputRef.current)) return;

      event.preventDefault();
      setIsOpen((current) => {
        if (!current) {
          returnFocusRef.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        } else {
          returnFocusRef.current?.focus();
        }
        return !current;
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-terminal-open]')) {
        open();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [open]);

  const loadStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) throw new Error(`status ${response.status}`);
      const report = (await response.json()) as StatusReport;
      print(
        report.sites.map((site) => ({
          text: `${site.name.padEnd(12)}${site.state.toUpperCase().padEnd(10)}${
            site.latencyMs === null ? '---' : `${site.latencyMs}ms`
          }`,
          kind: site.state === 'online' ? 'output' : 'error',
        }))
      );
    } catch {
      print([{ text: data.labels.statusFailed, kind: 'error' }]);
    }
  }, [data.labels.statusFailed, print]);

  const applyAction = useCallback(
    (action: TerminalAction) => {
      switch (action.type) {
        case 'clear':
          setLines([]);
          break;
        case 'close':
          close();
          break;
        case 'cv': {
          const link = document.createElement('a');
          link.href = cvFile;
          link.download = '';
          link.click();
          trackAction('cv-download');
          break;
        }
        case 'status':
          void loadStatus();
          break;
        case 'crt':
          window.dispatchEvent(new Event('crt:toggle'));
          break;
        case 'snake':
          setGame('snake');
          break;
        case 'subway':
          setGame('subway');
          break;
        case 'nonogram':
          setNonogramRandomSize(action.randomSize);
          setGame('nonogram');
          break;
        case 'minesweeper':
          setMinesweeperLevel(action.level);
          setGame('minesweeper');
          break;
        case 'petStats': {
          const pet = readPet();
          const { petStats, moods } = data.labels;
          print(
            [
              [petStats.level, `${levelOf(pet.xp)} (xp ${pet.xp}/${xpForNextLevel(pet.xp)})`],
              [petStats.visits, String(pet.visits)],
              [petStats.pokes, String(pet.pokes)],
              [petStats.feeds, String(pet.feeds)],
              [petStats.mood, moods[moodOf(pet, Date.now())]],
            ].map(([label, stat]) => ({ text: `${label.padEnd(10)}${stat}`, kind: 'output' }))
          );
          break;
        }
        case 'feed': {
          const { fed } = feedPet(Date.now());
          window.dispatchEvent(new Event('boar:changed'));
          print([{ text: fed ? data.labels.fed : data.labels.notHungry, kind: 'accent' }]);
          break;
        }
        case 'link':
          window.open(action.url, '_blank', 'noopener,noreferrer');
          break;
        case 'goto':
          returnFocusRef.current = null;
          setIsOpen(false);
          document.getElementById(action.section)?.scrollIntoView();
          break;
      }
    },
    [close, cvFile, data.labels, loadStatus, print]
  );

  useEffect(() => {
    const handleRun = (event: Event) => {
      if (!(event instanceof CustomEvent) || typeof event.detail !== 'string') return;
      const command = event.detail;
      open();
      setGame(null);
      print([{ text: `$ ${command}`, kind: 'output' }]);
      const result = runCommand(command, data);
      print(result.lines);
      applyAction(result.action);
    };

    window.addEventListener('terminal:run', handleRun);
    return () => window.removeEventListener('terminal:run', handleRun);
  }, [applyAction, data, open, print]);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const command = value.trim();
      setValue('');
      print([{ text: `$ ${value}`, kind: 'output' }]);
      if (command) {
        historyRef.current.push(command);
        historyIndexRef.current = historyRef.current.length;
      }
      const result = runCommand(value, data);
      print(result.lines);
      applyAction(result.action);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      setValue((current) => completeInput(current, data));
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const history = historyRef.current;
      const step = event.key === 'ArrowUp' ? -1 : 1;
      const index = Math.min(Math.max(historyIndexRef.current + step, 0), history.length);
      historyIndexRef.current = index;
      setValue(history[index] ?? '');
    }
  };

  const handleMessageExit = (message: string) => {
    setGame(null);
    print([{ text: message, kind: 'accent' }]);
  };

  const handleSubwayExit = (score: number, coins: number, best: number) => {
    setGame(null);
    print([
      {
        text: data.labels.subway.result
          .replace('{score}', String(score))
          .replace('{coins}', String(coins))
          .replace('{best}', String(best)),
        kind: 'accent',
      },
    ]);
  };

  const handleSnakeExit = (score: number, best: number) => {
    setGame(null);
    print([
      {
        text: data.labels.snake.result
          .replace('{score}', String(score))
          .replace('{best}', String(best)),
        kind: 'accent',
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-label={data.labels.title}
      className="fixed inset-x-0 top-0 z-[150] flex h-[70vh] max-h-[640px] flex-col border-b-4 border-[#2945FF] bg-[#0C0C0C] font-mono text-sm shadow-[0_8px_0_#2945FF] animate-iris"
    >
      <div className="flex shrink-0 items-center justify-between border-b-2 border-[#F4F3ED]/30 px-4 py-2 uppercase tracking-widest text-xs text-[#F4F3ED]">
        <span>{data.labels.title}</span>
        <button
          type="button"
          onClick={close}
          aria-label={data.labels.closeAria}
          className="border-2 border-[#F4F3ED] px-2 py-0.5 hover:bg-[#2945FF] retro-focus"
        >
          [ X ]
        </button>
      </div>

      {game === 'snake' && (
        <TerminalSnake labels={data.labels.snake} onExit={handleSnakeExit} />
      )}
      {game === 'subway' && (
        <TerminalSubway labels={data.labels.subway} onExit={handleSubwayExit} />
      )}
      {game === 'nonogram' && (
        <TerminalNonogram
          labels={data.labels.nonogram}
          startRandomSize={nonogramRandomSize}
          onExit={handleMessageExit}
        />
      )}
      {game === 'minesweeper' && (
        <TerminalMinesweeper
          labels={data.labels.minesweeper}
          startLevel={minesweeperLevel}
          onExit={handleMessageExit}
        />
      )}
      {!game && (
      <>
      <div
        ref={logRef}
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto px-4 py-3 leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line) => (
          <p key={line.id} className={`whitespace-pre-wrap break-words ${LINE_STYLE[line.kind]}`}>
            {line.text}
          </p>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t-2 border-[#F4F3ED]/30 px-4 py-3 text-[#FFD700]">
        <span aria-hidden="true">$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleInputKeyDown}
          aria-label={data.labels.inputAria}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-base text-[#F4F3ED] outline-none md:text-sm"
        />
      </div>
      </>
      )}
    </section>
  );
}
