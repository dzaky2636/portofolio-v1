'use client';

import { useEffect, useState } from 'react';

const JAKARTA_TZ = 'Asia/Jakarta';

function formatJakartaTime(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: JAKARTA_TZ,
  }).format(date);
}

interface HeaderSystemClockProps {
  timezoneLabel: string;
}

export default function HeaderSystemClock({ timezoneLabel }: HeaderSystemClockProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatJakartaTime(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="hidden sm:flex items-center gap-2 border-2 border-black bg-white shadow-[2px_2px_0px_#0C0C0C] px-2 py-1 font-mono uppercase tracking-widest text-[10px] md:text-xs select-none"
      aria-hidden="true"
    >
      <time className="tabular-nums" suppressHydrationWarning>
        {time ?? '--:--:--'}
      </time>
      <span className="text-[#2945FF] border-l-2 border-black pl-2 whitespace-nowrap">
        {timezoneLabel}
      </span>
    </div>
  );
}
