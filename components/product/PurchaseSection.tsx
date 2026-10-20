'use client';

import { useState } from 'react';
import { Gift, Lock, RotateCcw, Truck } from 'lucide-react';
import { ProductGallery } from './ProductGallery';
import { ColourSelector, SizeSelector } from './VariantSelectors';
import { SizeGuideDialog } from './SizeGuide';
import { useSelection } from './SelectionProvider';
import { useCart } from '@/components/cart/CartProvider';
import { useRegion } from '@/components/store/RegionProvider';
import { SizePrice } from '@/components/ui/Price';
import { SmartImage } from '@/components/ui/SmartImage';
import { TM } from '@/components/ui/TM';
import { Accordion } from '@/components/ui/Accordion';
import { GIFT, PRODUCT, priceFor } from '@/data/product';
import { productDetails } from '@/data/content';
import { deliveryCopy } from '@/data/site';

export const PRIMARY_ADD_ID = 'primary-add-to-bag';

/**
 * The main purchase block: gallery on the left, choices on the right.
 * On phones it stacks: gallery, then everything you need to buy.
 */
export function PurchaseSection() {
  const { selection, setColour, setSize } = useSelection();
  const { add } = useCart();
  const { region, info, money, ready } = useRegion();
  const [guideOpen, setGuideOpen] = useState(false);
  const { price } = priceFor(selection.size, region);

  return (
    <section id="shop" aria-labelledby="product-title" className="scroll-mt-20 pb-20 pt-10 sm:pt-16 lg:pb-28 lg:pt-20">
      <div className="container-soft grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14 xl:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery colour={selection.colour} />
        </div>

        <div className="min-w-0 lg:pt-2">
          <p className="eyebrow">{PRODUCT.material}</p>
          <h2 id="product-title" className="mt-3 font-serif text-[2.1rem] font-light leading-[1.05] tracking-[-0.03em] sm:text-[2.6rem]">
            <TM>{PRODUCT.name}</TM>
          </h2>
          <p className="mt-3 max-w-[46ch] text-[0.98rem] leading-relaxed text-charcoal/70">{PRODUCT.description}</p>

          <SizePrice size={selection.size} className="mt-6" />

          <div className="mt-7 space-y-7 border-t border-charcoal/10 pt-7">
            <ColourSelector value={selection.colour} onChange={setColour} />
            <SizeSelector value={selection.size} onChange={setSize} onOpenGuide={() => setGuideOpen(true)} />
          </div>

          {/* The gift, right where the decision happens */}
          <div className="mt-7 flex items-center gap-4 rounded-soft border border-dashed border-taupe/60 bg-mocha-soft/60 p-3 pr-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-soft bg-oat">
              <SmartImage src={GIFT.image.src} alt="" fill sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[0.92rem] font-medium text-charcoal">A little cloud, on us.</p>
              <p className="mt-0.5 text-[0.84rem] leading-snug text-charcoal/65">
                Your blanket comes with a free <TM>{GIFT.name}</TM>. Added automatically, no code needed.
              </p>
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
              {money(price)}
            </span>
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.82rem] text-charcoal/65">
            <Gift className="h-3.5 w-3.5 text-mocha" aria-hidden />
            Free cloud pillow included with every blanket
          </p>

          <ul className="mt-7 divide-y divide-charcoal/10 border-y border-charcoal/10 text-[0.88rem]">
            <ServiceRow icon={Truck} title={info.delivery.short} body={info.delivery.detail} />
            <ServiceRow icon={RotateCcw} title={deliveryCopy.returns} body={deliveryCopy.returnsDetail} />
            {info.checkout.enabled ? (
              <ServiceRow icon={Lock} title="Secure checkout" body="Pay with card, Apple Pay or Google Pay through Square." />
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
