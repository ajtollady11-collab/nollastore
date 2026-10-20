'use client';

import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { useCart } from './CartProvider';
import { discountCodes } from '@/data/marketing';
import { formatPrice } from '@/lib/format'; // discounts only apply to GBP orders today
import { cn } from '@/lib/cn';

/** "Have a code?" → small inline field. Applied codes show as a removable chip. */
export function DiscountField() {
  const { discountCode, applyDiscountCode, removeDiscountCode, discountAmount } = useCart();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (discountCode) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-soft border border-charcoal/10 bg-cream px-4 py-3">
        <span className="flex items-center gap-2 text-sm">
          <Tag className="h-4 w-4 text-mocha" aria-hidden />
          <span className="font-semibold tracking-[0.06em]">{discountCode}</span>
          <span className="text-charcoal/55">{discountCodes[discountCode].label}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-sm font-medium text-mocha">−{formatPrice(discountAmount)}</span>
          <button
            type="button"
            onClick={removeDiscountCode}
            aria-label={`Remove code ${discountCode}`}
            className="grid h-8 w-8 place-items-center rounded-full text-charcoal/45 transition-colors hover:bg-cream hover:text-charcoal"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </span>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-2 py-1 text-xs text-charcoal/60 underline decoration-charcoal/20 underline-offset-4 transition-colors hover:text-charcoal"
      >
        <Tag className="h-3.5 w-3.5" aria-hidden />
        Have a discount code?
      </button>
    );
  }

  function apply(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    if (applyDiscountCode(value)) {
      setValue('');
      setError(null);
      setOpen(false);
    } else {
      setError('That code isn’t valid.');
    }
  }

  return (
    <form onSubmit={apply} className="animate-fade">
      <div className="flex gap-2">
        <label htmlFor="discount-code" className="sr-only">
          Discount code
        </label>
        <input
          id="discount-code"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Discount code"
          autoCapitalize="characters"
          autoComplete="off"
          className={cn(
            'h-11 min-w-0 flex-1 rounded-full border bg-cream px-4 text-sm uppercase tracking-[0.06em] outline-none transition-[border-color] placeholder:normal-case placeholder:tracking-normal placeholder:text-charcoal/40 focus:border-charcoal/40',
            error ? 'border-mocha' : 'border-charcoal/[0.12]',
          )}
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-full bg-charcoal px-5 text-[0.85rem] font-medium text-ivory transition-colors hover:bg-espresso"
        >
          Apply
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-1.5 px-3 text-xs text-mocha">
          {error}
        </p>
      )}
    </form>
  );
}
