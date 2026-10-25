'use client';

import { useEffect, useState } from 'react';
import { liveActivity } from '@/data/liveActivity';

/**
 * "41 people are checking this out right now", shown as a highlighted strip.
 * Off unless switched on in data/liveActivity.ts. Only switch it on with a real number (`source`).
 */
export function LiveActivity({ className }: { className?: string }) {
  const [count, setCount] = useState(liveActivity.count);

  useEffect(() => {
    if (!liveActivity.enabled || !liveActivity.source) return;
    let cancelled = false;
    const load = () =>
      fetch(liveActivity.source!)
        .then((r) => (r.ok ? r.json() : null))
        .then((j: { count?: number } | null) => {
          if (!cancelled && typeof j?.count === 'number') setCount(j.count);
        })
        .catch(() => {});
    load();
    const t = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  if (!liveActivity.enabled || count < liveActivity.minimum) return null;

  // The number is set in bold; the rest of the sentence comes from data/liveActivity.ts
  const [before, after = ''] = liveActivity.text.split('{n}');

  return (
    <p
      className={
        className ??
        'mt-5 flex items-center gap-3 rounded-soft border border-mocha/20 bg-mocha-soft px-4 py-3 text-[0.98rem] leading-snug text-charcoal'
      }
    >
      <span className="relative flex h-3 w-3 shrink-0" aria-hidden>
        <span className="pulse-dot h-3 w-3 rounded-full bg-emerald-600" />
      </span>
      <span>
        {before}
        <strong className="font-semibold text-espresso">{count}</strong>
        {after}
      </span>
    </p>
  );
}
