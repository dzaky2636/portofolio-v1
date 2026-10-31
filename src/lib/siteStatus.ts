export type SiteState = 'online' | 'degraded' | 'offline';

export interface SiteStatus {
  id: string;
  name: string;
  url: string;
  state: SiteState;
  latencyMs: number | null;
}

export interface StatusReport {
  checkedAt: string;
  sites: SiteStatus[];
}
