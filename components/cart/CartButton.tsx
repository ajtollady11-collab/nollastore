'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartProvider';
import { cn } from '@/lib/cn';

export function CartButton({ className }: { className?: string }) {
  const { count, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={count ? `Open bag, ${count} blanket${count === 1 ? '' : 's'}` : 'Open bag'}
      className={cn('relative grid h-11 w-11 place-items-center rounded-full text-charcoal transition-colors hover:bg-charcoal/[0.05]', className)}
    >
      <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.5} aria-hidden />
      {count > 0 && (
        <span key={count} className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] animate-fade place-items-center rounded-full bg-mocha px-1 text-[0.62rem] font-semibold tabular-nums text-ivory">
          {count}
        </span>
      )}
    </button>
  );
}
