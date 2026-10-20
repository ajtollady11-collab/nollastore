'use client';

import { useEffect, useState } from 'react';

/**
 * A just-for-fun countdown to midnight (UK time) that restarts every day.
 * Deliberately NOT linked to any offer or price: keep it that way, since a
 * resetting timer next to a sale would be fake urgency under UK consumer law.
 * Text and on/off switch below.
 */
export const funTimer = {
  enabled: true,
  label: 'Time Until Sale Ends',
  timeZone: 'Europe/London',
};

function secondsUntilMidnight(timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const elapsed = get('hour') * 3600 + get('minute') * 60 + get('second');
  return Math.max(0, 86400 - elapsed);
}

const pad = (n: number) => String(n).padStart(2, '0');

export function FunTimer() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(secondsUntilMidnight(funTimer.timeZone));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);

  if (!funTimer.enabled) return null;

  const h = left === null ? '--' : pad(Math.floor(left / 3600));
  const m = left === null ? '--' : pad(Math.floor((left % 3600) / 60));
  const s = left === null ? '--' : pad(left % 60);

  return (
    <div className="border-b border-charcoal/10 bg-oat-soft" role="timer" aria-live="off">
      <div className="container-soft flex h-9 items-center justify-center gap-3 text-[0.75rem] text-charcoal/70 sm:text-[0.78rem]">
        <span className="font-medium tabular-nums tracking-[0.04em] text-charcoal" aria-label={`${h} hours, ${m} minutes, ${s} seconds`}>
          {h}:{m}:{s}
        </span>
        <span className="h-3 w-px bg-charcoal/20" aria-hidden />
        <span className="truncate">{funTimer.label}</span>
      </div>
    </div>
  );
}
