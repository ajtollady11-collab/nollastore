'use client';

import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRegion } from './RegionProvider';
import { REGIONS, REGION_IDS, isRegionId } from '@/data/regions';
import { cn } from '@/lib/cn';

/**
 * Storefront selector (UK £ / US $). A native select underneath, so it's
 * keyboard- and screen-reader-friendly and uses the phone's own picker.
 */
export function RegionSelect({ className, variant = 'compact' }: { className?: string; variant?: 'compact' | 'full' }) {
  const { region, setRegion } = useRegion();
  const id = useId();
  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <label htmlFor={id} className="sr-only">
        Storefront and currency
      </label>
      <select
        id={id}
        value={region}
        onChange={(e) => isRegionId(e.target.value) && setRegion(e.target.value)}
        className={cn(
          'cursor-pointer appearance-none rounded-full bg-transparent pr-7 text-charcoal transition-colors hover:bg-charcoal/[0.04]',
          variant === 'compact' ? 'h-10 pl-3 text-[0.82rem] font-medium' : 'h-12 w-full border border-charcoal/15 pl-4 text-[0.95rem]',
        )}
      >
        {REGION_IDS.map((r) => (
          <option key={r} value={r}>
            {variant === 'compact' ? REGIONS[r].short : REGIONS[r].label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-charcoal/60" strokeWidth={1.8} aria-hidden />
    </div>
  );
}
