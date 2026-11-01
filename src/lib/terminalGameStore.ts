let gameRunning = false;
const listeners = new Set<() => void>();

export function getTerminalGameRunning(): boolean {
  return gameRunning;
}

export function setTerminalGameRunning(running: boolean): void {
  if (running === gameRunning) return;
  gameRunning = running;
  listeners.forEach((listener) => listener());
}

export function subscribeTerminalGame(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
