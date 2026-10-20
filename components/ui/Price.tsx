'use client';

import { useRegion } from '@/components/store/RegionProvider';
import { PROMOTION, priceFor, type SizeId } from '@/data/product';
import { cn } from '@/lib/cn';

/** A storefront-aware amount. Hidden for a moment until the saved storefront loads. */
export function Money({ amount, className }: { amount: number; className?: string }) {
  const { money, ready } = useRegion();
  return (
    <span className={cn('price-wait tabular-nums', className)} data-ready={ready}>
      {money(amount)}
    </span>
  );
}

/**
 * Selling price for a size, plus the struck-through reference price and saving
 * when the offer is on and a reference is configured for this storefront.
 */
export function SizePrice({ size, variant = 'panel', className }: { size: SizeId; variant?: 'panel' | 'inline'; className?: string }) {
  const { region, money, ready } = useRegion();
  const { price, reference } = priceFor(size, region);

  if (variant === 'inline') {
    return (
      <span className={cn('price-wait inline-flex items-baseline gap-2 tabular-nums', className)} data-ready={ready}>
        <span>{money(price)}</span>
        {reference && (
          <s className="text-[0.85em] text-charcoal/45 decoration-charcoal/40">
            <span className="sr-only">{PROMOTION.referenceLabel} </span>
            {money(reference)}
          </s>
        )}
      </span>
    );
  }

  return (
    <div className={cn('price-wait', className)} data-ready={ready}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-sans text-[1.65rem] font-medium tracking-[-0.01em] tabular-nums text-charcoal">{money(price)}</span>
        {reference && (
          <>
            <span className="text-[0.95rem] text-charcoal/50">
              <span className="sr-only">{PROMOTION.referenceLabel}: </span>
              <s className="decoration-charcoal/40 tabular-nums">{money(reference)}</s>
            </span>
            <span className="text-[0.8rem] font-medium tabular-nums text-mocha">Save {money(reference - price)}</span>
          </>
        )}
      </div>
      {reference && PROMOTION.enabled && (
        <p className="mt-1.5 text-[0.8rem] text-charcoal/60">{PROMOTION.label} on this size.</p>
      )}
    </div>
  );
}
