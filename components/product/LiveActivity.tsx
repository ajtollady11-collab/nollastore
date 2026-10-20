'use client';

import { useEffect, useState } from 'react';
import { liveActivity } from '@/data/liveActivity';

/** "41 people are checking this out right now". Off unless switched on in data/liveActivity.ts. */
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

  return (
    <p className={className ?? 'flex items-center gap-2.5 text-[0.85rem] text-charcoal/75'}>
      <span className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-mocha" aria-hidden />
      {liveActivity.text.replace('{n}', String(count))}
    </p>
  );
}
