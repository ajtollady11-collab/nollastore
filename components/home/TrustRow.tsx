'use client';

import { deliveryCopy } from '@/data/site';
import { cn } from '@/lib/cn';

/** Short, accurate reassurance line (wording from data/site.ts). */
export function TrustRow({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const items = [`${deliveryCopy.short}`, `Arrives in ${deliveryCopy.estimate}`, deliveryCopy.returns];
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem]', tone === 'dark' ? 'text-charcoal/65' : 'text-ivory/80', className)}>
      {items.map((t) => (
        <li key={t} className="flex items-center gap-2">
          <span className={cn('h-1 w-1 rounded-full', tone === 'dark' ? 'bg-mocha' : 'bg-ivory/70')} aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}
