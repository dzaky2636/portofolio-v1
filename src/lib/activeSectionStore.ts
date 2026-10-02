const DEFAULT_SECTION = 'profile';

let activeSection = DEFAULT_SECTION;
const listeners = new Set<() => void>();

export function getActiveSection(): string {
  return activeSection;
}

export function setActiveSection(id: string): void {
  if (id === activeSection) return;
  activeSection = id;
  listeners.forEach((listener) => listener());
}

export function subscribeActiveSection(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
