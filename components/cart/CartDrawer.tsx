'use client';

import { useEffect, useRef } from 'react';
import { Check, Gift, Minus, Plus, X } from 'lucide-react';
import { useCart } from './CartProvider';
import { useRegion } from '@/components/store/RegionProvider';
import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { TM } from '@/components/ui/TM';
import { GIFT, PRODUCT, cartImageFor, getColour, getSize } from '@/data/product';
import { deliveryCopy } from '@/data/site';
import { formatPrice } from '@/lib/format';
import { MAX_QTY } from '@/lib/cart';
import { cn } from '@/lib/cn';

/** Slide-in bag. Full height on the right; full width on phones. */
export function CartDrawer() {
  const { lines, gifts, isOpen, close, subtotal, setQuantity, remove, lastAddedKey } = useCart();
  const { region, info, money, setRegion, price, converted } = useRegion();
  const { chargeSubtotal } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 60);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      opener?.focus?.({ preventScroll: true });
    };
  }, [isOpen, close]);

  const empty = lines.length === 0;
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const justAdded = lastAddedKey && lines.some((l) => l.key === lastAddedKey);

  return (
    <div className={cn('fixed inset-0 z-[60]', isOpen ? 'pointer-events-auto' : 'pointer-events-none')} inert={!isOpen} aria-hidden={!isOpen}>
      <div onClick={close} className={cn('absolute inset-0 bg-charcoal/30 transition-opacity duration-500 ease-soft', isOpen ? 'opacity-100' : 'opacity-0')} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-title"
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-cream shadow-cloud transition-transform duration-[600ms] ease-soft',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-charcoal/10 px-5 sm:px-7">
          <h2 id="bag-title" className="font-serif text-[1.5rem] font-light tracking-[-0.02em]">
            Your bag{count > 0 && <span className="ml-2 font-sans text-[0.85rem] text-charcoal/50">({count})</span>}
          </h2>
          <button ref={closeRef} type="button" onClick={close} aria-label="Close bag" className="-mr-2.5 grid h-11 w-11 place-items-center rounded-full hover:bg-charcoal/[0.05]">
            <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-serif text-[1.6rem] font-light tracking-[-0.02em]">Your bag is empty.</p>
            <p className="mt-2 max-w-[30ch] text-[0.92rem] text-charcoal/60">Every blanket comes with a free cloud pillow.</p>
            <Button href="/shop" onClick={close} size="lg" className="mt-8">
              Shop the blanket
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7">
              <div className="mt-4 flex items-center gap-3 rounded-soft bg-espresso px-4 py-3 text-ivory">
                <Gift className="h-4 w-4 shrink-0" aria-hidden />
                <p className="text-[0.85rem]">
                  <span className="font-medium">Free cloud pillow unlocked</span>
                  <span className="text-ivory/70"> · {gifts > 1 ? `${gifts} pillows, one with each blanket` : 'one with every blanket'}</span>
                </p>
              </div>
              {justAdded && (
                <p className="mt-4 flex animate-fade items-center gap-2 text-[0.85rem] text-charcoal/75">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-charcoal text-ivory">
                    <Check className="h-3 w-3" strokeWidth={2.4} aria-hidden />
                  </span>
                  Added to your bag, with a free cloud pillow
                </p>
              )}

              <ul className="divide-y divide-charcoal/10">
                {lines.map((line) => {
                  const colour = getColour(line.selection.colour)!;
                  const size = getSize(line.selection.size)!;
                  const unit = price(size.id).price;
                  const img = cartImageFor(colour.id);
                  return (
                    <li key={line.key} className="flex gap-4 py-5">
                      <div className="relative h-[6.5rem] w-[5.2rem] shrink-0 overflow-hidden rounded-soft bg-oat-soft">
                        <SmartImage src={img.src} alt="" fill sizes="84px" quality={75} className="object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[0.95rem] font-medium leading-snug">
                              <TM>{PRODUCT.shortName}</TM>
                            </p>
                            <p className="mt-1 text-[0.82rem] text-charcoal/60">
                              {colour.label} · {size.label}
                            </p>
                          </div>
                          <p className="shrink-0 text-[0.95rem] tabular-nums">{money(unit * line.quantity)}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center rounded-full border border-charcoal/15">
                            <button
                              type="button"
                              onClick={() => setQuantity(line.key, line.quantity - 1)}
                              aria-label={`Decrease quantity of ${colour.label} ${size.label}`}
                              className="grid h-10 w-10 place-items-center rounded-full hover:bg-charcoal/[0.05]"
                            >
                              <Minus className="h-3.5 w-3.5" aria-hidden />
                            </button>
                            <span className="w-6 text-center text-[0.9rem] tabular-nums" aria-label={`Quantity ${line.quantity}`}>
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(line.key, line.quantity + 1)}
                              disabled={line.quantity >= MAX_QTY}
                              aria-label={`Increase quantity of ${colour.label} ${size.label}`}
                              className="grid h-10 w-10 place-items-center rounded-full hover:bg-charcoal/[0.05] disabled:opacity-35"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden />
                            </button>
                          </div>
                          <button type="button" onClick={() => remove(line.key)} className="px-1 py-2 text-[0.8rem] text-charcoal/55 underline decoration-charcoal/20 underline-offset-4 hover:text-charcoal">
                            Remove<span className="sr-only"> {colour.label} {size.label}</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}

                {/* The gift: derived from the blankets, never editable or chargeable */}
                <li className="flex items-center gap-4 py-5">
                  <div className="relative h-[5.2rem] w-[5.2rem] shrink-0 overflow-hidden rounded-soft bg-oat">
                    <SmartImage src={GIFT.image.src} alt="" fill sizes="84px" quality={75} className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-mocha">
                      <Gift className="h-3.5 w-3.5" aria-hidden /> Free gift
                    </p>
                    <p className="mt-1 text-[0.95rem] font-medium leading-snug">
                      <TM>{GIFT.name}</TM>
                      {gifts > 1 && <span className="ml-1.5 font-normal text-charcoal/60">× {gifts}</span>}
                    </p>
                    <p className="mt-0.5 text-[0.8rem] text-charcoal/55">{GIFT.mode === 'per-blanket' ? 'One with every blanket' : 'One with your order'}. Added automatically.</p>
                  </div>
                  <p className="shrink-0 text-[0.9rem] font-medium text-mocha">Free</p>
                </li>
              </ul>
            </div>

            <div className="shrink-0 border-t border-charcoal/10 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-7 sm:pb-7">
              <dl className="space-y-1.5 text-[0.9rem]">
                <div className="flex items-baseline justify-between">
                  <dt className="font-medium">Subtotal</dt>
                  <dd className="text-[1.15rem] font-medium tabular-nums">{money(subtotal)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 text-charcoal/60">
                  <dt>Delivery</dt>
                  <dd className="text-right">Free</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 text-charcoal/60">
                  <dt>Arrives in</dt>
                  <dd className="text-right">{deliveryCopy.estimate}</dd>
                </div>
              </dl>

              {info.checkout.enabled ? (
                <>
                  <Button href="/checkout" onClick={close} size="lg" fullWidth className="mt-5">
                    Checkout
                  </Button>
                  <p className="mt-2.5 text-center text-[0.75rem] text-charcoal/50">Secure payment by Square. Card, Apple Pay and Google Pay.</p>
                  {(converted || region === 'USD') && (
                    <p className="mt-1 text-center text-[0.75rem] text-charcoal/50">Charged in GBP: {formatPrice(chargeSubtotal)} before any delivery. Your card provider converts it.</p>
                  )}
                </>
              ) : (
                <div className="mt-5">
                  <p className="text-[0.82rem] leading-relaxed text-charcoal/65">{info.checkout.closedMessage}</p>
                  <Button onClick={() => setRegion('GBP')} variant="secondary" size="md" fullWidth className="mt-3">
                    Switch to pounds (£ GBP)
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
