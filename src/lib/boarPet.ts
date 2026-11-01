const STORAGE_KEY = 'dzaky-corner-boar-pet';
const VISIT_SESSION_KEY = 'dzaky-corner-boar-visit';

const XP_PER_LEVEL_UNIT = 10;
const XP_PER_VISIT = 5;
const XP_PER_POKE = 1;
const XP_PER_FEED = 10;
const FEED_COOLDOWN_MS = 60_000;
const PECKISH_AFTER_MS = 4 * 60 * 60 * 1000;
const STARVING_AFTER_MS = 24 * 60 * 60 * 1000;
const MAX_GROWTH_LEVELS = 5;
const GROWTH_PER_LEVEL = 0.06;

export type BoarMood = 'full' | 'peckish' | 'starving';

export interface BoarPet {
  visits: number;
  pokes: number;
  feeds: number;
  xp: number;
  lastFedAt: number | null;
}

export interface PetUpdate {
  pet: BoarPet;
  leveledUp: boolean;
  fed: boolean;
}

const NEW_PET: BoarPet = { visits: 0, pokes: 0, feeds: 0, xp: 0, lastFedAt: null };

function count(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0;
}

/** Stored per browser, so a cleared or blocked store just means a new boar. */
export function readPet(): BoarPet {
  try {
    const saved: Partial<BoarPet> = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return {
      visits: count(saved.visits),
      pokes: count(saved.pokes),
      feeds: count(saved.feeds),
      xp: count(saved.xp),
      lastFedAt: typeof saved.lastFedAt === 'number' ? saved.lastFedAt : null,
    };
  } catch {
    return { ...NEW_PET };
  }
}

function savePet(pet: BoarPet) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
  } catch {
    /* progress just won't survive a reload */
  }
}

export function levelOf(xp: number) {
  return Math.floor(Math.sqrt(xp / XP_PER_LEVEL_UNIT)) + 1;
}

export function xpForNextLevel(xp: number) {
  return levelOf(xp) ** 2 * XP_PER_LEVEL_UNIT;
}

export function moodOf(pet: BoarPet, now: number): BoarMood {
  if (pet.lastFedAt === null) return 'peckish';
  const elapsed = now - pet.lastFedAt;
  if (elapsed > STARVING_AFTER_MS) return 'starving';
  return elapsed > PECKISH_AFTER_MS ? 'peckish' : 'full';
}

export function growthOf(xp: number) {
  return 1 + Math.min(levelOf(xp) - 1, MAX_GROWTH_LEVELS) * GROWTH_PER_LEVEL;
}

function commit(previous: BoarPet, pet: BoarPet, fed: boolean): PetUpdate {
  savePet(pet);
  return { pet, leveledUp: levelOf(pet.xp) > levelOf(previous.xp), fed };
}

/** Counts once per browser session. */
export function recordVisit(): PetUpdate {
  const pet = readPet();
  try {
    if (sessionStorage.getItem(VISIT_SESSION_KEY)) return { pet, leveledUp: false, fed: false };
    sessionStorage.setItem(VISIT_SESSION_KEY, '1');
  } catch {
    return { pet, leveledUp: false, fed: false };
  }
  return commit(pet, { ...pet, visits: pet.visits + 1, xp: pet.xp + XP_PER_VISIT }, false);
}

export function recordPoke(): PetUpdate {
  const pet = readPet();
  return commit(pet, { ...pet, pokes: pet.pokes + 1, xp: pet.xp + XP_PER_POKE }, false);
}

export function feedPet(now: number): PetUpdate {
  const pet = readPet();
  if (pet.lastFedAt !== null && now - pet.lastFedAt < FEED_COOLDOWN_MS) {
    return { pet, leveledUp: false, fed: false };
  }
  return commit(
    pet,
    { ...pet, feeds: pet.feeds + 1, xp: pet.xp + XP_PER_FEED, lastFedAt: now },
    true
  );
}
