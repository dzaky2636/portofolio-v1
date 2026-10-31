import { NextResponse } from 'next/server';
import en from '@/dictionaries/en.json';
import type { SiteState, SiteStatus, StatusReport } from '@/lib/siteStatus';

export const dynamic = 'force-dynamic';
// Government sites may block traffic from outside the region.
export const preferredRegion = 'sin1';

const CACHE_MS = 60_000;
const TIMEOUT_MS = 8_000;

interface Target {
  id: string;
  name: string;
  url: string;
}

const targets: Target[] = en.projects.items.flatMap((project) =>
  'liveUrl' in project && project.liveUrl
    ? [{ id: project.id, name: project.name, url: project.liveUrl }]
    : []
);

let cached: { report: StatusReport; expiresAt: number } | null = null;
let pending: Promise<StatusReport> | null = null;

async function pingSite({ id, name, url }: Target): Promise<SiteStatus> {
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    await response.body?.cancel();

    const state: SiteState = response.status < 500 ? 'online' : 'degraded';
    return { id, name, url, state, latencyMs: Date.now() - startedAt };
  } catch {
    return { id, name, url, state: 'offline', latencyMs: null };
  }
}

async function buildReport(): Promise<StatusReport> {
  const sites = await Promise.all(targets.map(pingSite));
  return { checkedAt: new Date().toISOString(), sites };
}

export async function GET() {
  if (!cached || cached.expiresAt <= Date.now()) {
    pending ??= buildReport().finally(() => {
      pending = null;
    });
    const report = await pending;
    cached = { report, expiresAt: Date.now() + CACHE_MS };
  }

  return NextResponse.json(cached.report, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60' },
  });
}
