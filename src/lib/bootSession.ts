export const BOOT_SESSION_KEY = 'dzaky-corner-boot-v1';
export const BOOT_SURFACE_COLOR = '#2945FF';

/** When true, boot runs on every load (debug only). */
export const BOOT_RUN_EVERY_LOAD = false;

export function hasBootedThisSession(): boolean {
  if (BOOT_RUN_EVERY_LOAD) return false;
  try {
    return sessionStorage.getItem(BOOT_SESSION_KEY) === '1';
  } catch {
    return true;
  }
}

export function markBootSessionComplete(): void {
  if (BOOT_RUN_EVERY_LOAD) return;
  try {
    sessionStorage.setItem(BOOT_SESSION_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function clearBootLock(): void {
  document.documentElement.classList.remove('boot-lock');
}
