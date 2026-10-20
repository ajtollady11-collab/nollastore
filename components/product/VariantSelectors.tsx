'use client';

import { COLOURS, SIZES, getColour, priceFor, type ColourId, type SizeId } from '@/data/product';
import { useRegion } from '@/components/store/RegionProvider';
import { cn } from '@/lib/cn';

/**
 * Colour and size pickers. Both are real radio groups (native inputs, visually
 * restyled), so arrow keys, screen readers and form semantics all just work.
 */

export function ColourSelector({ value, onChange, name = 'colour' }: { value: ColourId; onChange: (c: ColourId) => void; name?: string }) {
  return (
    <fieldset>
      <legend className="flex w-full items-baseline justify-between text-[0.9rem]">
        <span>
          <span className="text-charcoal/60">Colour</span>
          <span className="mx-2 text-charcoal/25" aria-hidden>
            /
          </span>
          <span className="font-medium text-charcoal">{getColour(value)?.label}</span>
        </span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {COLOURS.map((c) => {
          const selected = c.id === value;
          const unavailable = c.available === false;
          return (
            <label key={c.id} className={cn('relative grid h-11 w-11 cursor-pointer place-items-center', unavailable && 'cursor-not-allowed opacity-40')}>
              <input
                type="radio"
                name={name}
                value={c.id}
                checked={selected}
                disabled={unavailable}
                onChange={() => onChange(c.id)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'block h-11 w-11 rounded-full p-[3px] transition-[box-shadow] duration-300 ease-soft',
                  'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-mocha',
                  selected ? 'shadow-[inset_0_0_0_1.5px_#252321]' : 'shadow-[inset_0_0_0_1px_rgba(37,35,33,0.12)] hover:shadow-[inset_0_0_0_1px_rgba(37,35,33,0.45)]',
                )}
              >
                <span className="block h-full w-full rounded-full shadow-[inset_0_0_0_1px_rgba(37,35,33,0.08)]" style={{ backgroundColor: c.swatch }} />
              </span>
              <span className="sr-only">{c.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SizeSelector({
  value,
  onChange,
  onOpenGuide,
  name = 'size',
}: {
  value: SizeId;
  onChange: (s: SizeId) => void;
  onOpenGuide?: () => void;
  name?: string;
}) {
  const { region, money, ready } = useRegion();
  return (
    <fieldset>
      <div className="flex items-baseline justify-between">
        <legend className="text-[0.9rem] text-charcoal/60">Size</legend>
        {onOpenGuide && (
          <button type="button" onClick={onOpenGuide} className="link text-[0.85rem] text-charcoal/75 hover:text-charcoal">
            Size guide
          </button>
        )}
      </div>
      <div className="mt-3 space-y-2">
        {SIZES.map((s) => {
          const selected = s.id === value;
          const { price, reference } = priceFor(s.id, region);
          const unavailable = s.available === false;
          return (
            <label
              key={s.id}
              className={cn(
                'relative flex min-h-[3.5rem] cursor-pointer items-center gap-3.5 rounded-soft border px-4 py-3 transition-[border-color,background-color] duration-300 ease-soft',
                selected ? 'border-charcoal bg-ivory' : 'border-charcoal/[0.14] hover:border-charcoal/40',
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mocha',
                unavailable && 'cursor-not-allowed opacity-40',
              )}
            >
              <input
                type="radio"
                name={name}
                value={s.id}
                checked={selected}
                disabled={unavailable}
                onChange={() => onChange(s.id)}
                className="sr-only"
              />
              <span
                className={cn('grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border transition-colors', selected ? 'border-charcoal' : 'border-charcoal/30')}
                aria-hidden
              >
                <span className={cn('h-2 w-2 rounded-full bg-charcoal transition-transform duration-300 ease-soft', selected ? 'scale-100' : 'scale-0')} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[0.95rem] font-medium tabular-nums text-charcoal">{s.label}</span>
                  {s.badge && (
                    <span className="rounded-full bg-oat px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.1em] text-mocha">{s.badge}</span>
                  )}
                </span>
              </span>
              <span className="price-wait shrink-0 text-right tabular-nums" data-ready={ready}>
                <span className="block text-[0.95rem] font-medium text-charcoal">{money(price)}</span>
                {reference && <s className="block text-[0.78rem] text-charcoal/45 decoration-charcoal/40">{money(reference)}</s>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
