import type { NonogramCell, NonogramPuzzleId } from '@/lib/nonogram';
import { RANDOM_SIZES, type RandomSize } from '@/lib/nonogramSizes';
import type { MainSectionId } from '@/lib/sectionIds';

export interface TerminalSnakeLabels {
  aria: string;
  score: string;
  best: string;
  start: string;
  controls: string;
  gameOver: string;
  won: string;
  quit: string;
  result: string;
}

export interface TerminalNonogramLabels {
  aria: string;
  puzzle: string;
  solvedCount: string;
  controls: string;
  solved: string;
  next: string;
  reset: string;
  quit: string;
  result: string;
  randomHeader: string;
  randomCount: string;
  randomSolved: string;
  randomResult: string;
  randomButton: string;
  picturesButton: string;
  sizeButton: string;
  usage: string;
  names: Record<NonogramPuzzleId, string>;
  cells: Record<NonogramCell, string>;
}

export interface TerminalSubwayLabels {
  aria: string;
  score: string;
  coins: string;
  best: string;
  start: string;
  controls: string;
  gameOver: string;
  quit: string;
  musicOn: string;
  musicOff: string;
  result: string;
}

export interface TerminalLabels {
  title: string;
  closeAria: string;
  openButton: string;
  inputAria: string;
  welcome: string[];
  help: { command: string; description: string }[];
  notFound: string;
  noProject: string;
  noLink: string;
  openUsage: string;
  gotoUsage: string;
  opening: string;
  downloading: string;
  statusLoading: string;
  statusFailed: string;
  hire: string[];
  remove: string;
  boar: string;
  crt: string;
  fed: string;
  notHungry: string;
  snake: TerminalSnakeLabels;
  subway: TerminalSubwayLabels;
  nonogram: TerminalNonogramLabels;
  petStats: { level: string; visits: string; pokes: string; feeds: string; mood: string };
  moods: { full: string; peckish: string; starving: string };
}

export interface TerminalData {
  labels: TerminalLabels;
  title: string;
  summary: string;
  skills: string[];
  projects: { id: string; name: string; realm: string; url?: string }[];
  experience: { role: string; company: string; duration: string }[];
  contact: { email: string; github: string; linkedin: string };
}

export type TerminalLineKind = 'output' | 'error' | 'accent';

export interface TerminalLine {
  text: string;
  kind: TerminalLineKind;
}

export type TerminalAction =
  | { type: 'none' }
  | { type: 'clear' }
  | { type: 'close' }
  | { type: 'cv' }
  | { type: 'status' }
  | { type: 'crt' }
  | { type: 'snake' }
  | { type: 'subway' }
  | { type: 'nonogram'; randomSize: RandomSize | null }
  | { type: 'petStats' }
  | { type: 'feed' }
  | { type: 'link'; url: string }
  | { type: 'goto'; section: MainSectionId };

export interface TerminalResult {
  lines: TerminalLine[];
  action: TerminalAction;
}

const SECTION_ALIASES: Record<string, MainSectionId> = {
  home: 'profile',
  profile: 'profile',
  skills: 'inventory',
  inventory: 'inventory',
  projects: 'realms',
  realms: 'realms',
  experience: 'logs',
  logs: 'logs',
  contact: 'contact',
};

function output(text: string): TerminalLine {
  return { text, kind: 'output' };
}

function accent(text: string): TerminalLine {
  return { text, kind: 'accent' };
}

function error(text: string): TerminalLine {
  return { text, kind: 'error' };
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[\s_-]/g, '');
}

function findProject(data: TerminalData, query: string) {
  const target = normalize(query);
  return data.projects.find(
    (project) => normalize(project.id) === target || normalize(project.name) === target
  );
}

export function commandNames(data: TerminalData) {
  return data.labels.help.map((entry) => entry.command.split(' ')[0]);
}

/** Completes the word being typed, or returns the input unchanged. */
export function completeInput(input: string, data: TerminalData) {
  const [first, ...rest] = input.toLowerCase().split(' ');

  if (rest.length === 0) {
    const matches = commandNames(data).filter((name) => name.startsWith(first));
    return matches.length === 1 ? `${matches[0]} ` : input;
  }

  const partial = rest.join(' ');
  const candidates =
    first === 'open'
      ? data.projects.map((project) => project.id)
      : first === 'goto'
        ? Object.keys(SECTION_ALIASES)
        : [];
  const matches = candidates.filter((name) => name.startsWith(partial));
  return matches.length === 1 ? `${first} ${matches[0]}` : input;
}

export function runCommand(input: string, data: TerminalData): TerminalResult {
  const { labels } = data;
  const [rawCommand = '', ...args] = input.trim().split(/\s+/);
  const command = rawCommand.toLowerCase();
  const argument = args.join(' ');
  const none: TerminalAction = { type: 'none' };

  switch (command) {
    case '':
      return { lines: [], action: none };
    case 'help': {
      const width = Math.max(...labels.help.map((entry) => entry.command.length)) + 2;
      return {
        lines: labels.help.map((entry) =>
          output(`${entry.command.padEnd(width)}${entry.description}`)
        ),
        action: none,
      };
    }
    case 'whoami':
      return {
        lines: [accent(`Dzaky Fatur Rahman // ${data.title}`), output(data.summary)],
        action: none,
      };
    case 'projects':
    case 'ls':
      return {
        lines: data.projects.map((project) =>
          output(`${project.id.padEnd(24)}${project.realm}`)
        ),
        action: none,
      };
    case 'skills':
      return { lines: [output(data.skills.join(', '))], action: none };
    case 'experience':
      return {
        lines: data.experience.map((item) =>
          output(`${item.duration.padEnd(18)}${item.role} @ ${item.company}`)
        ),
        action: none,
      };
    case 'contact':
      return {
        lines: [
          output(`email     ${data.contact.email}`),
          output(`github    ${data.contact.github}`),
          output(`linkedin  ${data.contact.linkedin}`),
        ],
        action: none,
      };
    case 'cv':
      return { lines: [accent(labels.downloading)], action: { type: 'cv' } };
    case 'status':
      return { lines: [output(labels.statusLoading)], action: { type: 'status' } };
    case 'open': {
      if (!argument) return { lines: [error(labels.openUsage)], action: none };
      const project = findProject(data, argument);
      if (!project) {
        return { lines: [error(labels.noProject.replace('{name}', argument))], action: none };
      }
      if (!project.url) {
        return { lines: [error(labels.noLink.replace('{name}', project.name))], action: none };
      }
      return {
        lines: [accent(labels.opening.replace('{name}', project.name))],
        action: { type: 'link', url: project.url },
      };
    }
    case 'goto': {
      const section = SECTION_ALIASES[argument.toLowerCase()];
      if (!section) return { lines: [error(labels.gotoUsage)], action: none };
      return { lines: [], action: { type: 'goto', section } };
    }
    case 'boar':
    case 'oink':
      return { lines: [accent(labels.boar)], action: { type: 'petStats' } };
    case 'feed':
      return { lines: [], action: { type: 'feed' } };
    case 'sudo': {
      const task = argument.toLowerCase();
      if (task === 'hire dzaky') return { lines: labels.hire.map(accent), action: none };
      if (task.startsWith('rm')) return { lines: [error(labels.remove)], action: none };
      break;
    }
    case 'crt':
      return { lines: [accent(labels.crt)], action: { type: 'crt' } };
    case 'snake':
      return { lines: [], action: { type: 'snake' } };
    case 'subway':
      return { lines: [], action: { type: 'subway' } };
    case 'nonogram': {
      const [mode, size] = args.map((value) => value.toLowerCase());
      if (!mode) return { lines: [], action: { type: 'nonogram', randomSize: null } };

      const randomSize = size ? RANDOM_SIZES.find((option) => String(option) === size) : 10;
      if (mode !== 'random' || !randomSize || args.length > 2) {
        return { lines: [error(labels.nonogram.usage)], action: none };
      }
      return { lines: [], action: { type: 'nonogram', randomSize } };
    }
    case 'clear':
      return { lines: [], action: { type: 'clear' } };
    case 'exit':
      return { lines: [], action: { type: 'close' } };
  }

  return { lines: [error(labels.notFound.replace('{cmd}', rawCommand))], action: none };
}
