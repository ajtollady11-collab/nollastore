'use client';

import { useEffect, useState } from 'react';
import { useSelection } from './SelectionProvider';
import { PRIMARY_ADD_ID } from './PurchaseSection';
import { useCart } from '@/components/cart/CartProvider';
import { useRegion } from '@/components/store/RegionProvider';
import { SmartImage } from '@/components/ui/SmartImage';
import { cartImageFor, describeSelection, priceFor } from '@/data/product';
import { cn } from '@/lib/cn';

/**
 * Slim add-to-bag bar that appears once the main button has scrolled out of
 * view, and steps aside near the bottom of the page (final CTA and footer)
 * so it never covers the content people came down to read.
 */
export function StickyPurchaseBar() {
  const { selection } = useSelection();
  const { add, isOpen } = useCart();
  const { region, money, ready } = useRegion();
  const [pastButton, setPastButton] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

  // Position-based (not IntersectionObserver): jumping from the footer straight to the top
  // never "crosses" the button, so an observer would leave the bar stuck open.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const button = document.getElementById(PRIMARY_ADD_ID);
      const stops = Array.from(document.querySelectorAll('[data-sticky-stop]'));
      setPastButton(Boolean(button && button.getBoundingClientRect().bottom < 0));
      setNearEnd(stops.some((el) => el.getBoundingClientRect().top < window.innerHeight));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const visible = pastButton && !nearEnd && !isOpen;
  const img = cartImageFor(selection.colour);
  const { price } = priceFor(selection.size, region);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-charcoal/10 bg-cream/95 shadow-bar backdrop-blur-md transition-transform duration-500 ease-soft',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      inert={!visible}
      aria-hidden={!visible}
    >
      <div className="container-soft flex items-center gap-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:gap-4">
        <a href="#shop" className="relative hidden h-12 w-10 shrink-0 overflow-hidden rounded-soft bg-oat-soft sm:block" aria-label="Back to colour and size options">
          <SmartImage src={img.src} alt="" fill sizes="40px" quality={75} className="object-cover" />
        </a>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.85rem] font-medium text-charcoal sm:text-[0.92rem]">
            <span className="hidden sm:inline">Nuv™ Velvet Blanket · </span>
            {describeSelection(selection)}
          </p>
          <a href="#shop" className="text-[0.78rem] text-charcoal/60 underline decoration-charcoal/20 underline-offset-4">
            Change
          </a>
        </div>
        <button
          type="button"
          onClick={() => add(selection)}
          className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-charcoal px-5 text-[0.92rem] font-medium text-ivory transition-colors hover:bg-espresso sm:px-7"
        >
          Add to bag
          <span className="price-wait tabular-nums text-ivory/75" data-ready={ready}>
            {money(price)}
          </span>
        </button>
      </div>
    </div>
  );
}
