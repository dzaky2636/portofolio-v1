export const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

const CHEAT_KEYS = new Set<string>([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'a',
  'b',
  'A',
  'B',
]);

export function normalizeKonamiKey(key: string): string {
  if (key === 'A' || key === 'B') return key.toLowerCase();
  return key;
}

export function isKonamiKey(key: string): boolean {
  return CHEAT_KEYS.has(key);
}

export const KONAMI_STORAGE_KEY = 'dzaky-corner-konami-v1';

/** When true, achievement dialog opens on every successful code entry. */
export const KONAMI_SHOW_EVERY_COMPLETION = true;
