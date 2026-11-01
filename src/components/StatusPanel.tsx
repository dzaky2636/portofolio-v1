'use client';

import { useEffect, useState } from 'react';
import Window from '@/components/Window';
import type { SiteState, StatusReport } from '@/lib/siteStatus';

const REFRESH_MS = 60_000;

const STATE_STYLE: Record<SiteState, string> = {
  online: 'bg-[#2945FF] text-white',
  degraded: 'bg-[#FFD700] text-[#0C0C0C]',
  offline: 'bg-[#0C0C0C] text-white',
};

export interface StatusPanelLabels {
  title: string;
  checking: string;
  summary: string;
  online: string;
  degraded: string;
  offline: string;
  lastPing: string;
  unavailable: string;
}

function hostOf(url: string) {
  return new URL(url).hostname.replace(/^www\./, '');
}

function formatPingTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour12: false,
  });
}

export default function StatusPanel({ labels }: { labels: StatusPanelLabels }) {
  const [report, setReport] = useState<StatusReport | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch('/api/status', { signal: controller.signal });
        if (!response.ok) throw new Error(`status ${response.status}`);
        setReport((await response.json()) as StatusReport);
        setFailed(false);
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      }
    };

    void load();
    const interval = window.setInterval(() => void load(), REFRESH_MS);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  const onlineCount = report?.sites.filter((site) => site.state === 'online').length ?? 0;
  const windowStatus = report
    ? labels.summary
        .replace('{online}', String(onlineCount))
        .replace('{total}', String(report.sites.length))
    : labels.checking;

  return (
    <Window
      title={labels.title}
      status={windowStatus}
      interactive={false}
      statusAccent
      bodyClassName="p-0"
    >
      {report ? (
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-1 bg-[#0C0C0C]">
          {report.sites.map((site) => (
            <li key={site.id} className="flex">
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white p-3 md:p-4 hover:bg-[#F4F3ED] retro-focus"
              >
                <span className="block font-serif font-bold text-xl leading-tight">
                  {site.name}
                </span>
                <span className="block mt-1 font-mono text-[10px] tracking-widest break-all">
                  {hostOf(site.url)}
                </span>
                <span className="mt-2 flex flex-wrap items-center gap-2 font-mono uppercase tracking-widest text-[10px]">
                  <span className={`border-2 border-black px-2 py-0.5 ${STATE_STYLE[site.state]}`}>
                    {labels[site.state]}
                  </span>
                  {site.latencyMs !== null && (
                    <span className="tabular-nums">{site.latencyMs}MS</span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-4 md:p-5 font-mono uppercase tracking-widest text-xs">
          {failed ? labels.unavailable : labels.checking}
        </p>
      )}
      {report && (
        <p className="border-t-4 border-black bg-[#F4F3ED] px-4 py-2 font-mono uppercase tracking-widest text-[10px]">
          {labels.lastPing} {formatPingTime(report.checkedAt)} WIB
        </p>
      )}
    </Window>
  );
}
