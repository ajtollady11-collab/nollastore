'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gift, Lock, RotateCcw, Truck } from 'lucide-react';
import { ProductGallery } from './ProductGallery';
import { ColourSelector, SizeSelector } from './VariantSelectors';
import { SizeGuideDialog } from './SizeGuide';
import { useSelection } from './SelectionProvider';
import { LiveActivity } from './LiveActivity';
import { useCart } from '@/components/cart/CartProvider';
import { useRegion } from '@/components/store/RegionProvider';
import { SizePrice } from '@/components/ui/Price';
import { SmartImage } from '@/components/ui/SmartImage';
import { TM } from '@/components/ui/TM';
import { Accordion } from '@/components/ui/Accordion';
import { ReviewSummary } from '@/components/reviews/ReviewSummary';
import { GIFT, PRODUCT, chargedPriceFor } from '@/data/product';
import { productDetails } from '@/data/content';
import { deliveryCopy } from '@/data/site';
import { formatPrice } from '@/lib/format';

export const PRIMARY_ADD_ID = 'primary-add-to-bag';

/**
 * The main purchase block: gallery on the left, choices on the right.
 * On phones it stacks: gallery, then everything you need to buy.
 */
export function PurchaseSection() {
  const { selection, setColour, setSize } = useSelection();
  const { add, open } = useCart();
  const router = useRouter();
  const buyNow = () => {
    // Straight to checkout; if this currency can't check out yet, show the bag (it explains why)
    add(selection, { openCart: false });
    if (info.checkout.enabled) router.push('/checkout');
    else open();
  };
  const { region, info, money, price, converted, ready } = useRegion();
  const [guideOpen, setGuideOpen] = useState(false);
  const current = price(selection.size).price;

  return (
    <section id="shop" aria-labelledby="product-title" className="scroll-mt-20 pb-20 pt-10 sm:pt-16 lg:pb-28 lg:pt-20">
      <div className="container-soft grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14 xl:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery colour={selection.colour} />
        </div>

        <div className="min-w-0 lg:pt-2">
          <ReviewSummary />
          <h2 id="product-title" className="mt-3 font-serif text-[2.1rem] font-light leading-[1.05] tracking-[-0.03em] sm:text-[2.6rem]">
            <TM>{PRODUCT.name}</TM>
          </h2>
          <p className="mt-2 eyebrow">{PRODUCT.material}</p>
          <p className="mt-4 max-w-[46ch] text-[0.98rem] leading-relaxed text-charcoal/70">{PRODUCT.description}</p>

          <SizePrice size={selection.size} className="mt-6" />
          <p className="mt-2 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-mocha">
            <Gift className="h-4 w-4" aria-hidden />
            Free cloud pillow included
          </p>
          {region !== 'GBP' && (
            <p className="mt-2 text-[0.8rem] text-charcoal/55">
              {converted ? `Approximate price in ${region}. ` : ''}
              You’ll be charged {formatPrice(chargedPriceFor(selection.size, region === 'USD' ? 'US' : undefined))} in GBP
              {region === 'USD' ? ' (our US price)' : ''}; your card provider converts it.
            </p>
          )}

          <LiveActivity />

          <div className="mt-7 space-y-7 border-t border-charcoal/10 pt-7">
            <ColourSelector value={selection.colour} onChange={setColour} />
            <SizeSelector value={selection.size} onChange={setSize} onOpenGuide={() => setGuideOpen(true)} />
          </div>

          {/* The free gift, made impossible to miss */}
          <div className="mt-7 overflow-hidden rounded-soft border border-mocha/30 bg-ivory">
            <div className="flex items-center justify-between gap-3 bg-espresso px-4 py-2.5 text-ivory">
              <p className="inline-flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.14em]">
                <Gift className="h-4 w-4" aria-hidden />
                Free gift included
              </p>
              <p className="text-[0.78rem] text-ivory/75">With every blanket</p>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-soft bg-oat sm:h-24 sm:w-24">
                <SmartImage src={GIFT.image.src} alt={GIFT.image.alt} fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[1rem] font-medium leading-snug text-charcoal">
                  <TM>{GIFT.name}</TM>
                </p>
                <p className="mt-1 text-[0.85rem] leading-snug text-charcoal/65">{GIFT.description}. Added to your bag automatically, no code needed.</p>
              </div>
              <span className="shrink-0 rounded-full bg-mocha px-3 py-1 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-ivory">Free</span>
            </div>
          </div>

          <button
            id={PRIMARY_ADD_ID}
            type="button"
            onClick={() => add(selection)}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 text-[1rem] font-medium text-ivory transition-[background-color,transform] duration-300 ease-soft hover:bg-espresso active:scale-[0.99]"
          >
            <span>Add to bag</span>
            <span aria-hidden className="text-ivory/40">
              —
            </span>
            <span className="price-wait tabular-nums" data-ready={ready}>
              {money(current)}
            </span>
          </button>
          <button
            type="button"
            onClick={buyNow}
            className="mt-3 flex h-14 w-full items-center justify-center rounded-full border border-charcoal bg-transparent px-6 text-[1rem] font-medium text-charcoal transition-[background-color,color,transform] duration-300 ease-soft hover:bg-charcoal hover:text-ivory active:scale-[0.99]"
          >
            Buy it now
          </button>
          <p className="mt-3 text-center text-[0.84rem] text-charcoal/70">
            Blanket <span className="text-taupe">+</span> free cloud pillow <span className="text-taupe">+</span> free shipping
          </p>

          <ul className="mt-7 divide-y divide-charcoal/10 border-y border-charcoal/10 text-[0.88rem]">
            <ServiceRow icon={Truck} title={`${deliveryCopy.short} · ${deliveryCopy.estimate}`} body={deliveryCopy.detail} />
            <ServiceRow icon={RotateCcw} title={deliveryCopy.returns} body={deliveryCopy.returnsDetail} />
            {info.checkout.enabled ? (
              <ServiceRow icon={Lock} title="Secure checkout" body="Pay with card, Apple Pay or Google Pay through Square. Orders are charged in GBP." />
            ) : (
              <ServiceRow icon={Lock} title="Checkout" body={info.checkout.closedMessage ?? ''} />
            )}
          </ul>

          <Accordion
            tone="line"
            className="mt-2 border-t-0"
            items={productDetails.map((d) => ({ id: d.id, title: d.title, body: <TM>{d.body}</TM> }))}
          />
        </div>
      </div>

      <SizeGuideDialog open={guideOpen} onClose={() => setGuideOpen(false)} highlight={selection.size} onPick={setSize} />
    </section>
  );
}

function ServiceRow({ icon: Icon, title, body }: { icon: typeof Truck; title: string; body: string }) {
  return (
    <li className="flex gap-3.5 py-3.5">
      <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-mocha" strokeWidth={1.5} aria-hidden />
      <div>
        <p className="font-medium text-charcoal">{title}</p>
        <p className="mt-0.5 leading-relaxed text-charcoal/60">{body}</p>
      </div>
    </li>
  );
}
