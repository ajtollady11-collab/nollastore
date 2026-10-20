'use client';

import { useRegion } from '@/components/store/RegionProvider';
import { deliveryCopy } from '@/data/site';
import { cn } from '@/lib/cn';

/** Short, accurate reassurance line. Delivery wording follows the storefront. */
export function TrustRow({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const { info } = useRegion();
  const items = ['Free cloud pillow with every blanket', info.delivery.short, deliveryCopy.returns];
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
